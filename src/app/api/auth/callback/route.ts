import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";
import { getAppUrl } from "@/lib/auth/get-app-url";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const appUrl = getAppUrl(request);

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=no_code`);
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_credentials`);
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for token:", await tokenResponse.text());
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Discord v10 API
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=user_fetch_failed`);
    }

    const discordUser = await userResponse.json();

    console.log("[Discord Auth v10] User data:", {
      id: discordUser.id,
      username: discordUser.username,
      banner: discordUser.banner,
      banner_color: discordUser.banner_color,
      accent_color: discordUser.accent_color,
    });

    // 3. Build authenticated user object
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || "0") % 5}.png`;

    let discordBanner: string | null = null;
    if (discordUser.banner) {
      const isAnimated = typeof discordUser.banner === "string" && discordUser.banner.startsWith("a_");
      const ext = isAnimated ? "gif" : "png";
      discordBanner = `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.${ext}?size=1024`;
    }

    const bannerColor = discordUser.accent_color != null
      ? `#${discordUser.accent_color.toString(16).padStart(6, "0")}`
      : discordUser.banner_color || null;

    const isOwner = discordUser.id === "1003433567155671183";
    const existingUser = db.getUserById(discordUser.id);
    // Check if user is registered in creators.json
    const matchingCreator = db.getCreators().find(
      (c) =>
        c.discordId === discordUser.id ||
        c.userId === discordUser.id ||
        c.id === `creator_${discordUser.id}`
    );

    // Check Discord roles via bot token
    let hasDiscordCreatorRole = false;
    const botToken = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID || "1538599595926495367";
    if (botToken && guildId) {
      try {
        const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUser.id}`, {
          headers: { Authorization: `Bot ${botToken}` },
          signal: AbortSignal.timeout(2000),
        });
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          const roles: string[] = memberData.roles || [];
          if (roles.includes("1545577126864883742") || roles.includes(process.env.DISCORD_CREATOR_ROLE_ID || "")) {
            hasDiscordCreatorRole = true;
          }
        }
      } catch {}
    }

    const baseBadges = Array.isArray(existingUser?.badges) ? [...existingUser!.badges] : [];
    if (isOwner && !baseBadges.includes("admin")) {
      baseBadges.push("admin");
    }

    // Authoritative check for creator badge:
    // If user already exists in db, only keep creator badge if it's already in baseBadges.
    // If it's a new user, they get creator badge if they have Discord creator role or active creator profile.
    const isCreator = existingUser
      ? baseBadges.includes("creator")
      : (Boolean(matchingCreator && matchingCreator.status === "ACTIVE") || hasDiscordCreatorRole);

    if (isCreator && !baseBadges.includes("creator")) {
      baseBadges.push("creator");
    }
    const badges = Array.from(new Set(baseBadges));

    let userRole = (existingUser?.role as any) || (isOwner ? "ADMIN" : "USER");
    if (isOwner || badges.includes("admin")) {
      userRole = "ADMIN";
    } else if (badges.includes("creator")) {
      userRole = "CREATOR";
    } else {
      userRole = "USER";
    }

    let userCreator: any = null;
    if (badges.includes("creator")) {
      userCreator = existingUser?.creator || matchingCreator || {
        id: `creator_${discordUser.id}`,
        userId: discordUser.id,
        discordId: discordUser.id,
        name: existingUser?.displayName || discordUser.global_name || discordUser.username,
        bio: existingUser?.bio || (isOwner ? "Administrator OnlyYou" : ""),
        category: "Ogólne",
        tags: isOwner ? ["official", "admin", "creator"] : ["creator"],
        gender: existingUser?.gender || null,
        orientation: existingUser?.orientation || null,
        contentType: "Mixed",
        avatarUrl,
        bannerUrl: existingUser?.customBannerUrl || discordBanner,
        followerCount: 0,
        postCount: 0,
        totalViews: 0,
        totalLikes: 0,
        trendingScore: 100,
        status: "ACTIVE" as const,
        webConsent: true,
        webConsentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        badges: badges,
      };
      db.saveCreator(userCreator);
    } else {
      db.deleteCreator(discordUser.id);
      db.deleteCreator(`creator_${discordUser.id}`);
      if (matchingCreator) {
        db.deleteCreator(matchingCreator.id);
      }
    }

    const user = {
      id: discordUser.id,
      discordId: discordUser.id,
      username: discordUser.username,
      displayName: discordUser.global_name || discordUser.username,
      avatarUrl,
      bannerUrl: existingUser?.customBannerUrl || existingUser?.bannerUrl || discordBanner,
      discordBannerUrl: discordBanner,
      customBannerUrl: existingUser?.customBannerUrl || null,
      bannerColor: bannerColor,
      accessToken,
      language: existingUser?.language || "PL",
      xp: existingUser?.xp || 150,
      level: existingUser?.level || 1,
      warningsCount: existingUser?.warningsCount || 0,
      isAdultVerified: isOwner ? true : (existingUser?.isAdultVerified ?? false),
      adultVerifiedAt: isOwner ? (existingUser?.adultVerifiedAt || new Date().toISOString()) : (existingUser?.adultVerifiedAt || null),
      isRestricted: existingUser?.isRestricted ?? false,
      restrictionReason: existingUser?.restrictionReason || null,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: existingUser?.bio || (isOwner ? "Oficjalny twórca & Administrator OnlyYou" : null),
      gender: existingUser?.gender || null,
      badges,
      role: userRole,
      creator: userCreator,
    };

    // Persist to database
    db.saveUser(user);

    // 4. Set lightweight session cookie and redirect
    const sessionCookieData = {
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      badges: user.badges,
    };

    const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const host = rawHost.split(",")[0].trim();
    const cookieDomain = host.includes("onlyyouhub.com")
      ? ".onlyyouhub.com"
      : host.includes("onlyyou.club")
      ? ".onlyyou.club"
      : undefined;

    const profilePath = user.username ? `/${encodeURIComponent(user.username.toLowerCase())}` : "/profile";
    const redirectUrl = `${appUrl}${profilePath}`;
    const response = NextResponse.redirect(redirectUrl);

    const cookieOptions: any = {
      path: "/",
      httpOnly: false, // readable by client context
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    };
    if (cookieDomain) {
      cookieOptions.domain = cookieDomain;
    }

    response.cookies.set("onlyyou_session", JSON.stringify(sessionCookieData), cookieOptions);

    return response;
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_error`);
  }
}
