import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "discord";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary: "bg-brand-primary hover:bg-violet-600 text-white shadow-lg shadow-brand-primary/20",
      secondary: "bg-surface-hover hover:bg-surface-active text-zinc-100 border border-surface-border",
      outline: "border border-surface-border hover:border-zinc-500 text-zinc-200 hover:bg-surface-hover",
      ghost: "hover:bg-surface-hover text-zinc-300 hover:text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      discord: "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-2",
      lg: "h-12 px-6 text-base rounded-lg gap-2.5",
      icon: "h-9 w-9 rounded-lg p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
