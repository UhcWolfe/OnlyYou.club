import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/trending", "/creators", "/creator-program", "/post/*", "/faq", "/terms", "/privacy", "/dmca"],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/login",
          "/settings",
          "/profile",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
