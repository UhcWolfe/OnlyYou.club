"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { SupportedLanguage } from "@/types";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC<{ variant?: "compact" | "default" }> = ({ variant = "default" }) => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "pl" ? "en" : "pl");
  };

  if (variant === "compact") {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-hover hover:bg-surface-active text-zinc-300 hover:text-white border border-surface-border transition-colors"
        title="Toggle language (PL / EN)"
      >
        <Globe className="w-3.5 h-3.5 text-brand-primary" />
        <span>{language.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-surface-hover p-1 rounded-lg border border-surface-border">
      <button
        onClick={() => setLanguage("pl")}
        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
          language === "pl"
            ? "bg-brand-primary text-white"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        🇵🇱 PL
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
          language === "en"
            ? "bg-brand-primary text-white"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};
