import { NextRequest, NextResponse } from "next/server";
import { OnlyYouApiClient } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const result = await OnlyYouApiClient.search(q);
  return NextResponse.json({ data: result });
}
