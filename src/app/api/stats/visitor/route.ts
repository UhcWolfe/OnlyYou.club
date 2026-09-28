import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let visitorId = request.cookies.get("onlyyou_vid")?.value;
    let isNewCookie = false;

    if (!visitorId) {
      // Generate a persistent, pseudo-anonymous unique visitor ID
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "anonymous";
      const userAgent = request.headers.get("user-agent") || "";
      const randomSeed = Math.random().toString(36).substring(2, 15);
      visitorId = `vid_${Buffer.from(`${ip}_${userAgent}_${randomSeed}_${Date.now()}`).toString("base64url").slice(0, 32)}`;
      isNewCookie = true;
    }

    const { totalUniqueVisitors, isNew } = db.recordUniqueVisitor(visitorId);

    const response = NextResponse.json({
      success: true,
      uniqueVisitors: totalUniqueVisitors,
      isNew,
    });

    if (isNewCookie) {
      // Set cookie for 10 years (3650 days)
      response.cookies.set("onlyyou_vid", visitorId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 3650,
        sameSite: "lax",
        httpOnly: true,
      });
    }

    return response;
  } catch (err) {
    console.error("Failed to record visitor:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  const stats = db.getGlobalStats();
  return NextResponse.json({
    success: true,
    stats,
  });
}
