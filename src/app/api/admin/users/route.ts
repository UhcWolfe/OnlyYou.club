import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";
import { User } from "@/types";
import { AdminUserItem } from "@/lib/admin/admin-store";

export const dynamic = "force-dynamic";

function getAuthenticatedUser(request: NextRequest): User | null {
  const sessionCookie = request.cookies.get("onlyyou_session")?.value;
  if (!sessionCookie) return null;

  try {
    let raw = sessionCookie;
    if (raw.startsWith("%7B") || raw.includes("%22")) {
      raw = decodeURIComponent(raw);
    }
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const sessionUser = getAuthenticatedUser(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = sessionUser.id === "1003433567155671183" || sessionUser.discordId === "1003433567155671183";
  const isAdmin = isOwner || sessionUser.role === "ADMIN" || (sessionUser.badges && sessionUser.badges.includes("admin"));

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, badgeId } = body;

    if (!userId || !badgeId) {
      return NextResponse.json({ error: "Missing userId or badgeId" }, { status: 400 });
    }

    // Ensure user exists in db if toggling self
    if (!db.getUserById(userId) && !db.getUserById(userId.replace(/^creator_/, ""))) {
      if (sessionUser.id === userId || sessionUser.discordId === userId) {
        db.saveUser(sessionUser);
      }
    }

    const updatedUser = db.toggleUserBadge(userId, badgeId);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const users = db.getUsers();
    const creators = db.getCreators().filter((c) => (c.badges || []).includes("creator") || (c.user?.badges || []).includes("creator") || c.status === "BANNED");

    const adminUsers: AdminUserItem[] = users.map((u) => {
      const isUserCreator = (u.badges || []).includes("creator");
      const status: "ACTIVE" | "SUSPENDED" | "BANNED" = u.isRestricted ? "BANNED" : "ACTIVE";
      const role: "USER" | "CREATOR" | "ADMIN" = (u.badges || []).includes("admin")
        ? "ADMIN"
        : isUserCreator
        ? "CREATOR"
        : "USER";

      return {
        id: u.id,
        discordId: u.discordId || u.id,
        username: u.username || "User",
        displayName: u.displayName || u.username || "User",
        avatarUrl: u.avatarUrl || null,
        badges: u.badges || [],
        role,
        isCreator: isUserCreator,
        status,
        createdAt: u.createdAt || new Date().toISOString(),
      };
    });

    const response = NextResponse.json({
      success: true,
      users: adminUsers,
      creators,
      updatedUser,
    });

    // If the admin modified their own badges/role, sync the session cookie
    const isSelf =
      sessionUser.id === userId ||
      sessionUser.discordId === userId ||
      sessionUser.id === updatedUser.id ||
      sessionUser.discordId === updatedUser.discordId ||
      userId.includes(sessionUser.id) ||
      (sessionUser.discordId && userId.includes(sessionUser.discordId));

    if (isSelf) {
      const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
      const host = rawHost.split(",")[0].trim();
      const cookieDomain = host.includes("onlyyouhub.com")
        ? ".onlyyouhub.com"
        : host.includes("onlyyou.club")
        ? ".onlyyou.club"
        : undefined;

      const cookieData = {
        id: updatedUser.id,
        discordId: updatedUser.discordId || updatedUser.id,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
        badges: updatedUser.badges,
      };

      const cookieOptions: any = {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      };
      if (cookieDomain) {
        cookieOptions.domain = cookieDomain;
      }

      response.cookies.set("onlyyou_session", JSON.stringify(cookieData), cookieOptions);
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to toggle badge" }, { status: 500 });
  }
}
