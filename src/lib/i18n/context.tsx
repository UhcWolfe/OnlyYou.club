"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SupportedLanguage } from "@/types";
import { getTranslation } from "./translations";

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "onlyyou_language";

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLanguage?: SupportedLanguage }> = ({
  children,
  initialLanguage = "pl",
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && (saved === "pl" || saved === "en")) {
        setLanguageState(saved);
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.cookie = `onlyyou_locale=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: "pl" as SupportedLanguage,
      setLanguage: () => {},
      t: (key: string, params?: Record<string, string | number>) => getTranslation("pl", key, params),
    };
  }
  return context;
};
