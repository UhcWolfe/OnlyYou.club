import { NextRequest, NextResponse } from "next/server";
import { OnlyYouApiClient } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

  const result = await OnlyYouApiClient.getCreators({ category, page, limit });
  return NextResponse.json(result);
}
