import { NextRequest, NextResponse } from "next/server";
import { OnlyYouApiClient } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10;

  if (type === "new") {
    const creators = await OnlyYouApiClient.getNewCreators(limit);
    return NextResponse.json({ data: creators });
  }

  if (type === "posts") {
    const posts = await OnlyYouApiClient.getTrendingPosts(limit);
    return NextResponse.json({ data: posts });
  }

  const creators = await OnlyYouApiClient.getTrendingCreators(limit);
  return NextResponse.json({ data: creators });
}
