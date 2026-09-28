"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { Compass, Users, Flame, User, LayoutDashboard, Home, Crown } from "lucide-react";

export const MobileNav: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn, isCreator } = useAuth();
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/creators", label: t("nav.creators"), icon: Users },
    { href: "/trending", label: t("nav.trending"), icon: Flame },
    isLoggedIn
      ? isCreator
        ? { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard }
        : { href: "/creator-program", label: t("nav.creator_program"), icon: Crown }
      : { href: "/login", label: t("nav.login"), icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-surface-border px-2 py-1">
      <nav className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? "text-brand-primary" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
