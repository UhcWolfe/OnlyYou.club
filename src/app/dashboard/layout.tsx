"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  BarChart3,
  Settings,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { getDiscordHubUrl } from "@/lib/utils/discord-links";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { CreatorProgramPrompt } from "@/components/creator-program/CreatorProgramPrompt";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, isLoggedIn, isCreator } = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">{t("errors.unauthorized")}</h2>
        <Link href="/login">
          <Button variant="discord">{t("nav.login")}</Button>
        </Link>
      </div>
    );
  }

  if (!isCreator) {
    return <CreatorProgramPrompt isGate={true} />;
  }

  const navItems = [
    { href: "/dashboard", label: t("dashboard.nav_overview"), icon: LayoutDashboard },
    { href: "/dashboard/profile", label: t("dashboard.nav_profile"), icon: User },
    { href: "/dashboard/posts", label: t("dashboard.nav_posts"), icon: ImageIcon },
    { href: "/dashboard/analytics", label: t("dashboard.nav_analytics"), icon: BarChart3 },
    { href: "/dashboard/settings", label: t("dashboard.nav_settings"), icon: Settings },
  ];

  const hubUrl = getDiscordHubUrl(user.creator?.hub?.channelId);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <a
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 text-xs font-semibold transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mój Creator Hub na Discord</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-1">
          <div className="bg-surface rounded-xl border border-surface-border p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-primary/15 text-brand-primary font-bold border border-brand-primary/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
