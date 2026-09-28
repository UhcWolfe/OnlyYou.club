import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { OnlyYouApiClient } from "@/lib/api/client";
import { UnifiedProfileView } from "@/components/profile/UnifiedProfileView";
import { db } from "@/lib/storage/db";
import { Creator, User } from "@/types";
import { siteConfig } from "@/config/site";

interface UserProfilePageProps {
  params: { username: string };
}

const RESERVED_ROUTES = new Set([
  "admin",
  "api",
  "creator",
  "creator-program",
  "creators",
  "dashboard",
  "explore",
  "login",
  "post",
  "profile",
  "settings",
  "trending",
  "uploads",
  "terms",
  "regulamin",
  "privacy",
  "prywatnosc",
  "copyright",
  "prawa-autorskie",
  "dmca",
  "faq",
  "legal",
  "rules",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const rawParam = decodeURIComponent(params.username);
  const cleanUsername = rawParam.toLowerCase().replace(/[\s_]+/g, "");
  if (RESERVED_ROUTES.has(cleanUsername)) {
    return { title: "Nie znaleziono" };
  }

  const creator = await OnlyYouApiClient.getCreatorByIdOrUsername(rawParam);
  if (!creator) {
    return { title: "Profil — OnlyYou" };
  }

  const categoryText = creator.category || "Twórca 18+";
  const bioExcerpt = creator.bio ? creator.bio.slice(0, 160) : `Profil i darmowe materiały twórczyni ${creator.name} na OnlyYou. Oglądaj filmy, zdjęcia i dołącz do społeczności.`;
  const canonicalUrl = `https://${siteConfig.domain}/${encodeURIComponent(rawParam)}`;

  return {
    title: `${creator.name} — Filmy 18+, Zdjęcia i Profil Twórcy | OnlyYou`,
    description: `${bioExcerpt} • Kategoria: ${categoryText}.`,
    keywords: [
      creator.name,
      `${creator.name} porno`,
      `${creator.name} onlyyou`,
      `${creator.name} 18+`,
      `${creator.name} zdjęcia`,
      `${creator.name} filmy`,
      categoryText,
      "polskie porno",
      "filmy erotyczne",
      "twórcy 18+"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${creator.name} — Filmy 18+ i Profil na OnlyYou`,
      description: bioExcerpt,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: creator.avatarUrl ? [creator.avatarUrl] : [],
    },
    twitter: {
      card: "summary",
      title: `${creator.name} — Profil 18+ OnlyYou`,
      description: bioExcerpt,
      images: creator.avatarUrl ? [creator.avatarUrl] : [],
    },
    other: {
      rating: "RTA-5042-1996-1400-1577-RTA",
      "RATING": "adult",
      "Age-Rating": "18+",
    },
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const rawParam = decodeURIComponent(params.username);
  const cleanUsername = rawParam.toLowerCase().replace(/[\s_]+/g, "");

  if (RESERVED_ROUTES.has(cleanUsername)) {
    notFound();
  }

  // Restore user from session cookie if present
  let sessionUser: User | null = null;
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll("onlyyou_session");
    for (const c of allCookies) {
      try {
        let raw = c.value;
        if (raw.startsWith("%7B") || raw.includes("%22") || raw.includes("%")) {
          raw = decodeURIComponent(raw);
        }
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.id || parsed.username)) {
          sessionUser = parsed;
          break;
        }
      } catch {}
    }
  } catch {}

  let creator = await OnlyYouApiClient.getCreatorByIdOrUsername(rawParam);

  // If creator still not found, check if it matches the current session user
  if (!creator && sessionUser) {
    const userClean = (sessionUser.username || sessionUser.displayName || "").toLowerCase().replace(/[\s_]+/g, "");
    if (
      userClean === cleanUsername ||
      sessionUser.id === rawParam ||
      sessionUser.discordId === rawParam
    ) {
      const liveUser = db.getUserById(sessionUser.id) || sessionUser;
      const userBadges = Array.isArray(liveUser.badges) ? liveUser.badges : (liveUser.role === "ADMIN" ? ["admin"] : []);
      creator = {
        id: sessionUser.creator?.id || `creator_${sessionUser.id}`,
        userId: sessionUser.id,
        discordId: sessionUser.discordId,
        name: sessionUser.displayName || sessionUser.username,
        bio: sessionUser.bio || sessionUser.creator?.bio || "Oficjalny twórca & Administrator OnlyYou",
        category: sessionUser.creator?.category || "Ogólne",
        tags: sessionUser.creator?.tags || ["official", "creator", "admin"],
        gender: sessionUser.creator?.gender || sessionUser.gender || null,
        orientation: sessionUser.creator?.orientation || sessionUser.orientation || null,
        contentType: "Mixed",
        avatarUrl: sessionUser.avatarUrl,
        bannerUrl:
          sessionUser.customBannerUrl ||
          sessionUser.creator?.bannerUrl ||
          sessionUser.bannerUrl ||
          sessionUser.discordBannerUrl ||
          null,
        followerCount: sessionUser.creator?.followerCount || 0,
        postCount: 0,
        totalViews: sessionUser.creator?.totalViews || 0,
        totalLikes: sessionUser.creator?.totalLikes || 0,
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: sessionUser.createdAt,
        createdAt: sessionUser.createdAt,
        badges: userBadges,
        user: liveUser,
      };
      // Do not save to creators.json here
    }
  }

  // Guaranteed fallback for admin/owner
  if (!creator && (cleanUsername === "uhcwolfe" || rawParam === "1003433567155671183")) {
    const dbOwner = db.getUserById("1003433567155671183");
    const ownerBadges = Array.isArray(dbOwner?.badges)
      ? dbOwner!.badges
      : (Array.isArray(sessionUser?.badges) ? sessionUser!.badges : ["admin"]);

    creator = {
      id: "creator_1003433567155671183",
      userId: "1003433567155671183",
      discordId: "1003433567155671183",
      name: "UhcWolfe",
      bio: "Administrator OnlyYou",
      category: "Ogólne",
      tags: ["official", "admin"],
      gender: "Mężczyzna",
      orientation: "Biseksualna",
      contentType: "Mixed",
      avatarUrl: sessionUser?.avatarUrl || null,
      bannerUrl: sessionUser?.customBannerUrl || sessionUser?.bannerUrl || null,
      followerCount: 0,
      postCount: 0,
      totalViews: 0,
      totalLikes: 0,
      trendingScore: 100,
      status: "ACTIVE",
      webConsent: true,
      webConsentAt: new Date().toISOString(),
      createdAt: "2026-09-09T00:00:00.000Z",
      badges: ownerBadges,
      user: dbOwner || sessionUser || undefined,
    };
    // Do not save to creators.json here
  }

  // Guaranteed fallback for official OnlyYou | Club profile
  if (!creator && (cleanUsername === "onlyyou" || cleanUsername === "onlyyouclub" || cleanUsername === "onlyyouofficial")) {
    creator = db.getCreatorByIdOrUsername("creator_onlyyou_official");
  }

  if (!creator) {
    notFound();
  }

  const postsResult = await OnlyYouApiClient.getCreatorPosts(creator.id, { limit: 50 });
  const creatorPosts = postsResult?.data || [];
  const calculatedViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const calculatedLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);

  const enrichedCreator: Creator = {
    ...creator,
    postCount: creatorPosts.length,
    totalViews: Math.max(creator.totalViews || 0, calculatedViews),
    totalLikes: Math.max(creator.totalLikes || 0, calculatedLikes),
  };

  return (
    <UnifiedProfileView
      creator={enrichedCreator}
      posts={creatorPosts}
    />
  );
}
