"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnlyYouApiClient } from "@/lib/api/client";
import { Post, Creator } from "@/types";
import { PostGrid } from "@/components/posts/PostGrid";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { CategoryFilterBar } from "@/components/discovery/CategoryFilterBar";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslation } from "@/lib/i18n/context";
import { Search, SlidersHorizontal, Users, Grid } from "lucide-react";

function ExploreContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"newest" | "trending" | "views" | "likes">("trending");
  const [activeTab, setActiveTab] = useState<"posts" | "creators">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        if (searchQuery.trim()) {
          const searchRes = await OnlyYouApiClient.search(searchQuery.trim());
          if (isMounted) {
            setPosts(searchRes.posts);
            setCreators(searchRes.creators);
          }
        } else {
          const [creatorsResult, postsResult] = await Promise.all([
            OnlyYouApiClient.getCreators({ category: selectedCategory !== "All" ? selectedCategory : undefined }),
            OnlyYouApiClient.getTrendingPosts(24),
          ]);
          if (isMounted) {
            setCreators(creatorsResult.data);
            let filteredPosts = postsResult;
            if (selectedCategory !== "All") {
              filteredPosts = postsResult.filter(
                (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
              );
            }
            if (sortBy === "newest") {
              filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            } else if (sortBy === "views") {
              filteredPosts.sort((a, b) => b.views - a.views);
            } else if (sortBy === "likes") {
              filteredPosts.sort((a, b) => b.likes - a.likes);
            }
            setPosts(filteredPosts);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(loadData, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t("explore.title")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          {t("explore.subtitle")}
        </p>
      </div>

      {/* Search and Filters row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <Input
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("nav.search_placeholder")}
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "trending" | "views" | "likes")}
            className="w-full sm:w-auto h-10 px-3 rounded-lg bg-surface border border-surface-border text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-brand-primary"
          >
            <option value="trending">{t("explore.sort_trending")}</option>
            <option value="newest">{t("explore.sort_newest")}</option>
            <option value="views">{t("explore.sort_most_viewed")}</option>
            <option value="likes">{t("explore.sort_most_liked")}</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
        }}
      />

      {/* Tabs: Posts vs Creators */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "posts"
              ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-surface"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posty ({posts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("creators")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "creators"
              ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-surface"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Twórcy ({creators.length})</span>
        </button>
      </div>

      {/* Content Rendering */}
      {activeTab === "posts" ? (
        <PostGrid posts={posts} isLoading={isLoading} emptyMessage={t("explore.no_results")} />
      ) : (
        <CreatorGrid creators={creators} isLoading={isLoading} emptyMessage={t("creator.not_found")} />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
