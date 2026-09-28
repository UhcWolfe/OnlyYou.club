"use client";

import React from "react";
import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "./FollowButton";
import { CheckCircle2, MessageSquare, Users, Eye, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils/formatters";
import { useTranslation } from "@/lib/i18n/context";
import { getDiscordHubUrl } from "@/lib/utils/discord-links";

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const { t } = useTranslation();
  const username = creator.user?.username || creator.name.toLowerCase().replace(/\s+/g, "");
  const hubUrl = creator.hub?.channelId ? getDiscordHubUrl(creator.hub.channelId) : null;

  return (
    <div className="group rounded-xl bg-surface border border-surface-border overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col">
      {/* Banner */}
      <div className="relative h-24 w-full bg-zinc-900 overflow-hidden">
        {creator.bannerUrl ? (
          <img
            src={creator.bannerUrl}
            alt={`${creator.name} banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-violet-950/40 via-surface to-pink-950/40" />
        )}

      </div>

      {/* Content & Avatar */}
      <div className="px-4 pb-4 pt-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <Link href={`/creator/${username}`} className="relative -mt-9">
              <Avatar
                src={creator.avatarUrl}
                alt={creator.name}
                size="lg"
                className="border-2 border-surface shadow-lg ring-2 ring-surface"
              />
            </Link>
            <div className="pt-1">
              <FollowButton creatorId={creator.id} size="sm" />
            </div>
          </div>

          <Link href={`/creator/${username}`} className="block group/title">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-zinc-100 group-hover/title:text-brand-primary transition-colors truncate">
                {creator.name}
              </h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
            </div>
            <p className="text-xs text-zinc-500 mb-2">@{username}</p>
          </Link>

          {creator.bio && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
              {creator.bio}
            </p>
          )}


        </div>

        {/* Stats and Hub button */}
        <div className="pt-3 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-semibold text-zinc-200">{formatNumber(creator.followerCount)}</span>
              <span className="text-[10px] text-zinc-500">{t("creator.followers")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-semibold text-zinc-200">{formatNumber(creator.totalViews)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/creator/${username}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                {t("explore.title").split(" ")[0]}
              </Button>
            </Link>
            {hubUrl && (
              <a
                href={hubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t("brand.open_hub")}
                className="p-2 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 transition-colors flex items-center justify-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
