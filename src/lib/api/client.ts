import { Creator, Post, PaginatedResult, PlatformMetrics, ReportCreateInput, Report } from "@/types";
import { mockPlatformMetrics } from "./mock-data";
import { db } from "@/lib/storage/db";

const API_BASE_URL = process.env.ONLYYOU_API_URL || "http://localhost:3000/api/v1";
const API_SECRET = process.env.ONLYYOU_API_SECRET || "onlyyou_default_super_secret_key_32_characters!";

interface RequestOptions {
  userId?: string;
  isAdultVerified?: boolean;
}

export class OnlyYouApiClient {
  private static async fetchWithFallback<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackData: T
  ): Promise<T> {
    try {
      const headers = new Headers(options.headers || {});
      headers.set("Authorization", `Bearer ${API_SECRET}`);
      headers.set("Content-Type", "application/json");

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } catch {
      return fallbackData;
    }
  }

  public static async getCreators(params: {
    category?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResult<Creator>> {
    const page = params.page || 1;
    const limit = params.limit || 20;

    if (typeof window !== "undefined") {
      const q = new URLSearchParams();
      if (params.category) q.set("category", params.category);
      q.set("page", String(page));
      q.set("limit", String(limit));
      try {
        const res = await fetch(`/api/creators?${q.toString()}`);
        if (res.ok) return await res.json();
      } catch {}
    }

    const creators = db.getCreators();
    let filtered = creators.filter((c) => c.status === "ACTIVE" && c.webConsent);
    if (params.category && params.category !== "All") {
      filtered = filtered.filter((c) => (c.category ? c.category.toLowerCase() === params.category!.toLowerCase() : false));
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getCreatorByIdOrUsername(identifier: string): Promise<Creator | null> {
    return db.getCreatorByIdOrUsername(identifier);
  }

  public static async getCreatorPosts(
    creatorId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<Post>> {
    const page = params.page || 1;
    const limit = params.limit || 20;

    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/posts?creatorId=${encodeURIComponent(creatorId)}&limit=${limit}&page=${page}`);
        if (res.ok) return await res.json();
      } catch {}
    }

    const posts = db.getCreatorPosts(creatorId);
    const total = posts.length;
    const start = (page - 1) * limit;
    const paginated = posts.slice(start, start + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getPostById(id: string, options?: RequestOptions): Promise<Post | null> {
    const post = db.getPostById(id);
    if (!post) return null;

    // Check 18+ authorization
    const isAdult =
      post.category?.toLowerCase().includes("18+") ||
      post.tags.some((t) => t.toLowerCase() === "18+" || t.toLowerCase() === "nsfw");

    if (isAdult && !options?.isAdultVerified) {
      return {
        ...post,
        requiresAdultVerification: true,
        media: post.media.map((m) => ({
          ...m,
          cdnUrl: null,
          thumbnailUrl: null,
        })),
      };
    }

    return post;
  }

  public static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
    return db.toggleLikePost(postId, userId);
  }

  public static async followCreator(
    creatorId: string,
    userId: string,
    enableNotifications = true
  ): Promise<{ success: boolean }> {
    return { success: true };
  }

  public static async getTrendingCreators(limit = 10): Promise<Creator[]> {
    const creators = db.getCreators();
    const sorted = [...creators].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit);
    return sorted;
  }

  public static async getNewCreators(limit = 10): Promise<Creator[]> {
    const creators = db.getCreators();
    const sorted = [...creators]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    return sorted;
  }

  public static async getTrendingPosts(limit = 20): Promise<Post[]> {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/posts?limit=${limit}`);
        if (res.ok) {
          const json = await res.json();
          return json.data || [];
        }
      } catch {}
    }

    const posts = db.getPosts();
    const sorted = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, limit);
    return sorted;
  }

  public static async getPlatformOverview(): Promise<PlatformMetrics> {
    const creators = db.getCreators();
    const posts = db.getPosts();
    const users = db.getUsers();

    return {
      totalUsers: Math.max(users.length, 1),
      totalCreators: creators.length,
      totalHubs: creators.length,
      totalPosts: posts.length,
      totalViews: posts.reduce((acc, p) => acc + (p.views || 0), 0),
      totalLikes: posts.reduce((acc, p) => acc + (p.likes || 0), 0),
      updatedAt: new Date().toISOString(),
    };
  }

  public static async submitReport(
    input: ReportCreateInput & { targetName?: string }
  ): Promise<{ success: boolean; code: string }> {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const code = `REPORT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReport: Report = {
      id: reportId,
      reporterId: input.reporterId || "user_anonymous",
      targetType: input.targetType || "USER",
      targetId: input.targetId || "unknown",
      targetName: input.targetName || input.targetId || "Zgłoszony obiekt",
      postId: input.postId || null,
      reason: input.reason || "OTHER",
      details: input.details || null,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveReport(newReport);

    return {
      success: true,
      code,
    };
  }

  public static async search(query: string): Promise<{
    creators: Creator[];
    posts: Post[];
    tags: string[];
  }> {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return { creators: [], posts: [], tags: [] };
    }

    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          return json.data || { creators: [], posts: [], tags: [] };
        }
      } catch {}
    }

    const creators = db.getCreators().filter(
      (c) =>
        c.name.toLowerCase().includes(clean) ||
        c.bio?.toLowerCase().includes(clean) ||
        (c.tags ? c.tags.some((t) => t.toLowerCase().includes(clean)) : false)
    );

    const posts = db.getPosts().filter(
      (p) =>
        p.caption?.toLowerCase().includes(clean) ||
        (p.title && p.title.toLowerCase().includes(clean)) ||
        p.tags.some((t) => t.toLowerCase().includes(clean)) ||
        p.creator.name.toLowerCase().includes(clean)
    );

    const allTags = Array.from(
      new Set(creators.flatMap((c) => c.tags || []).concat(posts.flatMap((p) => p.tags)))
    );
    const matchedTags = allTags.filter((t) => t.toLowerCase().includes(clean));

    return { creators, posts, tags: matchedTags };
  }
}
