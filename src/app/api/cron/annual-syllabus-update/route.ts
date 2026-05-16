import { NextRequest, NextResponse } from "next/server";
import { runAnnualUpdate } from "../../../../../scripts/annual-syllabus-update";

/**
 * Annual Syllabus Update Cron Endpoint
 *
 * Called by Vercel Cron: Once a year on June 1st at 3 AM IST
 * URL: /api/cron/annual-syllabus-update
 *
 * Purpose: Mark old syllabus questions as outdated when new syllabi are announced
 * Timing: June 1st aligns with Indian academic year (starts April, new syllabi by May)
 * Security: Only callable by Vercel cron (verifies Authorization header)
 */
export async function GET(request: NextRequest) {
  // Security: Verify this is a legitimate Vercel cron request
  const authHeader = request.headers.get("authorization");

  if (process.env.NODE_ENV === "production") {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("❌ CRON_SECRET not configured in environment variables");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("❌ Unauthorized cron request");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    console.log("📅 Starting annual syllabus update...");

    const result = await runAnnualUpdate();

    return NextResponse.json({
      ...result,
      message: "Annual syllabus update completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Annual syllabus update failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
