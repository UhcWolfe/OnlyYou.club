"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { Sparkles, MessageSquare, ShieldCheck, Bell, Users, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const { isLoggedIn, loginWithDiscord } = useAuth();
  const router = useRouter();

  const handleDiscordLogin = () => {
    loginWithDiscord();
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <img
          src="/logo.png"
          alt="OnlyYou Logo"
          className="h-16 w-auto mx-auto object-contain drop-shadow-xl"
        />
        <h1 className="text-2xl font-black text-white tracking-tight">
          {t("auth.login_title")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          {t("auth.login_subtitle")}
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="p-6 space-y-6">
        <Button
          variant="discord"
          size="lg"
          onClick={handleDiscordLogin}
          className="w-full font-bold text-sm tracking-wide gap-3 py-6"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>{t("auth.continue_with_discord")}</span>
        </Button>

        <div className="space-y-4 pt-4 border-t border-surface-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {t("auth.benefits_title")}
          </h3>

          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t("auth.benefit_follow")}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t("auth.benefit_hubs")}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t("auth.benefit_age")}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t("auth.benefit_sync")}</span>
            </li>
          </ul>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed text-center pt-2">
          {t("auth.security_note")}
        </p>
      </Card>
    </div>
  );
}
