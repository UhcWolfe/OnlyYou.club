"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Creator } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "./FollowButton";
import { NotificationButton } from "./NotificationButton";
import {
  Users,
  Heart,
  Eye,
  Film,
  Activity,
  Calendar,
  User as UserIcon,
  LayoutDashboard,
  MessageSquare,
  ExternalLink,
  Camera,
  Loader2,
  RefreshCw,
  Crown,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils/formatters";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { getDiscordHubUrl } from "@/lib/utils/discord-links";
import { ProfileBadgeBar } from "@/components/profile/ProfileBadgeBar";
import { resolveUserBadges } from "@/config/badges";

interface CreatorHeaderProps {
  creator: Creator;
  postCount?: number;
}

export const CreatorHeader: React.FC<CreatorHeaderProps> = ({ creator, postCount }) => {
  const { t } = useTranslation();
  const { user: currentUser, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanCreatorName = creator.name.toLowerCase().replace(/[\s_]+/g, "");
  const username =
    creator.user?.username ||
    (currentUser?.username && currentUser.username.toLowerCase().replace(/[\s_]+/g, "") === cleanCreatorName
      ? currentUser.username
      : creator.name.toLowerCase().replace(/\s+/g, ""));

  const isSelf = Boolean(
    currentUser &&
      (currentUser.id === creator.userId ||
        currentUser.discordId === creator.discordId ||
        currentUser.id === creator.id ||
        (creator.userId && currentUser.id === creator.userId) ||
        (currentUser.username &&
          currentUser.username.toLowerCase().replace(/[\s_]+/g, "") === cleanCreatorName))
  );

  const livePostCount = Math.max(
    postCount ?? 0,
    creator.postCount ?? 0,
    isSelf && currentUser?.creator?.postCount ? currentUser.creator.postCount : 0
  );

  const liveTotalViews = Math.max(
    creator.totalViews ?? 0,
    isSelf && currentUser?.creator?.totalViews ? currentUser.creator.totalViews : 0
  );

  const liveTotalLikes = Math.max(
    creator.totalLikes ?? 0,
    isSelf && currentUser?.creator?.totalLikes ? currentUser.creator.totalLikes : 0
  );

  const liveFollowerCount = Math.max(
    creator.followerCount ?? 0,
    isSelf && currentUser?.creator?.followerCount ? currentUser.creator.followerCount : 0
  );

  const effectiveCreator: Creator = isSelf && currentUser?.creator
    ? {
        ...currentUser.creator,
        ...creator,
        postCount: livePostCount,
        totalViews: liveTotalViews,
        totalLikes: liveTotalLikes,
        followerCount: liveFollowerCount,
      }
    : {
        ...creator,
        postCount: livePostCount,
        totalViews: liveTotalViews,
        totalLikes: liveTotalLikes,
        followerCount: liveFollowerCount,
      };

  const bannerToDisplay =
    effectiveCreator.bannerUrl ||
    creator.user?.customBannerUrl ||
    creator.user?.bannerUrl ||
    creator.user?.discordBannerUrl ||
    (isSelf ? (currentUser?.customBannerUrl || currentUser?.bannerUrl || currentUser?.discordBannerUrl) : null);

  const hubUrl = creator.hub?.channelId ? getDiscordHubUrl(creator.hub.channelId) : null;

  const badgesList: string[] =
    (isSelf && currentUser?.badges !== undefined)
      ? currentUser.badges
      : (effectiveCreator.user?.badges || effectiveCreator.badges || []);

  const hasCreatorBadge = badgesList.includes("creator");

  const creatorBadges = resolveUserBadges(
    {
      ...(effectiveCreator.user || {}),
      badges: badgesList,
      role: isSelf && currentUser?.role ? currentUser.role : (effectiveCreator.user?.role || "USER"),
    },
    hasCreatorBadge
  );

  const discordId =
    effectiveCreator.discordId ||
    effectiveCreator.userId ||
    creator.user?.discordId ||
    (isSelf ? currentUser?.discordId : null);

  const bioText =
    effectiveCreator.bio ||
    creator.user?.bio ||
    (isSelf ? currentUser?.bio : null);

  const status =
    effectiveCreator.status ||
    creator.user?.creator?.status ||
    (isSelf ? currentUser?.creator?.status : "ACTIVE");

  const createdAt =
    effectiveCreator.createdAt ||
    creator.user?.createdAt ||
    (isSelf ? currentUser?.createdAt : new Date().toISOString());

  const gender =
    effectiveCreator.gender ||
    creator.user?.creator?.gender ||
    creator.user?.gender ||
    (isSelf ? (currentUser?.creator?.gender || currentUser?.gender) : null) ||
    "Nie podano";

  const orientation =
    effectiveCreator.orientation ||
    creator.user?.creator?.orientation ||
    creator.user?.orientation ||
    (isSelf ? (currentUser?.creator?.orientation || currentUser?.orientation) : null) ||
    "Nie podano";

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSelf || !currentUser) return;

    const localUrl = URL.createObjectURL(file);
    updateUser({
      customBannerUrl: localUrl,
      creator: currentUser.creator
        ? {
            ...currentUser.creator,
            bannerUrl: localUrl,
          }
        : undefined,
    });

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          updateUser({
            customBannerUrl: data.url,
            creator: currentUser.creator
              ? {
                  ...currentUser.creator,
                  bannerUrl: data.url,
                }
              : undefined,
          });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSyncWithDiscord = () => {
    if (currentUser?.customBannerUrl) {
      updateUser({
        customBannerUrl: null,
        creator: currentUser.creator
          ? {
              ...currentUser.creator,
              bannerUrl: currentUser.discordBannerUrl || null,
            }
          : undefined,
      });
    }
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="w-full rounded-2xl bg-surface border border-surface-border relative shadow-xl overflow-hidden mb-8">
      {/* Hidden file input for banner change */}
      {isSelf && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
        />
      )}

      {/* Banner Section */}
      <div className="relative h-36 sm:h-48 md:h-60 w-full rounded-t-2xl overflow-hidden bg-zinc-950">
        {bannerToDisplay ? (
          <img
            src={bannerToDisplay}
            alt={`${creator.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full relative"
            style={{
              backgroundColor: creator.user?.bannerColor || "#18191c",
              backgroundImage:
                "radial-gradient(circle at 15% 30%, rgba(225, 29, 72, 0.35) 0%, transparent 55%), radial-gradient(circle at 85% 70%, rgba(147, 51, 234, 0.35) 0%, transparent 55%)",
            }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

        {/* Action Buttons on Banner for Owner */}
        {isSelf && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSyncWithDiscord}
              className="gap-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white text-xs py-1.5 px-2.5 shadow-lg"
              title="Pobierz i zsynchronizuj aktualny baner z Discorda"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Synchronizuj z Discord</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenFilePicker}
              disabled={isUploading}
              className="gap-2 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white text-xs py-1.5 px-3 shadow-lg cursor-pointer transition-transform active:scale-95"
              title="Wybierz plik z dysku"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-brand-primary" />
              )}
              <span>{isUploading ? "Wgrywanie..." : "Zmień baner"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info Details (Avatar overlapping banner) */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
          {/* Avatar and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative ring-4 ring-surface rounded-full shadow-2xl bg-surface flex-shrink-0">
              <Avatar
                src={effectiveCreator.avatarUrl}
                alt={effectiveCreator.name}
                size="2xl"
              />
            </div>

            <div className="mb-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {effectiveCreator.name}
                </h1>
                <ProfileBadgeBar badges={creatorBadges} size="md" tooltipPosition="bottom" />
              </div>
              <p className="text-xs text-zinc-500">
                @{username} {discordId ? `• Discord ID: ${discordId}` : ""}
              </p>
            </div>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-2 justify-center sm:justify-end flex-shrink-0 pb-1">
            {isSelf ? (
              hasCreatorBadge ? (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                    <span>{t("nav.dashboard")}</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/creator-program">
                  <Button variant="secondary" size="sm" className="gap-2 text-amber-400 border-amber-500/30 hover:bg-amber-950/30">
                    <Crown className="w-4 h-4" />
                    <span>{t("nav.creator_program")}</span>
                  </Button>
                </Link>
              )
            ) : (
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {hasCreatorBadge && (
                  <>
                    <FollowButton creatorId={creator.id} size="sm" className="flex-1 sm:flex-none" />
                    <NotificationButton creatorId={creator.id} size="sm" />
                  </>
                )}
                {hubUrl && (
                  <a
                    href={hubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="discord" size="sm" className="w-full gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">{t("brand.open_hub")}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Creator Metrics Row (Obserwujących, Polubienia, Wyświetlenia, Posty) - Only for verified creators */}
        {hasCreatorBadge && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-border/50 text-center sm:text-left">
            <div className="bg-surface-hover/60 p-3 rounded-xl border border-surface-border/60">
              <div className="text-xs text-zinc-400 mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Obserwujących</span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {formatNumber(effectiveCreator.followerCount || 0)}
              </div>
            </div>

            <div className="bg-surface-hover/60 p-3 rounded-xl border border-surface-border/60">
              <div className="text-xs text-zinc-400 mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Polubienia</span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {formatNumber(effectiveCreator.totalLikes || 0)}
              </div>
            </div>

            <div className="bg-surface-hover/60 p-3 rounded-xl border border-surface-border/60">
              <div className="text-xs text-zinc-400 mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Wyświetlenia</span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {formatNumber(effectiveCreator.totalViews || 0)}
              </div>
            </div>

            <div className="bg-surface-hover/60 p-3 rounded-xl border border-surface-border/60">
              <div className="text-xs text-zinc-400 mb-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Film className="w-3.5 h-3.5 text-emerald-400" />
                <span>Posty</span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {effectiveCreator.postCount || 0}
              </div>
            </div>
          </div>
        )}

        {/* Main Info Section: Bio on Left, Creator Details Box on Right - Only for verified creators */}
        {hasCreatorBadge && (
          <div className="pt-4 mt-2 border-t border-surface-border/50 flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Left: Bio / Description */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                O mnie
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {bioText || "Ten profil nie posiada jeszcze opisu."}
              </p>
            </div>

            {/* Right: Creator Info Box */}
            <div className="w-full md:w-72 flex-shrink-0 bg-surface-hover/80 rounded-xl p-3.5 border border-surface-border/80 space-y-2.5 text-xs shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block pb-1 border-b border-surface-border/50">
                Informacje o twórcy
              </span>

              {/* Status konta */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Status konta
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {status === "SUSPENDED" ? "Nieaktywny" : "Aktywny"}
                </span>
              </div>

              {/* Data dołączenia */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Data dołączenia
                </span>
                <span className="text-zinc-200 font-medium text-[11px]">
                  {formatDate(createdAt || new Date().toISOString())}
                </span>
              </div>

              {/* Płeć */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-violet-400" />
                  Płeć
                </span>
                <span className="text-zinc-200 font-medium text-[11px]">
                  {gender}
                </span>
              </div>

              {/* Orientacja */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  Orientacja
                </span>
                <span className="text-zinc-200 font-medium text-[11px]">
                  {orientation}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
