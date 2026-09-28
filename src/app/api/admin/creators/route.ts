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
    const { action, creatorId } = body;

    if (!creatorId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (action === "verify") {
      db.updateCreatorStatus(creatorId, "ACTIVE");
    } else if (action === "ban") {
      db.updateCreatorStatus(creatorId, "BANNED");
    } else if (action === "unban") {
      db.updateCreatorStatus(creatorId, "ACTIVE");
    }

    const creators = db.getCreators();
    const users = db.getUsers();
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

    return NextResponse.json({
      success: true,
      creators,
      users: adminUsers,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process creator action" }, { status: 500 });
  }
}
