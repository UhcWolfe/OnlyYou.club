"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { siteConfig } from "@/config/site";
import { Globe, Bell, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, isAdultVerified, verifyAge } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Zarządzaj preferencjami językowymi, powiadomieniami i statusem konta OnlyYou.
        </p>
      </div>

      <div className="space-y-4">
        {/* Language setting */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-primary" />
                <h3 className="text-sm font-bold text-zinc-100">{t("settings.language")}</h3>
              </div>
              <p className="text-xs text-zinc-400">{t("settings.language_desc")}</p>
            </div>
            <LanguageSwitcher variant="default" />
          </div>
        </Card>

        {/* 18+ Verification setting */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100">{t("settings.age_verification")}</h3>
              </div>
              <p className="text-xs text-zinc-400 max-w-md">{t("settings.age_verification_desc")}</p>
            </div>

            {isAdultVerified ? (
              <Badge variant="success" className="text-xs py-1 px-3">
                Zweryfikowano 18+
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" onClick={verifyAge}>
                  Potwierdź pełnoletniość
                </Button>
                <a
                  href={siteConfig.discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-primary hover:underline"
                >
                  <span>{t("settings.verify_on_discord")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Notifications info */}
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-zinc-100">{t("settings.notifications")}</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t("settings.notifications_desc")}. Wiadomości prywatne i powiadomienia o nowych postach obserwowanych twórców są wysyłane automatycznie na Twoje konto Discord przez bota <strong>{siteConfig.discordAppName}</strong>.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
