import React from "react";
import { Metadata } from "next";
import { OnlyYouApiClient } from "@/lib/api/client";
import { CreatorsFeed } from "@/components/creators/CreatorsFeed";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Twórcy i Modelki 18+ — Profile, Zdjęcia i Filmy | OnlyYou",
  description:
    "Przeglądaj zweryfikowane profile polskich i zagranicznych twórczyń treści dla dorosłych, modelek erotycznych, cosplay i fitness. Dołącz do ich Creator Hubów.",
  keywords: [
    "twórcy 18+",
    "modelki porno",
    "polskie modelki erotyczne",
    "dziewczyny 18+",
    "profile twórców",
    "creator hubs",
    "onlyyou twórcy"
  ],
  alternates: {
    canonical: `https://${siteConfig.domain}/creators`,
  },
  openGraph: {
    title: "Twórcy i Modelki 18+ — OnlyYou Creator Directory",
    description: "Katalog zweryfikowanych polskich i zagranicznych twórców materiałów 18+.",
    url: `https://${siteConfig.domain}/creators`,
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

export default async function CreatorsPage() {
  const [trendingCreators, newCreators, allCreators] = await Promise.all([
    OnlyYouApiClient.getTrendingCreators(8),
    OnlyYouApiClient.getNewCreators(4),
    OnlyYouApiClient.getCreators({ limit: 24 }),
  ]);

  return (
    <CreatorsFeed
      trendingCreators={trendingCreators}
      newCreators={newCreators}
      allCreators={allCreators.data}
    />
  );
}
