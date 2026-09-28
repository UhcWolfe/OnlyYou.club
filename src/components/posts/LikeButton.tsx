"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  className?: string;
  size?: "sm" | "md";
}

export const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikes, className, size = "md" }) => {
  const { likedPostIds, toggleLike } = useAuth();
  const isLiked = likedPostIds.includes(postId);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(postId);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full transition-all duration-200 group active:scale-90",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
        isLiked
          ? "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20"
          : "text-zinc-400 hover:text-pink-400 bg-surface-hover hover:bg-surface-active",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
          "transition-transform group-hover:scale-110",
          isLiked && "fill-current"
        )}
      />
      <span className="font-semibold">{formatNumber(likesCount)}</span>
    </button>
  );
};
