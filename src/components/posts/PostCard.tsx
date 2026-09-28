"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LikeButton } from "./LikeButton";
import { Eye, Sparkles, Play, Film } from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils/formatters";
import { useTranslation } from "@/lib/i18n/context";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { language } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const primaryMedia = post.media[0];
  const isVideo =
    primaryMedia?.mimeType?.startsWith("video/") ||
    primaryMedia?.cdnUrl?.endsWith(".mp4") ||
    primaryMedia?.cdnUrl?.endsWith(".webm") ||
    primaryMedia?.cdnUrl?.endsWith(".mov") ||
    primaryMedia?.cdnUrl?.includes("/videos/");

  // Only use image URLs for img src (never raw mp4)
  const rawThumb = primaryMedia?.thumbnailUrl;
  const isImageFile = primaryMedia?.cdnUrl && !isVideo;
  const validImageUrl = rawThumb || (isImageFile ? primaryMedia.cdnUrl : null);

  return (
    <article className="group relative rounded-xl bg-surface border border-surface-border overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col">
      {/* Media Thumbnail Container */}
      <Link href={`/post/${post.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 block">
        {validImageUrl && !imgError ? (
          <>
            <img
              src={validImageUrl}
              alt={post.caption || "Post media"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-brand-primary transition-all">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-900 group-hover:bg-zinc-850 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-brand-primary shadow-md group-hover:scale-110 transition-transform">
              {isVideo ? <Play className="w-6 h-6 fill-brand-primary translate-x-0.5" /> : <Film className="w-6 h-6" />}
            </div>
            <span className="text-[11px] text-zinc-400 font-medium mt-2">
              {isVideo ? "Odtwórz wideo" : "Zobacz materiał"}
            </span>
          </div>
        )}

        {/* Category Pill */}
        {post.category && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white text-[10px]">
              {post.category}
            </Badge>
          </div>
        )}

        {/* View Count Overlay */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-medium text-zinc-300 flex items-center gap-1">
          <Eye className="w-3 h-3 text-zinc-400" />
          <span>{formatNumber(post.views)}</span>
        </div>
      </Link>

      {/* Post Metadata Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        {/* Creator Info Header */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/${encodeURIComponent(post.creator.name.toLowerCase().replace(/\s+/g, ""))}`}
            className="flex items-center gap-2 group/creator min-w-0"
          >
            <Avatar src={post.creator.avatarUrl} alt={post.creator.name} size="sm" />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-zinc-200 group-hover/creator:text-brand-primary truncate block">
                {post.creator.name}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                {formatRelativeTime(post.createdAt, language)}
              </span>
            </div>
          </Link>
          <LikeButton postId={post.id} initialLikes={post.likes} size="sm" />
        </div>

        {/* Caption */}
        {post.caption && (
          <Link href={`/post/${post.id}`}>
            <p className="text-xs text-zinc-300 line-clamp-2 hover:text-zinc-100 transition-colors leading-relaxed">
              {post.caption}
            </p>
          </Link>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] text-zinc-500 hover:text-brand-primary transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
