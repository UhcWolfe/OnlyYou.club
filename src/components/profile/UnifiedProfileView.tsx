"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Creator, Post } from "@/types";
import { CreatorHeader } from "@/components/creators/CreatorHeader";
import { PostGrid } from "@/components/posts/PostGrid";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { useAuth } from "@/lib/auth/auth-context";
import { mockCreators, mockPosts } from "@/lib/api/mock-data";
import { Film, Heart, Users, PlusCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UnifiedProfileViewProps {
  creator: Creator;
  posts: Post[];
}

export const UnifiedProfileView: React.FC<UnifiedProfileViewProps> = ({
  creator,
  posts: initialPosts,
}) => {
  const { user, followingIds, likedPostIds } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const cleanCreatorName = creator.name.toLowerCase().replace(/[\s_]+/g, "");
  const isSelf = Boolean(
    user &&
      (user.id === creator.userId ||
        user.discordId === creator.discordId ||
        user.id === creator.id ||
        (creator.userId && user.id === creator.userId) ||
        (user.username && user.username.toLowerCase().replace(/[\s_]+/g, "") === cleanCreatorName))
  );

  const badgesList: string[] =
    isSelf && user?.badges !== undefined
      ? user.badges
      : (creator.user?.badges || creator.badges || []);

  const hasCreatorBadge = badgesList.includes("creator");

  const [activeTab, setActiveTab] = useState<"posts" | "following" | "liked">(
    hasCreatorBadge ? "posts" : "following"
  );

  useEffect(() => {
    if (!hasCreatorBadge && activeTab === "posts") {
      setActiveTab(isSelf ? "following" : "posts");
    }
  }, [hasCreatorBadge, activeTab, isSelf]);

  // If viewing own profile, ensure live posts are re-fetched for freshest data
  useEffect(() => {
    if (isSelf && user) {
      fetch(`/api/posts?creatorId=${encodeURIComponent(creator.id)}&limit=50`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data && Array.isArray(data.data)) {
            setPosts(data.data);
          }
        })
        .catch(() => {});
    }
  }, [isSelf, user, creator.id]);

  const followedCreators = mockCreators.filter((c) => followingIds.includes(c.id));
  const likedPosts = mockPosts.filter((p) => likedPostIds.includes(p.id));

  // Sync postCount, totalViews, and totalLikes on creator object with current posts
  const realViews = posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const realLikes = posts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);

  const enrichedCreator: Creator = {
    ...creator,
    badges: isSelf && user?.badges !== undefined ? user.badges : (creator.badges || []),
    postCount: posts.length,
    totalViews: Math.max(creator.totalViews || 0, realViews),
    totalLikes: Math.max(creator.totalLikes || 0, realLikes),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Unified Profile Header */}
      <CreatorHeader creator={enrichedCreator} postCount={posts.length} />

      {/* Profile Tabs & Content */}
      <div className="space-y-6">
        {(hasCreatorBadge || isSelf) && (
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            {hasCreatorBadge && (
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === "posts"
                    ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-surface"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Filmy i Publikacje ({posts.length})</span>
              </button>
            )}

            {isSelf && (
              <>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "following"
                      ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-surface"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Obserwowani ({followedCreators.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("liked")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === "liked"
                      ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-surface"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Polubione ({likedPosts.length})</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab: Posts (Only for verified creators) */}
        {hasCreatorBadge && activeTab === "posts" && (
          <div className="space-y-4">
            {isSelf && posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center bg-surface/30 flex flex-col items-center justify-center gap-3">
                <Film className="w-10 h-10 text-zinc-600" />
                <h3 className="text-base font-bold text-zinc-200">Nie opublikowałeś jeszcze żadnego materiału</h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Przejdź do Panelu Twórcy, aby dodać swój pierwszy film lub publikację!
                </p>
                <Link href="/dashboard/posts">
                  <Button variant="primary" size="sm" className="gap-2 mt-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Dodaj nowy post</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <PostGrid
                posts={posts}
                emptyMessage="Ten twórca nie opublikował jeszcze żadnych materiałów."
              />
            )}
          </div>
        )}

        {/* Tab: Following (For self) */}
        {isSelf && activeTab === "following" && (
          <CreatorGrid
            creators={followedCreators}
            emptyMessage="Nie obserwujesz jeszcze żadnych twórców."
          />
        )}

        {/* Tab: Liked (For self) */}
        {isSelf && activeTab === "liked" && (
          <PostGrid
            posts={likedPosts}
            emptyMessage="Nie masz jeszcze żadnych polubionych postów."
          />
        )}

        {/* CTA banner for self if not a creator */}
        {isSelf && !hasCreatorBadge && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Chcesz publikować własne filmy i publikacje?</h4>
                <p className="text-xs text-zinc-400">Dołącz do Programu Twórców OnlyYou, aby odblokować profil twórcy, statystyki i możliwość wrzucania materiałów.</p>
              </div>
            </div>
            <Link href="/creator-program">
              <Button variant="secondary" size="sm" className="text-amber-400 border-amber-500/30 hover:bg-amber-950/30 whitespace-nowrap">
                Dołącz do Twórców
              </Button>
            </Link>
          </div>
        )}

        {/* Info for other users viewing a non-creator */}
        {!isSelf && !hasCreatorBadge && (
          <div className="rounded-2xl border border-zinc-800/80 p-8 text-center bg-surface/30 flex flex-col items-center justify-center gap-2">
            <Users className="w-8 h-8 text-zinc-500" />
            <h3 className="text-base font-bold text-zinc-200">Profil użytkownika</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Ten profil należy do użytkownika społeczności OnlyYou i nie publikuje materiałów jako twórca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
