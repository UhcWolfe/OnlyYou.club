import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { VIDEO_CATEGORIES } from "@/config/categories";
import { db } from "@/lib/storage/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${siteConfig.domain}`;
  const now = new Date();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/creator-program`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = VIDEO_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/explore?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Dynamic creator profiles
  const creators = db.getCreators();
  const creatorRoutes: MetadataRoute.Sitemap = creators.map((creator) => {
    const slug = creator.user?.username || creator.name;
    return {
      url: `${baseUrl}/${encodeURIComponent(slug)}`,
      lastModified: creator.updatedAt ? new Date(creator.updatedAt) : now,
      changeFrequency: "daily",
      priority: 0.8,
    };
  });

  // Dynamic public posts
  const posts = db.getPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : (post.createdAt ? new Date(post.createdAt) : now),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...creatorRoutes, ...postRoutes];
}
