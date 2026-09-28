"use client";

import React from "react";
import { Creator } from "@/types";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { DiscoverySection } from "@/components/discovery/DiscoverySection";
import { useTranslation } from "@/lib/i18n/context";
import { Users, Sparkles, Flame, Star } from "lucide-react";

interface CreatorsFeedProps {
  trendingCreators: Creator[];
  newCreators: Creator[];
  allCreators: Creator[];
}

export const CreatorsFeed: React.FC<CreatorsFeedProps> = ({
  trendingCreators,
  newCreators,
  allCreators,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-primary" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("nav.creators")}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          {t("explore.subtitle")}
        </p>
      </div>

      {/* Featured / Trending Creators */}
      <DiscoverySection
        title={`🔥 ${t("discovery.trending_title")}`}
        subtitle={t("discovery.trending_subtitle")}
        icon={<Flame className="w-5 h-5 text-brand-secondary" />}
      >
        <CreatorGrid creators={trendingCreators} />
      </DiscoverySection>

      {/* New Creators */}
      <DiscoverySection
        title={`🆕 ${t("discovery.new_creators_title")}`}
        subtitle={t("discovery.new_creators_subtitle")}
        icon={<Sparkles className="w-5 h-5 text-brand-primary" />}
      >
        <CreatorGrid creators={newCreators} />
      </DiscoverySection>

      {/* All Creators Directory */}
      <DiscoverySection
        title={`⭐ ${t("discovery.recommended_title")}`}
        subtitle={t("discovery.recommended_subtitle")}
        icon={<Star className="w-5 h-5 text-amber-400" />}
      >
        <CreatorGrid creators={allCreators} />
      </DiscoverySection>
    </div>
  );
};
