import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-surface border border-surface-border flex items-center justify-center font-black text-4xl text-brand-primary shadow-2xl">
        404
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Nie znaleziono strony
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Żądany adres nie istnieje, profil został przeniesiony lub link jest nieaktualny.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Strona Główna</span>
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="secondary" size="md" className="gap-2">
            <Compass className="w-4 h-4" />
            <span>Odkrywaj Twórców</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
