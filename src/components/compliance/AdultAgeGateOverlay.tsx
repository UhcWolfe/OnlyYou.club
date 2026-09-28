"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Lock } from "lucide-react";

const STORAGE_KEY_AGE_VERIFIED = "onlyyou_age_verified";
const COOKIE_KEY_AGE_VERIFIED = "onlyyou_age_confirmed";

export const AdultAgeGateOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already confirmed in this session
    try {
      const hasLocalConsent = sessionStorage.getItem(STORAGE_KEY_AGE_VERIFIED) === "true";
      const hasCookieConsent = document.cookie.includes(`${COOKIE_KEY_AGE_VERIFIED}=1`);

      if (!hasLocalConsent && !hasCookieConsent) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleEnter = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY_AGE_VERIFIED, "true");
      // Set session cookie so backend/subsequent pages also know
      document.cookie = `${COOKIE_KEY_AGE_VERIFIED}=1; path=/; SameSite=Lax`;
    } catch {}
    setIsOpen(false);
  };

  const handleExit = () => {
    // Redirect away from adult website
    window.location.href = "https://www.google.com";
  };

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in-0 duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-red-800/40 p-6 sm:p-8 shadow-2xl shadow-red-950/60 text-center space-y-6">
        {/* Glow backdrop */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon & Logo */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/50">
            <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-black uppercase tracking-widest">
            <span>🔞 Strona dla pełnoletnich (18+)</span>
          </div>
        </div>

        {/* Text statement */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Ostrzeżenie: Treści dla Dorosłych
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            Ta strona internetowa (<strong className="text-white">OnlyYou</strong>) zawiera materiały przeznaczone wyłącznie dla osób, które ukończyły <strong className="text-red-400 font-bold">18 rok życia</strong> (lub osiągnęły pełnoletność w swoim kraju).
          </p>
        </div>

        {/* Disclaimer box */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Lock className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span>Wchodząc do serwisu, oświadczasz że:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400 leading-normal pl-1">
            <li>Masz ukończone co najmniej 18 lat.</li>
            <li>Wyrażasz zgodę na oglądanie materiałów erotycznych i dla dorosłych.</li>
            <li>Przeglądanie takich materiałów nie narusza prawa w Twojej jurysdykcji.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>MAM UKOŃCZONE 18 LAT — WCHODZĘ</span>
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>Wyjdź</span>
          </button>
        </div>

        <p className="text-[10px] text-zinc-600">
          Restricted To Adults (RTA) • Zgodność z 18 U.S.C. 2257 i standardami moderacji OnlyYou | Club.
        </p>
      </div>
    </div>
  );
};
