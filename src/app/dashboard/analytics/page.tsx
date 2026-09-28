"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils/formatters";
import { useAuth } from "@/lib/auth/auth-context";
import { Post } from "@/types";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Loader2,
} from "lucide-react";

export default function DashboardAnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const creator = user?.creator;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    if (!creator?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/posts?creatorId=${encodeURIComponent(creator.id)}&limit=100`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        setPosts(data.data || []);
      })
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [creator?.id]);

  // Filter posts based on selected period
  const filteredPosts = React.useMemo(() => {
    if (period === "all") return posts;
    const now = Date.now();
    const days = period === "7d" ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return posts.filter((p) => {
      const created = new Date(p.createdAt).getTime();
      return isNaN(created) ? true : created >= cutoff;
    });
  }, [posts, period]);

  // Real statistics calculations
  const totalViews =
    filteredPosts.reduce((acc, p) => acc + (p.views || 0), 0) ||
    (period === "all" ? creator?.totalViews || 0 : 0);

  const followerCount = creator?.followerCount || 0;

  const totalLikes =
    filteredPosts.reduce((acc, p) => acc + (p.likes || 0), 0) ||
    (period === "all" ? creator?.totalLikes || 0 : 0);

  const engagementRate =
    totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0.0";

  const totalPostsCount = filteredPosts.length || (period === "all" ? creator?.postCount || 0 : 0);

  const avgViewsPerPost =
    totalPostsCount > 0 ? Math.round(totalViews / totalPostsCount) : 0;

  // Real category breakdown calculation
  const categoryStats = React.useMemo(() => {
    const categoryViewsMap: Record<string, number> = {};

    filteredPosts.forEach((post) => {
      const category = post.category || creator?.category || "Ogólne";
      categoryViewsMap[category] = (categoryViewsMap[category] || 0) + (post.views || 0);
    });

    const entries = Object.entries(categoryViewsMap);
    if (entries.length === 0) {
      // If no posts with views, return creator's primary category with 0
      const defaultCategory = creator?.category || "Ogólne";
      return [
        {
          name: defaultCategory,
          percentage: 0,
          views: "0",
          rawViews: 0,
        },
      ];
    }

    return entries
      .map(([name, views]) => ({
        name,
        views: formatNumber(views),
        rawViews: views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
      }))
      .sort((a, b) => b.rawViews - a.rawViews);
  }, [filteredPosts, totalViews, creator?.category]);

  const metrics = [
    {
      label: "Wyświetlenia łącznie",
      value: formatNumber(totalViews),
      subtext: totalPostsCount > 0 ? `Z ${totalPostsCount} postów` : "Bieżący stan",
      icon: Eye,
      color: "text-blue-400",
      positive: totalViews > 0,
    },
    {
      label: "Obserwujący",
      value: formatNumber(followerCount),
      subtext: followerCount > 0 ? `${followerCount} zarejestrowanych` : "Brak obserwujących",
      icon: Users,
      color: "text-violet-400",
      positive: followerCount > 0,
    },
    {
      label: "Polubienia postów",
      value: formatNumber(totalLikes),
      subtext: totalPostsCount > 0 ? `Śr. ${(totalLikes / totalPostsCount).toFixed(1)} / post` : "Bieżący stan",
      icon: Heart,
      color: "text-pink-400",
      positive: totalLikes > 0,
    },
    {
      label: "Wskaźnik zaangażowania",
      value: `${engagementRate}%`,
      subtext: totalViews > 0 ? "Stosunek polubień do wyświetleń" : "Wymaga wyświetleń",
      icon: TrendingUp,
      color: "text-emerald-400",
      positive: parseFloat(engagementRate) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with period switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h2 className="text-base font-bold text-white">{t("dashboard.nav_analytics")}</h2>
          <p className="text-xs text-zinc-400">
            Rzeczywiste podsumowanie zasięgów i dynamiki Twojego konta twórcy
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-surface-border text-xs">
          <button
            type="button"
            onClick={() => setPeriod("7d")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              period === "7d"
                ? "bg-brand-primary text-white font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            7 dni
          </button>
          <button
            type="button"
            onClick={() => setPeriod("30d")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              period === "30d"
                ? "bg-brand-primary text-white font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            30 dni
          </button>
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              period === "all"
                ? "bg-brand-primary text-white font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Wszystko
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl font-black text-white">
                {isLoading ? (
                  <span className="text-zinc-600 text-lg">Wczytywanie...</span>
                ) : (
                  m.value
                )}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                {m.subtext}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Breakdown by content category */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-white">
              Rozkład wyświetleń według typu treści
            </h3>
          </div>
          <Badge variant="secondary" className="text-[11px]">
            {period === "7d" ? "Ostatnie 7 dni" : period === "30d" ? "Ostatnie 30 dni" : "Cały okres"}
          </Badge>
        </div>

        {totalViews === 0 ? (
          <div className="py-8 px-4 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
            <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs font-semibold text-zinc-300">
              Brak zarejestrowanych wyświetleń w wybranym okresie
            </p>
            <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
              Gdy opublikujesz materiały w swoim Creator Hubie i użytkownicy zaczną je przeglądać,
              tutaj automatycznie pojawi się procentowy podział wyświetleń według kategorii.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {categoryStats.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{item.name}</span>
                  <span className="text-zinc-400">
                    {item.views} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-zinc-400">Łączna liczba postów w wybranym okresie:</span>
            <p className="text-base font-bold text-white">{totalPostsCount}</p>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400 opacity-70" />
        </Card>

        <Card className="p-4 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="text-zinc-400">Średnia liczba wyświetleń na post:</span>
            <p className="text-base font-bold text-white">{formatNumber(avgViewsPerPost)}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-brand-primary opacity-70" />
        </Card>
      </div>
    </div>
  );
}
