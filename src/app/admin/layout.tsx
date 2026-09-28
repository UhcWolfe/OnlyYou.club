"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Shield, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, isCreator } = useAuth();

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">403 — Brak Uprawnień</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Ten obszar jest ściśle zastrzeżony dla osób z oficjalną odznaką <strong>Administratora</strong> OnlyYou.
          </p>
        </div>
        <Link href="/">
          <Button variant="secondary" size="md" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Wróć do strony głównej</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-700/50 flex items-center justify-center text-red-400">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Panel Administracyjny
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Weryfikacja twórców, nadawanie odznak i moderacja zgłoszeń platformy OnlyYou
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCreator && (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="text-xs">
                Mój Panel Twórcy
              </Button>
            </Link>
          )}
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400">
              Mój Profil
            </Button>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
