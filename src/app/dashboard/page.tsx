"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber } from "@/lib/utils/formatters";
import { Post } from "@/types";
import {
  Eye,
  Heart,
  Users,
  Image as ImageIcon,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  Loader2,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const creator = user?.creator || null;

  const [creatorPosts, setCreatorPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!creator?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/posts?creatorId=${encodeURIComponent(creator.id)}&limit=10`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        setCreatorPosts(data.data || []);
      })
      .catch(() => setCreatorPosts([]))
      .finally(() => setIsLoading(false));
  }, [creator?.id]);

  const realViews =
    creatorPosts.reduce((acc, p) => acc + (p.views || 0), 0) || (creator?.totalViews || 0);

  const realFollowers = creator?.followerCount || 0;

  const realLikes =
    creatorPosts.reduce((acc, p) => acc + (p.likes || 0), 0) || (creator?.totalLikes || 0);

  const realPostCount = creatorPosts.length || (creator?.postCount || 0);

  const stats = [
    {
      label: t("dashboard.stats_views"),
      value: formatNumber(realViews),
      growth: realViews > 0 ? "Aktywny bilans" : "Aktualny stan",
      icon: Eye,
      color: "text-blue-400",
    },
    {
      label: t("dashboard.stats_followers"),
      value: formatNumber(realFollowers),
      growth: realFollowers > 0 ? `${realFollowers} aktywnych` : "Aktualny stan",
      icon: Users,
      color: "text-violet-400",
    },
    {
      label: t("dashboard.stats_likes"),
      value: formatNumber(realLikes),
      growth: realLikes > 0 ? `${realLikes} polubień` : "Aktualny stan",
      icon: Heart,
      color: "text-pink-400",
    },
    {
      label: t("dashboard.stats_posts"),
      value: realPostCount.toString(),
      growth: realPostCount > 0 ? `${realPostCount} opublikowanych` : "0 w tym tyg.",
      icon: ImageIcon,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-white">
                {isLoading ? <span className="text-zinc-600 text-lg">...</span> : stat.value}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span>{stat.growth}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Web Consent Status Banner */}
      <Card className="p-5 bg-gradient-to-r from-violet-950/20 via-surface to-surface border-brand-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">{t("dashboard.web_consent_title")}</h3>
            <Badge variant="success" className="text-[10px]">
              {creator?.webConsent ? "Aktywne" : "Nieaktywne"}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400">{t("dashboard.web_consent_active")}</p>
        </div>

        <Link href="/dashboard/profile">
          <Button variant="secondary" size="sm" className="text-xs">
            Zarządzaj widocznością
          </Button>
        </Link>
      </Card>

      {/* Recent Posts Table */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{t("dashboard.recent_posts")}</h3>
          <Link href="/dashboard/posts">
            <Button variant="ghost" size="sm" className="text-xs text-brand-primary">
              Wszystkie posty
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            <span>Wczytywanie postów...</span>
          </div>
        ) : creatorPosts.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            Brak opublikowanych postów w Twoim Creator Hubie
          </div>
        ) : (
          <div className="space-y-3">
            {creatorPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-hover border border-surface-border text-xs gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {post.media[0]?.thumbnailUrl && (
                    <img
                      src={post.media[0].thumbnailUrl}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-200 truncate">{post.caption || "Brak opisu"}</p>
                    <p className="text-[10px] text-zinc-500">{post.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-zinc-400 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{formatNumber(post.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {post.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
