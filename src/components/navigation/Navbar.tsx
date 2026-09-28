"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Search,
  Compass,
  Users,
  Flame,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Sparkles,
  Crown,
  Shield,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoggedIn, isCreator, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/creators", label: t("nav.creators"), icon: Users },
    { href: "/trending", label: t("nav.trending"), icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="OnlyYou"
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-hover text-brand-primary font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav.search_placeholder")}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface hover:bg-surface-hover focus:bg-surface border border-surface-border focus:border-brand-primary text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors outline-none"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="compact" />

          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin" className="hidden sm:inline-flex">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs bg-red-950/40 hover:bg-red-950/70 border-red-700/50 text-red-300 gap-1.5 font-bold shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>Panel Admina</span>
                  </Button>
                </Link>
              )}

              {isCreator ? (
                <Link href="/dashboard" className="hidden lg:inline-flex">
                  <Button variant="secondary" size="sm" className="text-xs">
                    <LayoutDashboard className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{t("nav.dashboard")}</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/creator-program" className="hidden lg:inline-flex">
                  <Button variant="secondary" size="sm" className="text-xs bg-brand-primary/10 hover:bg-brand-primary/20 border-brand-primary/30 text-brand-primary gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t("nav.creator_program")}</span>
                  </Button>
                </Link>
              )}

              <Link
                href={user.username ? `/${encodeURIComponent(user.username.toLowerCase())}` : "/profile"}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <Avatar src={user.avatarUrl} alt={user.displayName || user.username} size="sm" />
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-200 leading-none">
                    {user.displayName || user.username}
                  </span>
                  <span className="text-[10px] text-zinc-500 leading-tight">
                    Lvl {user.level}
                  </span>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title={t("nav.logout")}
                className="text-zinc-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="discord" size="sm" className="text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("nav.login")}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
