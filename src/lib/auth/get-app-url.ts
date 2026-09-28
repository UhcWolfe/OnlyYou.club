import { NextRequest } from "next/server";

export function getAppUrl(request?: NextRequest | Request): string {
  // 1. Detect from incoming request headers to preserve www vs non-www exactly as user browses
  if (request) {
    let rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const host = rawHost ? rawHost.split(",")[0].trim() : null;
    const cfVisitor = request.headers.get("cf-visitor");
    let proto = request.headers.get("x-forwarded-proto") || "https";
    if (cfVisitor && cfVisitor.includes("https")) {
      proto = "https";
    }

    if (host) {
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        return `http://${host}`;
      }
      if (host.includes("onlyyouhub.com") || host.includes("onlyyou.club")) {
        return `https://${host}`.replace(/\/+$/, "");
      }
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }

  // 2. Check explicit environment variables
  const envUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "").trim().replace(/\/+$/, "");
  if (envUrl && !envUrl.includes("83.168.") && !envUrl.includes("localhost")) {
    return envUrl;
  }

  return "https://onlyyouhub.com";
}
