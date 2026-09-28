"use client";

import React from "react";
import { Creator, Post } from "@/types";
import { DiscoverySection } from "@/components/discovery/DiscoverySection";
import { PostGrid } from "@/components/posts/PostGrid";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { useTranslation } from "@/lib/i18n/context";
import { Flame, Sparkles, Image as ImageIcon, Star } from "lucide-react";

interface HomeFeedProps {
  trendingPosts: Post[];
  newCreators: Creator[];
  latestPosts: Post[];
  trendingCreators: Creator[];
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  trendingPosts,
  newCreators,
  latestPosts,
  trendingCreators,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Platform Welcome Banner - subtle & creator focused */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-950/40 via-surface to-pink-950/30 border border-surface-border p-6 sm:p-8 overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("brand.tagline")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {t("explore.title")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {t("explore.subtitle")}
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 1. 🔥 Trending Posts */}
      <DiscoverySection
        title={`🔥 ${t("discovery.trending_title")}`}
        subtitle={t("discovery.trending_subtitle")}
        icon={<Flame className="w-6 h-6 text-brand-secondary" />}
        viewAllHref="/trending"
        viewAllText={t("discovery.view_all")}
      >
        <PostGrid posts={trendingPosts} />
      </DiscoverySection>

      {/* 2. 🆕 New Creators */}
      <DiscoverySection
        title={`🆕 ${t("discovery.new_creators_title")}`}
        subtitle={t("discovery.new_creators_subtitle")}
        icon={<Sparkles className="w-6 h-6 text-brand-primary" />}
        viewAllHref="/creators"
        viewAllText={t("discovery.view_all")}
      >
        <CreatorGrid creators={newCreators} />
      </DiscoverySection>

      {/* 3. 📸 Latest Posts */}
      <DiscoverySection
        title={`📸 ${t("discovery.latest_posts_title")}`}
        subtitle={t("discovery.latest_posts_subtitle")}
        icon={<ImageIcon className="w-6 h-6 text-brand-accent" />}
        viewAllHref="/explore"
        viewAllText={t("discovery.view_all")}
      >
        <PostGrid posts={latestPosts.length > 0 ? latestPosts : trendingPosts} />
      </DiscoverySection>

      {/* 4. ⭐ Recommended Creators */}
      <DiscoverySection
        title={`⭐ ${t("discovery.recommended_title")}`}
        subtitle={t("discovery.recommended_subtitle")}
        icon={<Star className="w-6 h-6 text-amber-400" />}
        viewAllHref="/creators"
        viewAllText={t("discovery.view_all")}
      >
        <CreatorGrid creators={trendingCreators} />
      </DiscoverySection>

      {/* 5. 🏷️ SEO Category Hub */}
      <div className="rounded-2xl border border-surface-border bg-surface/50 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            🔥 Popularne Kategorie 18+ & Odkrywaj Treści
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Przeglądaj darmowe filmy porno, zdjęcia erotyczne, modelki i profile twórców według kategorii.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "Polskie porno",
            "Anal",
            "Duże cycki",
            "Duże dupeczki",
            "Cosplay",
            "Fetysze",
            "Gangbang",
            "Hardcore",
            "Hentai",
            "Stopy",
            "Trójkąty",
            "Zabawki",
            "Wytrysk",
            "Walenie konia",
            "Faceci solo",
            "Kompilacje",
            "Imprezy"
          ].map((cat) => (
            <a
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900/80 hover:bg-brand-primary/20 text-zinc-300 hover:text-brand-primary border border-zinc-800 hover:border-brand-primary/40 transition-all"
            >
              #{cat}
            </a>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 space-y-2 leading-relaxed">
          <p>
            <strong className="text-zinc-300">OnlyYouHub (OnlyYou | Club)</strong> to wiodąca polska platforma dla twórczyń i twórców treści dla dorosłych (18+), modelek erotycznych oraz fanów materiałów premium. Znajdziesz u nas darmowe filmy porno, galerie zdjęć NSFW, transmisje, profile i ekskluzywne społeczności Discord Creator Hubs.
          </p>
          <p>
            Dzięki bezpośredniej integracji z Discordem możesz wchodzić w interakcję ze swoimi ulubionymi twórcami, zdobywać odznaki, odblokowywać prywatne kanały i oglądać materiały w najwyższej jakości bez zbędnych reklam.
          </p>
        </div>
      </div>
    </div>
  );
};
