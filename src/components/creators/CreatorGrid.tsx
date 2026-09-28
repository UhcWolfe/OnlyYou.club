import React from "react";
import { Creator } from "@/types";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface CreatorGridProps {
  creators: Creator[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const CreatorGrid: React.FC<CreatorGridProps> = ({
  creators,
  isLoading,
  emptyMessage = "Nie znaleziono twórców.",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface border border-surface-border overflow-hidden">
            <Skeleton className="h-24 w-full" />
            <div className="p-4 space-y-3 -mt-8">
              <Skeleton className="w-14 h-14 rounded-full border-2 border-surface" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-full rounded-lg mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-12 text-center text-zinc-500">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};
