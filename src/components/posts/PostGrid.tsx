import React from "react";
import { Post } from "@/types";
import { PostCard } from "@/components/posts/PostCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts, isLoading, emptyMessage = "Brak postów." }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface border border-surface-border overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-12 text-center text-zinc-500">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
