"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { useTranslation } from "@/lib/i18n/context";
import { UserCheck, UserPlus } from "lucide-react";

interface FollowButtonProps {
  creatorId: string;
  size?: "sm" | "md";
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ creatorId, size = "md", className }) => {
  const { t } = useTranslation();
  const { followingIds, toggleFollow } = useAuth();
  const isFollowing = followingIds.includes(creatorId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow(creatorId);
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t("creator.following_status")}</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>{t("creator.follow")}</span>
        </>
      )}
    </Button>
  );
};
