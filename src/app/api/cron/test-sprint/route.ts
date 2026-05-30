import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint - completely public, no auth
 * GET /api/cron/test-sprint
 */
export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasDbUrl = !!process.env.TURSO_DATABASE_URL;
    const hasAuthToken = !!process.env.TURSO_AUTH_TOKEN;
    const hasCronSecret = !!process.env.CRON_SECRET;
    const cronSecretValue = process.env.CRON_SECRET;

    return NextResponse.json({
      message: "Test endpoint working!",
      environment: {
        hasDbUrl,
        hasAuthToken,
        hasCronSecret,
        cronSecretValue: cronSecretValue ? `${cronSecretValue.substring(0, 10)}...` : "not set"
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
