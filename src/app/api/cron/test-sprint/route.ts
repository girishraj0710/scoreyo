import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint - completely public, no auth
 * GET /api/cron/test-sprint
 */
export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasTursoUrl = !!process.env.TURSO_DATABASE_URL;
    const hasTursoToken = !!process.env.TURSO_AUTH_TOKEN;
    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasCronSecret = !!process.env.CRON_SECRET;
    const cronSecretValue = process.env.CRON_SECRET;

    // Show first few characters of POSTGRES_URL to verify it's set correctly
    const postgresUrlPrefix = process.env.POSTGRES_URL
      ? process.env.POSTGRES_URL.substring(0, 20) + "..."
      : "not set";

    return NextResponse.json({
      message: "Test endpoint working!",
      environment: {
        hasTursoUrl,
        hasTursoToken,
        hasPostgresUrl,
        postgresUrlPrefix,
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
