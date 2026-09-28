"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/auth-context";
import { formatDate } from "@/lib/utils/formatters";
import {
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  RotateCcw,
  Upload,
  Loader2,
} from "lucide-react";

export default function DashboardProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const creator = user?.creator || null;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [webConsent, setWebConsent] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when user or creator profile loads/updates
  useEffect(() => {
    if (user) {
      setName(user.creator?.name || user.displayName || user.username || "");
      setBio(user.bio || user.creator?.bio || "");
      setGender(user.gender || user.creator?.gender || "");
      setOrientation(user.orientation || user.creator?.orientation || "");
      setBannerUrl(user.customBannerUrl || user.creator?.bannerUrl || user.discordBannerUrl || "");
      setWebConsent(user.creator?.webConsent !== false);
    }
  }, [user]);

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "banner");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Błąd podczas wgrywania banera");
      }

      const data = await res.json();
      if (data.url) {
        setBannerUrl(data.url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = name.trim() || user.displayName || user.username;
    const trimmedBio = bio.trim();
    const trimmedGender = gender.trim();
    const trimmedOrientation = orientation.trim();
    const trimmedBanner = bannerUrl.trim();

    updateUser({
      bio: trimmedBio,
      gender: trimmedGender || null,
      orientation: trimmedOrientation || null,
      customBannerUrl: trimmedBanner || null,
      creator: {
        ...(creator || {
          id: `creator_${user.id}`,
          userId: user.id,
          discordId: user.discordId,
          contentType: "Mixed",
          avatarUrl: user.avatarUrl || null,
          followerCount: 0,
          postCount: 0,
          totalViews: 0,
          totalLikes: 0,
          trendingScore: 0,
          status: "ACTIVE" as const,
          createdAt: new Date().toISOString(),
          badges: ["creator"],
        }),
        name: trimmedName,
        bio: trimmedBio,
        gender: trimmedGender || null,
        orientation: trimmedOrientation || null,
        webConsent,
        webConsentAt: creator?.webConsentAt || (webConsent ? new Date().toISOString() : null),
        bannerUrl: trimmedBanner || user.discordBannerUrl || null,
      },
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div>
              <h2 className="text-base font-bold text-white">Edycja Profilu Twórcy</h2>
              <p className="text-xs text-zinc-400">
                Informacje widoczne w Twoim oficjalnym profilu twórcy na platformie
              </p>
            </div>
            {isSaved && (
              <Badge variant="success" className="gap-1 text-xs py-1 px-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t("dashboard.profile_saved")}</span>
              </Badge>
            )}
          </div>

          {/* Web Consent Switch */}
          <div className="p-4 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">{t("dashboard.web_consent_title")}</span>
              </div>
              <p className="text-xs text-zinc-400">{t("dashboard.web_consent_desc")}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={webConsent}
                onChange={(e) => setWebConsent(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary" />
            </label>
          </div>

          <div className="space-y-4">
            {/* Creator Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nazwa Twórcy</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Twoja publiczna nazwa twórcy"
                required
              />
            </div>

            {/* Creator Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Bio / Opis Twórcy</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Napisz kilka zdań o sobie i materiałach, które publikujesz..."
                className="w-full p-3 rounded-lg bg-surface border border-surface-border text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Informacje o Twórcy Grid: Płeć, Orientacja, Data dołączenia, Status konta */}
            <div className="pt-3 border-t border-surface-border space-y-4">
              <span className="text-xs font-bold text-zinc-300 block">
                Informacje o Twórcy
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Płeć */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Płeć</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-surface-border text-sm text-zinc-200 focus:outline-none focus:border-brand-primary"
                  >
                    <option value="" className="bg-zinc-900">Nie wybrano</option>
                    <option value="Kobieta" className="bg-zinc-900">Kobieta</option>
                    <option value="Mężczyzna" className="bg-zinc-900">Mężczyzna</option>
                    <option value="Niebinarna" className="bg-zinc-900">Niebinarna</option>
                    <option value="Transpłciowa" className="bg-zinc-900">Transpłciowa</option>
                    <option value="Inna" className="bg-zinc-900">Inna</option>
                  </select>
                </div>

                {/* Orientacja */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Orientacja</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface border border-surface-border text-sm text-zinc-200 focus:outline-none focus:border-brand-primary"
                  >
                    <option value="" className="bg-zinc-900">Nie wybrano</option>
                    <option value="Heteroseksualna" className="bg-zinc-900">Heteroseksualna</option>
                    <option value="Biseksualna" className="bg-zinc-900">Biseksualna</option>
                    <option value="Homoseksualna" className="bg-zinc-900">Homoseksualna</option>
                    <option value="Panseksualna" className="bg-zinc-900">Panseksualna</option>
                    <option value="Aseksualna" className="bg-zinc-900">Aseksualna</option>
                    <option value="Inna" className="bg-zinc-900">Inna</option>
                  </select>
                </div>

                {/* Data dołączenia na platformę (Tylko do odczytu) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    Data dołączenia na platformę
                  </label>
                  <Input
                    type="text"
                    disabled
                    value={formatDate(user?.createdAt || user?.creator?.createdAt || new Date().toISOString())}
                    className="opacity-60 bg-zinc-900/80 cursor-not-allowed text-xs text-zinc-300 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Wartość generowana automatycznie podczas rejestracji (brak możliwości edycji).
                  </p>
                </div>

                {/* Status konta (Tylko do odczytu) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">
                    Status konta
                  </label>
                  <div className="h-10 px-3 rounded-lg bg-zinc-900/80 border border-surface-border flex items-center justify-between opacity-80 cursor-not-allowed">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {user?.creator?.status === "SUSPENDED" ? "Nieaktywny" : "Aktywny"}
                    </span>
                    <Badge variant="success" className="text-[10px] py-0.5">Zweryfikowany</Badge>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Status nadzorowany przez system OnlyYou (brak możliwości edycji).
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Creator Banner */}
            <div className="space-y-2.5 pt-2 border-t border-surface-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Baner Profilu Twórcy</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="text-xs h-7 gap-1"
                  >
                    {isUploadingBanner ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3" />
                    )}
                    <span>{isUploadingBanner ? "Wgrywanie..." : "Wybierz z plików"}</span>
                  </Button>

                  {user?.discordBannerUrl && (
                    <button
                      type="button"
                      onClick={() => setBannerUrl(user.discordBannerUrl || "")}
                      className="text-[11px] text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Przywróć baner z Discorda
                    </button>
                  )}
                </div>
              </div>

              <Input
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Adres URL do banera lub wgraj z plików powyżej (zostaw puste dla banera z Discorda)"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-zinc-500">
                Jako zweryfikowany twórca możesz wgrać dowolny własny baner lub zsynchronizować go ze swoim kontem Discord.
              </p>

              {/* Live Preview */}
              <div className="relative h-32 sm:h-44 w-full rounded-xl overflow-hidden bg-zinc-950 border border-surface-border mt-2">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Podgląd banera"
                    className="w-full h-full object-cover"
                  />
                ) : user?.discordBannerUrl ? (
                  <img
                    src={user.discordBannerUrl}
                    alt="Baner Discord"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xs text-zinc-500"
                    style={{
                      backgroundColor: user?.bannerColor || "#18191c",
                      backgroundImage:
                        "radial-gradient(circle at 20% 30%, rgba(225, 29, 72, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.25) 0%, transparent 60%)",
                    }}
                  >
                    Domyślny gradient (brak banera)
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-medium">
                  Podgląd banera
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex justify-end">
            <Button type="submit" variant="primary">
              {t("dashboard.save_changes")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
