import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DiscoverySectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  viewAllHref?: string;
  viewAllText?: string;
  children: React.ReactNode;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  title,
  subtitle,
  icon,
  viewAllHref,
  viewAllText = "Zobacz wszystko",
  children,
}) => {
  return (
    <section className="space-y-4 my-10">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-semibold text-brand-primary hover:text-violet-400 transition-colors flex-shrink-0 group pb-1"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
};
