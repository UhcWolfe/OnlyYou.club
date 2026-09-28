import { Creator, Post, User, PlatformMetrics } from "@/types";

export const mockUsers: User[] = [];

export const mockCreators: Creator[] = [];

export const mockPosts: Post[] = [];

export const mockPlatformMetrics: PlatformMetrics = {
  totalUsers: 0,
  totalCreators: 0,
  totalHubs: 0,
  totalPosts: 0,
  totalViews: 0,
  totalLikes: 0,
  updatedAt: new Date().toISOString(),
};
