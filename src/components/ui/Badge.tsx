import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "outline" | "secondary" | "success" | "warning" | "danger" | "adult";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    brand: "bg-brand-primary/15 text-brand-primary border-brand-primary/30",
    outline: "border border-surface-border text-zinc-400",
    secondary: "bg-surface text-zinc-300 border-surface-border",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
    adult: "bg-red-950/60 text-red-400 border-red-800/60 font-semibold tracking-wider",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
