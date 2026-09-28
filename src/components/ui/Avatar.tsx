import React from "react";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-28 h-28 text-3xl",
  };

  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center font-semibold text-zinc-300 border border-surface-border flex-shrink-0 select-none",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || "U"}</span>
      )}
    </div>
  );
};
