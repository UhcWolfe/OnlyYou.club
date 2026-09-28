import React from "react";
import { OnlyYouApiClient } from "@/lib/api/client";
import { HomeFeed } from "@/components/discovery/HomeFeed";

export const revalidate = 60;

export default async function HomePage() {
  const [trendingPosts, newCreators, latestPostsResult, trendingCreators] = await Promise.all([
    OnlyYouApiClient.getTrendingPosts(4),
    OnlyYouApiClient.getNewCreators(4),
    OnlyYouApiClient.getCreators({ limit: 4 }),
    OnlyYouApiClient.getTrendingCreators(4),
  ]);

  const allLatestPosts = await OnlyYouApiClient.getTrendingPosts(8);
  const latestPosts = allLatestPosts.slice(4, 8);

  return (
    <HomeFeed
      trendingPosts={trendingPosts}
      newCreators={newCreators}
      latestPosts={latestPosts}
      trendingCreators={trendingCreators}
    />
  );
}
