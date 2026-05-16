import { NextRequest, NextResponse } from "next/server";
import { runDailySeeding } from "../../../../../scripts/daily-seed-cron";

/**
 * Daily Auto-Seeding Cron Endpoint
 *
 * Called by Vercel Cron: Daily at 2 AM IST
 * URL: /api/cron/daily-seed
 *
 * Security: Only callable by Vercel cron (verifies Authorization header)
 */
export async function GET(request: NextRequest) {
  // Security: Verify this is a legitimate Vercel cron request
  const authHeader = request.headers.get("authorization");

  // In production, Vercel sends: "Bearer <CRON_SECRET>"
  // For testing, we allow requests without auth in development
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
    console.log("🌱 Starting daily seeding cron job...");

    const result = await runDailySeeding();

    return NextResponse.json({
      success: true,
      message: "Daily seeding completed successfully",
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Daily seeding failed:", error);

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
