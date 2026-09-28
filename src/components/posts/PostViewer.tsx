"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LikeButton } from "./LikeButton";
import { FollowButton } from "../creators/FollowButton";
import { NotificationButton } from "../creators/NotificationButton";
import { ReportModal } from "../moderation/ReportModal";
import { useTranslation } from "@/lib/i18n/context";
import { formatDate, formatNumber } from "@/lib/utils/formatters";
import { Eye, Flag, Share2, MessageSquare, CheckCircle2 } from "lucide-react";
import { getDiscordHubUrl } from "@/lib/utils/discord-links";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

interface PostViewerProps {
  post: Post;
  relatedPosts?: Post[];
}

export const PostViewer: React.FC<PostViewerProps> = ({ post, relatedPosts = [] }) => {
  const { t, language } = useTranslation();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const primaryMedia = post.media[0];
  const creatorUsername = post.creator.name.toLowerCase().replace(/\s+/g, "");

  const isVideo =
    primaryMedia?.mimeType?.startsWith("video/") ||
    primaryMedia?.cdnUrl?.endsWith(".mp4") ||
    primaryMedia?.cdnUrl?.endsWith(".webm") ||
    primaryMedia?.cdnUrl?.endsWith(".mov") ||
    primaryMedia?.cdnUrl?.includes("/videos/");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Viewer Card */}
      <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-2xl">
        {/* Media Screen */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[640px] bg-black flex items-center justify-center overflow-hidden">
          {primaryMedia?.cdnUrl ? (
            isVideo ? (
              <CustomVideoPlayer
                src={primaryMedia.cdnUrl}
                poster={primaryMedia.thumbnailUrl || undefined}
                qualities={primaryMedia.qualities}
                autoPlay
              />
            ) : (
              <img
                src={primaryMedia.cdnUrl}
                alt={post.caption || "Post content"}
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-zinc-950">
              <p className="text-zinc-500 text-sm">Brak dostępnego podglądu</p>
            </div>
          )}

          {/* Views count */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formatNumber(post.views)} {t("post.views")}</span>
          </div>
        </div>

        {/* Content & Creator Action Bar */}
        <div className="p-6 space-y-6">
          {/* Creator Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <Link
              href={`/${creatorUsername}`}
              className="flex items-center gap-3 group"
            >
              <Avatar src={post.creator.avatarUrl} alt={post.creator.name} size="lg" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-base text-zinc-100 group-hover:text-brand-primary transition-colors">
                    {post.creator.name}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                </div>
                <p className="text-xs text-zinc-500">@{creatorUsername}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
              <FollowButton creatorId={post.creator.id} size="sm" />
              <NotificationButton creatorId={post.creator.id} size="sm" />
              <LikeButton postId={post.id} initialLikes={post.likes} size="md" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReportOpen(true)}
                title={t("post.report")}
                className="text-zinc-500 hover:text-red-400"
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Caption & Metadata */}
          <div className="space-y-3">
            {post.caption && (
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                {post.caption}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span>{t("post.published_on")} {formatDate(post.createdAt, language === "pl" ? "pl-PL" : "en-US")}</span>
              <span>•</span>
              {post.category && <Badge variant="secondary">{post.category}</Badge>}
              {post.tags.map((tag) => (
                <span key={tag} className="text-zinc-400 hover:text-brand-primary cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="POST"
        targetId={post.id}
        postId={post.id}
      />
    </div>
  );
};
