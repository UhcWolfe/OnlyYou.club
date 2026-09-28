import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";
import { User } from "@/types";

export async function GET(request: NextRequest) {
  const sessionCookies = request.cookies.getAll("onlyyou_session");
  if (!sessionCookies || sessionCookies.length === 0) {
    return NextResponse.json({ user: null });
  }

  let user: any = null;
  for (const c of sessionCookies) {
    try {
      let rawCookie = c.value;
      if (rawCookie.startsWith("%7B") || rawCookie.includes("%22") || rawCookie.includes("%")) {
        try {
          rawCookie = decodeURIComponent(rawCookie);
        } catch {}
      }
      const parsed = JSON.parse(rawCookie);
      if (parsed && (parsed.id || parsed.discordId)) {
        user = parsed;
        break;
      }
    } catch {}
  }

  if (!user) {
    return NextResponse.json({ user: null });
  }

  try {

    // If accessToken is present and discordBannerUrl is missing, auto-fetch from Discord v10
    if (user.accessToken && !user.discordBannerUrl) {
      try {
        const discordRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        if (discordRes.ok) {
          const discordData = await discordRes.json();
          if (discordData.banner) {
            const isAnimated = typeof discordData.banner === "string" && discordData.banner.startsWith("a_");
            const ext = isAnimated ? "gif" : "png";
            const bannerUrl = `https://cdn.discordapp.com/banners/${discordData.id}/${discordData.banner}.${ext}?size=1024`;
            user.discordBannerUrl = bannerUrl;
            if (!user.customBannerUrl) {
              user.bannerUrl = bannerUrl;
              if (user.creator) {
                user.creator.bannerUrl = bannerUrl;
              }
            }
          }
          if (discordData.banner_color || discordData.accent_color != null) {
            user.bannerColor = discordData.accent_color != null
              ? `#${discordData.accent_color.toString(16).padStart(6, "0")}`
              : discordData.banner_color;
          }
        }
      } catch {}
    }

    const discordUserId = user.discordId || user.id;

    // 1. Check if user has Creator role on Discord server (ID: 1545577126864883742)
    let hasDiscordCreatorRole = false;
    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID || "1538599595926495367";

    if (botToken && guildId && discordUserId) {
      try {
        const memberRes = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
          {
            headers: { Authorization: `Bot ${botToken}` },
            signal: AbortSignal.timeout(1500),
          }
        );
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          const roles: string[] = memberData.roles || [];
          if (
            roles.includes("1545577126864883742") ||
            roles.includes(process.env.DISCORD_CREATOR_ROLE_ID || "")
          ) {
            hasDiscordCreatorRole = true;
          }
        }
      } catch {}
    }

    // 2. Check if user has active creator profile in database
    const matchingCreator = db.getCreators().find(
      (c) =>
        (discordUserId && (c.discordId === discordUserId || c.userId === discordUserId)) ||
        c.id === `creator_${discordUserId}`
    );
    const hasActiveCreatorProfile = Boolean(matchingCreator && matchingCreator.status === "ACTIVE");

    const savedUser = user.id ? db.getUserById(user.id) : null;
    const isOwner = user.discordId === "1003433567155671183" || user.id === "1003433567155671183";

    // Use savedUser badges if present as the authoritative source
    const baseBadges: string[] = Array.isArray(savedUser?.badges)
      ? [...savedUser!.badges]
      : Array.isArray(user.badges)
      ? [...user.badges]
      : [];

    if (isOwner && !baseBadges.includes("admin")) {
      baseBadges.push("admin");
    }

    // Only consider creator if explicitly in baseBadges or granted via Discord role (and user hasn't explicitly been unbadged in db)
    const isCreator = baseBadges.includes("creator") || (hasDiscordCreatorRole && !savedUser);

    if (isCreator && !baseBadges.includes("creator")) {
      baseBadges.push("creator");
    }

    const finalBadges = Array.from(new Set(baseBadges));

    let userRole = savedUser?.role || user.role || "USER";
    if (isOwner || finalBadges.includes("admin")) {
      userRole = "ADMIN";
    } else if (isCreator) {
      userRole = "CREATOR";
    } else {
      userRole = "USER";
    }

    let creatorObj = isCreator ? (matchingCreator || savedUser?.creator || user.creator || null) : null;
    if (!isCreator && matchingCreator && matchingCreator.status !== "BANNED") {
      db.deleteCreator(matchingCreator.id);
      if (matchingCreator.userId) db.deleteCreator(matchingCreator.userId);
      if (matchingCreator.discordId) db.deleteCreator(matchingCreator.discordId);
    }
    if (isCreator && !creatorObj) {
      creatorObj = {
        id: `creator_${discordUserId}`,
        userId: discordUserId,
        discordId: discordUserId,
        name: savedUser?.displayName || user.displayName || user.username || "Creator",
        bio: savedUser?.bio || user.bio || "",
        category: "Ogólne",
        tags: ["creator"],
        contentType: "Mixed",
        avatarUrl: savedUser?.avatarUrl || user.avatarUrl || null,
        bannerUrl: savedUser?.customBannerUrl || user.customBannerUrl || null,
        followerCount: 0,
        postCount: 0,
        totalViews: 0,
        totalLikes: 0,
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        badges: ["creator"],
      };
      db.saveCreator(creatorObj);
    }

    let finalUser: User = {
      ...user,
      ...(savedUser || {}),
      badges: finalBadges,
      role: userRole,
      creator: isCreator ? creatorObj : null,
    };

    db.saveUser(finalUser);

    if (finalUser && (finalUser.creator || finalUser.id)) {
      const creatorId = finalUser.creator?.id || `creator_${finalUser.id}`;
      const creatorPosts = db.getCreatorPosts(creatorId);
      const postCount = creatorPosts.length;
      const totalViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const totalLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);

      if (finalUser.creator) {
        finalUser.creator.postCount = postCount;
        finalUser.creator.totalViews = Math.max(finalUser.creator.totalViews || 0, totalViews);
        finalUser.creator.totalLikes = Math.max(finalUser.creator.totalLikes || 0, totalLikes);
      }
    }

    const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const host = rawHost.split(",")[0].trim();
    const cookieDomain = host.includes("onlyyouhub.com")
      ? ".onlyyouhub.com"
      : host.includes("onlyyou.club")
      ? ".onlyyou.club"
      : undefined;

    const sessionCookieData = {
      id: finalUser.id,
      discordId: finalUser.discordId || finalUser.id,
      username: finalUser.username,
      displayName: finalUser.displayName,
      avatarUrl: finalUser.avatarUrl,
      role: finalUser.role,
      badges: finalUser.badges,
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

    const response = NextResponse.json({ user: finalUser });
    response.cookies.set("onlyyou_session", JSON.stringify(sessionCookieData), cookieOptions);
    return response;
  } catch (err) {
    console.error("[/api/auth/me error]:", err);
    return NextResponse.json({ user: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updatedUser = body.user;
    if (!updatedUser) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    // Persist user and creator data to disk
    db.saveUser(updatedUser);

    const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const host = rawHost.split(",")[0].trim();
    const cookieDomain = host.includes("onlyyouhub.com")
      ? ".onlyyouhub.com"
      : host.includes("onlyyou.club")
      ? ".onlyyou.club"
      : undefined;

    const sessionCookieData = {
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

    const response = NextResponse.json({ success: true, user: updatedUser });
    response.cookies.set("onlyyou_session", JSON.stringify(sessionCookieData), cookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
