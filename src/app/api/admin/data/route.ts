import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";
import { Creator, User } from "@/types";
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

export async function GET(request: NextRequest) {
  const sessionUser = getAuthenticatedUser(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = sessionUser.id === "1003433567155671183" || sessionUser.discordId === "1003433567155671183";
  const isAdmin = isOwner || sessionUser.role === "ADMIN" || (sessionUser.badges && sessionUser.badges.includes("admin"));

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  // Ensure current admin user is saved to users.json if not present
  const existingDbUser = db.getUserById(sessionUser.id) || (sessionUser.discordId ? db.getUserById(sessionUser.discordId) : null);
  if (!existingDbUser) {
    if (isOwner) {
      sessionUser.badges = Array.from(new Set([...(sessionUser.badges || []), "admin"]));
      sessionUser.role = "ADMIN";
    }
    db.saveUser(sessionUser);
  }

  // Sync users and creators
  let users = db.getUsers();
  if (users.length === 0 && sessionUser) {
    users = [sessionUser];
  }

  let creators = db.getCreators();

  // Ensure all users in users.json are also reflected in creators list
  for (const u of users) {
    const cleanUId = u.id.toLowerCase().replace(/^(creator_)/, "");
    let existingCreator = creators.find(
      (c) =>
        c.id === u.id ||
        c.userId === u.id ||
        c.discordId === u.discordId ||
        (c.id && c.id.replace(/^(creator_)/, "") === cleanUId) ||
        (c.userId && c.userId.replace(/^(creator_)/, "") === cleanUId)
    );

    const userIsCreator = Boolean(u.badges?.includes("creator"));

    if (existingCreator) {
      if (!userIsCreator && existingCreator.status !== "BANNED") {
        db.deleteCreator(existingCreator.id);
        db.deleteCreator(u.id);
        if (u.discordId) db.deleteCreator(u.discordId);
      } else {
        existingCreator.user = u;
        existingCreator.avatarUrl = u.avatarUrl || existingCreator.avatarUrl;
        existingCreator.name = u.displayName || u.username || existingCreator.name;
        existingCreator.badges = Array.isArray(u.badges) ? u.badges : existingCreator.badges;
        if (userIsCreator && existingCreator.status !== "BANNED") {
          existingCreator.status = "ACTIVE";
          existingCreator.webConsent = true;
        }
        const creatorPosts = db.getCreatorPosts(existingCreator.id || u.id);
        existingCreator.postCount = creatorPosts.length;
        existingCreator.totalViews = creatorPosts.reduce((acc, p) => acc + (Number(p.views) || 0), 0);
        existingCreator.totalLikes = creatorPosts.reduce((acc, p) => acc + (Number(p.likes) || 0), 0);
        db.saveCreator(existingCreator);
      }
    } else if (userIsCreator) {
      const creatorPosts = db.getCreatorPosts(u.id);
      const newCreator: Creator = {
        id: u.creator?.id || `creator_${u.id}`,
        userId: u.id,
        discordId: u.discordId,
        name: u.displayName || u.username,
        bio: u.bio || "",
        category: u.creator?.category || "Ogólne",
        tags: ["creator"],
        gender: u.gender || null,
        orientation: u.orientation || null,
        contentType: "Mixed",
        avatarUrl: u.avatarUrl,
        bannerUrl: u.customBannerUrl || u.bannerUrl || null,
        followerCount: u.creator?.followerCount || 0,
        postCount: creatorPosts.length,
        totalViews: creatorPosts.reduce((acc, p) => acc + (Number(p.views) || 0), 0),
        totalLikes: creatorPosts.reduce((acc, p) => acc + (Number(p.likes) || 0), 0),
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: u.createdAt,
        createdAt: u.createdAt,
        badges: u.badges || ["creator"],
        user: u,
      };
      db.saveCreator(newCreator);
    }
  }

  // Reload creators strictly filtered to actual verified creators or banned accounts
  const validCreators = db
    .getCreators()
    .filter((c) => (c.badges || []).includes("creator") || (c.user?.badges || []).includes("creator") || c.status === "BANNED");

  // Format users for AdminUserItem
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

  const reports = db.getReports();
  const stats = db.getGlobalStats();

  return NextResponse.json({
    success: true,
    creators: validCreators,
    users: adminUsers,
    reports,
    stats,
  });
}
