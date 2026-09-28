import React from "react";
import { Metadata } from "next";
import { OnlyYouApiClient } from "@/lib/api/client";
import { TrendingFeed } from "@/components/discovery/TrendingFeed";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Na Czasie — Najgorętsze Filmy 18+, Trendy i Popularne Twórczynie",
  description:
    "Zobacz najpopularniejsze filmy porno, najgorętsze publikacje i najchętniej oglądane polskie twórczynie na OnlyYou. Codziennie nowe trendy i rankingi.",
  keywords: [
    "porno na czasie",
    "popularne filmy porno",
    "trendy 18+",
    "polskie porno trendy",
    "gorące twórczynie",
    "najlepsze filmy erotyczne"
  ],
  alternates: {
    canonical: `https://${siteConfig.domain}/trending`,
  },
  openGraph: {
    title: "Na Czasie — Filmy 18+ i Najpopularniejsze Twórczynie | OnlyYou",
    description: "Codzienny ranking najpopularniejszych filmów i twórczyń 18+.",
    url: `https://${siteConfig.domain}/trending`,
    siteName: siteConfig.name,
    images: ["/logo.png"],
  },
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA",
    "RATING": "adult",
    "Age-Rating": "18+",
  },
};

export const revalidate = 60;

export default async function TrendingPage() {
  const [trendingPosts, trendingCreators] = await Promise.all([
    OnlyYouApiClient.getTrendingPosts(16),
    OnlyYouApiClient.getTrendingCreators(8),
  ]);

  return (
    <TrendingFeed
      trendingPosts={trendingPosts}
      trendingCreators={trendingCreators}
    />
  );
}
