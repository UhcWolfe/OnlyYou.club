"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/lib/i18n/context";
import { ShieldAlert, ExternalLink, Lock, Scale, HelpCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-surface-border bg-surface text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-20 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="OnlyYou"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-zinc-500 max-w-sm">
            {t("footer.disclaimer")}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg max-w-sm">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>18+ Platform — Strict content moderation and adult verification.</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-3">
            Platform
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/explore" className="hover:text-white transition-colors">
                {t("nav.explore")}
              </Link>
            </li>
            <li>
              <Link href="/creators" className="hover:text-white transition-colors">
                {t("nav.creators")}
              </Link>
            </li>
            <li>
              <Link href="/trending" className="hover:text-white transition-colors">
                {t("nav.trending")}
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                {t("nav.dashboard")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors text-zinc-400 hover:underline">
                {t("footer.faq")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors text-zinc-400 hover:underline">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors text-zinc-400 hover:underline">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/copyright" className="hover:text-white transition-colors text-zinc-400 hover:underline">
                {t("footer.copyright")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-3">
            Discord Community
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={siteConfig.discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-primary hover:underline font-medium"
              >
                <span>{siteConfig.discordServerName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li className="text-zinc-500">
              Bot: {siteConfig.discordAppName}
            </li>
            <li>
              <Link href="/settings" className="hover:text-white transition-colors">
                {t("nav.settings")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-surface-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <p>© {new Date().getFullYear()} {siteConfig.name} ({siteConfig.domain}). {t("footer.rights")}</p>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Link
            href="/faq"
            className="text-zinc-400 hover:text-white hover:underline transition-colors font-medium flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
            <span>FAQ</span>
          </Link>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Link
            href="/terms"
            className="text-zinc-400 hover:text-white hover:underline transition-colors font-medium flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80" />
            <span>{t("footer.terms")}</span>
          </Link>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Link
            href="/privacy"
            className="text-zinc-400 hover:text-white hover:underline transition-colors font-medium flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>{t("footer.privacy")}</span>
          </Link>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Link
            href="/copyright"
            className="text-zinc-400 hover:text-white hover:underline transition-colors font-medium flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-red-400/80" />
            <span>{t("footer.copyright")}</span>
          </Link>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span className="text-zinc-600 hidden xl:inline">18+ RODO / 2257 Compliance</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>OnlyYou | App API Online</span>
        </div>
      </div>
    </footer>
  );
};
