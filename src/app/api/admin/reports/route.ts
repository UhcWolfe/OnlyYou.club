import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/storage/db";
import { User, ReportStatus } from "@/types";

export const dynamic = "force-dynamic";

function getAuthenticatedUser(request: NextRequest): User | null {
  const sessionCookie = request.cookies.get("onlyyou_session")?.value;
  if (!sessionCookie) return null;

  try {
    let raw = sessionCookie;
    if (raw.startsWith("%7B") || raw.includes("%22")) {
      raw = decodeURIComponent(raw);
    }
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const sessionUser = getAuthenticatedUser(request);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = sessionUser.id === "1003433567155671183" || sessionUser.discordId === "1003433567155671183";
  const isAdmin = isOwner || sessionUser.role === "ADMIN" || (sessionUser.badges && sessionUser.badges.includes("admin"));

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { reportId, action, actionDesc } = body;

    if (!reportId || !action) {
      return NextResponse.json({ error: "Missing reportId or action" }, { status: 400 });
    }

    db.updateReportStatus(reportId, action as ReportStatus, actionDesc);
    const reports = db.getReports();

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
