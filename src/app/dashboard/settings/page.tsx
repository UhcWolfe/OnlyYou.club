"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/auth-context";
import { getDiscordHubUrl } from "@/lib/utils/discord-links";
import { siteConfig } from "@/config/site";
import {
  MessageSquare,
  Bell,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Edit3,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function DashboardSettingsPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const creator = user?.creator;
  const currentHub = creator?.hub;

  const defaultChannelName = `#hub-${(user?.username || "tworca")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")}`;

  const [channelIdInput, setChannelIdInput] = useState(currentHub?.channelId || "");
  const [channelNameInput, setChannelNameInput] = useState(
    currentHub?.channelName || defaultChannelName
  );
  const [hubNotifications, setHubNotifications] = useState(
    currentHub?.notificationsEnabled !== false
  );
  const [isEditing, setIsEditing] = useState(!currentHub?.channelId);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Keep inputs in sync if user changes
  useEffect(() => {
    if (currentHub?.channelId) {
      setChannelIdInput(currentHub.channelId);
      setChannelNameInput(currentHub.channelName || defaultChannelName);
      if (currentHub.notificationsEnabled !== undefined) {
        setHubNotifications(currentHub.notificationsEnabled);
      }
    }
  }, [currentHub?.channelId, currentHub?.channelName, currentHub?.notificationsEnabled, defaultChannelName]);

  const hasConfiguredHub = Boolean(currentHub?.channelId && currentHub.channelId.trim().length > 0);
  const hubUrl = hasConfiguredHub
    ? getDiscordHubUrl(currentHub!.channelId)
    : siteConfig.discordInviteUrl;

  const handleSaveHub = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    const trimmedId = channelIdInput.trim();
    const trimmedName = channelNameInput.trim() || defaultChannelName;

    updateUser({
      creator: {
        ...(creator || {
          id: `creator_${user.id}`,
          userId: user.id,
          discordId: user.discordId,
          name: user.displayName || user.username,
          bio: "",
          category: "Ogólne",
          tags: [],
          contentType: "Mixed",
          avatarUrl: user.avatarUrl || null,
          bannerUrl: user.bannerUrl || null,
          followerCount: 0,
          postCount: 0,
          totalViews: 0,
          totalLikes: 0,
          trendingScore: 0,
          status: "ACTIVE" as const,
          webConsent: true,
          webConsentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }),
        hub: {
          id: currentHub?.id || `hub_${user.id}`,
          creatorId: creator?.id || `creator_${user.id}`,
          channelId: trimmedId,
          channelName: trimmedName,
          categoryId: currentHub?.categoryId || null,
          panelMessageId: currentHub?.panelMessageId || null,
          isPaused: false,
          notificationsEnabled: hubNotifications,
          createdAt: currentHub?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });

    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleToggleNotifications = (checked: boolean) => {
    setHubNotifications(checked);
    if (!user) return;

    if (creator) {
      updateUser({
        creator: {
          ...creator,
          hub: {
            ...(creator.hub || {
              id: `hub_${user.id}`,
              creatorId: creator.id,
              channelId: channelIdInput.trim(),
              channelName: channelNameInput.trim() || defaultChannelName,
              categoryId: null,
              panelMessageId: null,
              isPaused: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }),
            notificationsEnabled: checked,
          },
        },
      });
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          updateUser(data.user);
        }
      }
    } catch {}
    setIsSyncing(false);
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Discord Hub Connection */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#5865F2]" />
              <h3 className="text-sm font-bold text-white">Połączenie z Discord Creator Hub</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Oficjalny kanał Creator Hub w serwerze {siteConfig.discordServerName}
            </p>
          </div>
          {hasConfiguredHub ? (
            <Badge variant="success" className="text-xs py-1 px-3">
              Połączono
            </Badge>
          ) : (
            <Badge variant="warning" className="text-xs py-1 px-3">
              Wymaga konfiguracji
            </Badge>
          )}
        </div>

        {/* Saved Hub details or Edit Form */}
        {!isEditing && hasConfiguredHub ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-400">ID Kanału Hubu:</span>
              <p className="font-mono text-zinc-200 text-sm">
                <span className="text-indigo-400 font-semibold">{currentHub?.channelName || defaultChannelName}</span>{" "}
                <span className="text-zinc-500">({currentHub?.channelId})</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Zmień ID</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                isLoading={isSyncing}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{synced ? "Zsynchronizowano!" : "Wymuś synchronizację"}</span>
              </Button>
              <a href={hubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="discord" size="sm" className="gap-1.5 text-xs">
                  <span>Otwórz kanał</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveHub} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  ID Kanału na Discordzie (Snowflake)
                </label>
                <Input
                  type="text"
                  placeholder="np. 124500000000000000"
                  value={channelIdInput}
                  onChange={(e) => setChannelIdInput(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Nazwa kanału
                </label>
                <Input
                  type="text"
                  placeholder={defaultChannelName}
                  value={channelNameInput}
                  onChange={(e) => setChannelNameInput(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-300">Jak znaleźć ID swojego kanału na Discordzie?</span>
                <p className="text-zinc-400">
                  W aplikacji Discord wejdź w <i>Ustawienia użytkownika &gt; Zaawansowane</i> i włącz <b>Tryb Dewelopera</b>.
                  Następnie kliknij prawym przyciskiem myszy na swój kanał Hubu na serwerze i kliknij <b>Kopiuj ID kanału</b>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {hasConfiguredHub && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-zinc-400"
                >
                  Anuluj
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{hasConfiguredHub ? "Zapisz zmiany" : "Połącz i zapisz kanał"}</span>
              </Button>
            </div>
          </form>
        )}

        {isSaved && (
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ustawienia Discord Creator Hub zostały pomyślnie zaktualizowane!</span>
          </div>
        )}
      </Card>

      {/* Auto-dispatch Notification Settings */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Automatyczne powiadomienia do obserwujących</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Gdy opublikujesz materiał w swoim Creator Hubie na Discordzie, OnlyYou | App wyśle powiadomienie DM do wszystkich Twoich obserwujących na Discordzie.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hubNotifications}
              onChange={(e) => handleToggleNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary" />
          </label>
        </div>
      </Card>
    </div>
  );
}
