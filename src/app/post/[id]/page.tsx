import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { OnlyYouApiClient } from "@/lib/api/client";
import { PostViewer } from "@/components/posts/PostViewer";
import { PostGrid } from "@/components/posts/PostGrid";
import { siteConfig } from "@/config/site";

interface PostPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await OnlyYouApiClient.getPostById(params.id);
  if (!post) {
    return { title: "Post nie znaleziony" };
  }

  const cleanCategory = post.category || "Erotyka 18+";
  const postTitle = post.caption ? post.caption.slice(0, 150) : `Wideo i zdjęcia od ${post.creator.name}`;
  const canonicalUrl = `https://${siteConfig.domain}/post/${post.id}`;

  return {
    title: `${post.creator.name} — ${postTitle} | OnlyYou 18+`,
    description: `${postTitle} • Kategoria: ${cleanCategory}. Oglądaj darmowe filmy i zdjęcia od ${post.creator.name} w OnlyYou Hub.`,
    keywords: [
      post.creator.name,
      cleanCategory,
      ...post.tags,
      "filmy porno",
      "polskie porno",
      "wideo 18+",
      "zdjęcia erotyczne",
      "onlyyou"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.creator.name} — ${postTitle}`,
      description: `Oglądaj materiały twórczyni ${post.creator.name} na platformie OnlyYou.`,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: post.media[0]?.thumbnailUrl ? [post.media[0].thumbnailUrl] : ["/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.creator.name} — ${postTitle}`,
      description: `Oglądaj materiały twórczyni ${post.creator.name} na platformie OnlyYou.`,
      images: post.media[0]?.thumbnailUrl ? [post.media[0].thumbnailUrl] : ["/logo.png"],
    },
    other: {
      rating: "RTA-5042-1996-1400-1577-RTA",
      "RATING": "adult",
      "Age-Rating": "18+",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await OnlyYouApiClient.getPostById(params.id);

  if (!post) {
    notFound();
  }

  const creatorPostsResult = await OnlyYouApiClient.getCreatorPosts(post.creatorId, { limit: 4 });
  const otherPosts = creatorPostsResult.data.filter((p) => p.id !== post.id);

  return (
    <div className="space-y-12">
      <PostViewer post={post} relatedPosts={otherPosts} />

      {otherPosts.length > 0 && (
        <div className="max-w-6xl mx-auto space-y-4 pt-6 border-t border-surface-border">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Więcej od {post.creator.name}
          </h3>
          <PostGrid posts={otherPosts} />
        </div>
      )}
    </div>
  );
}
