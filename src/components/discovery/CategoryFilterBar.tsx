"use client";

import React from "react";
import { CREATOR_CATEGORIES } from "@/config/categories";

import { useTranslation } from "@/lib/i18n/context";

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory("All")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === "All"
            ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
            : "bg-surface hover:bg-surface-hover text-zinc-400 hover:text-zinc-200 border border-surface-border"
        }`}
      >
        {t("explore.all_categories")}
      </button>

      {CREATOR_CATEGORIES.map((cat) => {
        const isAdult = cat.includes("18+");
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? isAdult
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : isAdult
                ? "bg-red-950/40 text-red-400 hover:bg-red-950/60 border border-red-800/40"
                : "bg-surface hover:bg-surface-hover text-zinc-400 hover:text-zinc-200 border border-surface-border"
            }`}
          >
            {isAdult ? `🔞 ${cat}` : cat}
          </button>
        );
      })}
    </div>
  );
};
