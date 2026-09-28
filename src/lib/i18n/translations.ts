import pl from "@/locales/pl.json";
import en from "@/locales/en.json";
import { SupportedLanguage } from "@/types";

export type TranslationKey = string;

const dictionaries = {
  pl,
  en,
};

export function getTranslation(lang: SupportedLanguage, key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[lang] || dictionaries.pl;
  const parts = key.split(".");
  let current: unknown = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to Polish if not found in current dict
      let fallback: unknown = dictionaries.pl;
      for (const p of parts) {
        if (fallback && typeof fallback === "object" && p in (fallback as Record<string, unknown>)) {
          fallback = (fallback as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== "string") {
    return key;
  }

  let text = current;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
    }
  }

  return text;
}
