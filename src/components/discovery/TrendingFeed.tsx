"use client";

import React from "react";
import { Creator, Post } from "@/types";
import { PostGrid } from "@/components/posts/PostGrid";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { DiscoverySection } from "@/components/discovery/DiscoverySection";
import { useTranslation } from "@/lib/i18n/context";
import { Flame, TrendingUp } from "lucide-react";

interface TrendingFeedProps {
  trendingPosts: Post[];
  trendingCreators: Creator[];
}

export const TrendingFeed: React.FC<TrendingFeedProps> = ({
  trendingPosts,
  trendingCreators,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Flame className="w-7 h-7 text-pink-500" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("discovery.trending_title")}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          {t("discovery.trending_subtitle")}
        </p>
      </div>

      <DiscoverySection
        title={`🔥 ${t("discovery.trending_title")} — ${t("nav.explore")}`}
        subtitle={t("discovery.latest_posts_subtitle")}
        icon={<TrendingUp className="w-5 h-5 text-brand-primary" />}
      >
        <PostGrid posts={trendingPosts} />
      </DiscoverySection>

      <DiscoverySection
        title={`👑 ${t("discovery.rising_title")}`}
        subtitle={t("discovery.recommended_subtitle")}
        icon={<Flame className="w-5 h-5 text-amber-400" />}
      >
        <CreatorGrid creators={trendingCreators} />
      </DiscoverySection>
    </div>
  );
};
