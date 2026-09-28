import React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-3 text-zinc-500 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            "w-full h-10 rounded-lg bg-surface hover:bg-surface-hover focus:bg-surface border border-surface-border focus:border-brand-primary text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors px-3 py-2 outline-none focus:ring-1 focus:ring-brand-primary",
            icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
