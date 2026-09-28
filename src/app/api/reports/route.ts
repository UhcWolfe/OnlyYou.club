import { NextRequest, NextResponse } from "next/server";
import { OnlyYouApiClient } from "@/lib/api/client";
import { db } from "@/lib/storage/db";
import { Report } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const reports = db.getReports();
  return NextResponse.json({ status: "ok", count: reports.length, reports });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const code = `REPORT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReport: Report = {
      id: reportId,
      reporterId: body.reporterId || "user_anonymous",
      targetType: body.targetType || "USER",
      targetId: body.targetId || body.target || "unknown",
      targetName: body.targetName || body.target || body.targetId || "Zgłoszony obiekt",
      postId: body.postId || null,
      reason: body.reason || "OTHER",
      details: body.details || null,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveReport(newReport);
    return NextResponse.json({ success: true, code, report: newReport });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to submit report", message: err?.message }, { status: 400 });
  }
}
