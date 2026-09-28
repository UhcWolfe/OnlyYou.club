"use client";

import React, { useState } from "react";
import { BadgeDefinition } from "@/config/badges";

interface ProfileBadgeBarProps {
  badges: BadgeDefinition[];
  className?: string;
  size?: "sm" | "md" | "lg";
  tooltipPosition?: "top" | "bottom";
}

export const ProfileBadgeBar: React.FC<ProfileBadgeBarProps> = ({
  badges,
  className = "",
  size = "md",
  tooltipPosition = "bottom",
}) => {
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
  const [showEmptyTooltip, setShowEmptyTooltip] = useState(false);

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5 sm:w-6 sm:h-6",
    lg: "w-6 h-6 sm:w-7 sm:h-7",
  };

  const containerPadding = {
    sm: "px-1.5 py-0.5 min-h-[26px]",
    md: "px-2 py-1 min-h-[32px]",
    lg: "px-2.5 py-1.5 min-h-[38px]",
  };

  const hasBadges = badges.length > 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#111214]/90 hover:bg-[#111214] border border-[#27272a] rounded-lg shadow-inner transition-colors relative z-20 hover:z-50 ${containerPadding[size]} ${className}`}
      title={!hasBadges ? "Miejsce na odznaki profilu" : undefined}
    >
      {hasBadges ? (
        badges.map((badge) => {
          const isHovered = hoveredBadgeId === badge.id;

          return (
            <div
              key={badge.id}
              className="relative flex items-center justify-center group"
              onMouseEnter={() => setHoveredBadgeId(badge.id)}
              onMouseLeave={() => setHoveredBadgeId(null)}
            >
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className={`${iconSizes[size]} object-contain drop-shadow-md cursor-pointer transition-transform duration-150 group-hover:scale-115`}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (badge.id === "admin" && !target.src.endsWith("/badges/admin.webp")) {
                    target.src = "/badges/admin.webp";
                  } else if (badge.id === "creator" && !target.src.endsWith("/badges/creator.webp")) {
                    target.src = "/badges/creator.webp";
                  }
                }}
              />

              {/* Discord-style Tooltip */}
              {isHovered && (
                <div
                  className={`absolute ${
                    tooltipPosition === "top"
                      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
                      : "top-full left-1/2 -translate-x-1/2 mt-2"
                  } z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150`}
                >
                  {tooltipPosition === "bottom" && (
                    <div className="w-2 h-2 bg-[#18191c] border-l border-t border-zinc-800 transform rotate-45 mx-auto -mb-1" />
                  )}
                  <div className="bg-[#18191c] text-white px-3 py-1.5 rounded-lg shadow-2xl border border-zinc-800 text-center w-max max-w-[240px]">
                    <div className="text-[11px] font-bold text-white whitespace-nowrap">{badge.name}</div>
                    {badge.description && (
                      <div className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug whitespace-normal break-words">
                        {badge.description}
                      </div>
                    )}
                  </div>
                  {tooltipPosition === "top" && (
                    <div className="w-2 h-2 bg-[#18191c] border-r border-b border-zinc-800 transform rotate-45 mx-auto -mt-1" />
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        /* Empty Badge Placeholder Slot */
        <div
          className="relative flex items-center gap-1.5 cursor-default py-0.5 px-1"
          onMouseEnter={() => setShowEmptyTooltip(true)}
          onMouseLeave={() => setShowEmptyTooltip(false)}
        >
          {/* Subtle empty slots reminiscent of Discord badge bar */}
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-dashed border-zinc-600/50 bg-zinc-800/20 flex items-center justify-center opacity-40" />
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-dashed border-zinc-700/40 bg-zinc-800/10 hidden sm:flex items-center justify-center opacity-30" />
          <span className="text-[10px] text-zinc-500 font-medium select-none px-0.5">
            Brak odznak
          </span>

          {/* Empty Slot Tooltip */}
          {showEmptyTooltip && (
            <div
              className={`absolute ${
                tooltipPosition === "top"
                  ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
                  : "top-full left-1/2 -translate-x-1/2 mt-2"
              } z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150`}
            >
              {tooltipPosition === "bottom" && (
                <div className="w-2 h-2 bg-[#18191c] border-l border-t border-zinc-800 transform rotate-45 mx-auto -mb-1" />
              )}
              <div className="bg-[#18191c] text-zinc-300 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-2xl border border-zinc-800 text-center w-max max-w-[240px] whitespace-normal leading-snug">
                <span>Odznaki profilu (Dostępne dla zweryfikowanych twórców)</span>
              </div>
              {tooltipPosition === "top" && (
                <div className="w-2 h-2 bg-[#18191c] border-r border-b border-zinc-800 transform rotate-45 mx-auto -mt-1" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
