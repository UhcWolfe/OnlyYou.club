export const VIDEO_CATEGORIES = [
  "Anal",
  "Cosplay",
  "Fetysze",
  "Duże cycki",
  "Duże dupeczki",
  "Faceci solo",
  "Gaming",
  "Gangbang",
  "Hardcore",
  "Hentai",
  "Imprezy",
  "Kompilacje",
  "Odgrywanie ról",
  "Stopy",
  "Trójkąty",
  "Zabawki",
  "Wytrysk",
  "Walenie konia",
] as const;

export const CREATOR_CATEGORIES = VIDEO_CATEGORIES;

export type CreatorCategory = (typeof VIDEO_CATEGORIES)[number];
export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];

export const CATEGORY_ICONS: Record<string, string> = {
  Anal: "Flame",
  Cosplay: "Sparkles",
  Fetysze: "Heart",
  "Duże cycki": "Eye",
  "Duże dupeczki": "Flame",
  "Faceci solo": "User",
  Gaming: "Gamepad2",
  Gangbang: "Users",
  Hardcore: "Zap",
  Hentai: "Palette",
  Imprezy: "PartyPopper",
  Kompilacje: "Film",
  "Odgrywanie ról": "Masks",
  Stopy: "Footprints",
  Trójkąty: "Users",
  Zabawki: "Wand2",
  Wytrysk: "Droplets",
  "Walenie konia": "Hand",
};
