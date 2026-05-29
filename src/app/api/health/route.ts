import { NextRequest, NextResponse } from "next/server";
import { getHealthMetrics } from "@/lib/monitoring";
import { queryOne } from "@/lib/db";

/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Returns application health status for monitoring
 */

export async function GET(request: NextRequest) {
  const start = Date.now();

  try {
    // Check database connectivity
    let dbStatus: "healthy" | "degraded" | "down" = "healthy";
    try {
      await queryOne("SELECT 1 as test");
    } catch (error) {
      console.error("[Health Check] Database check failed:", error);
      dbStatus = "down";
    }

    // Check Redis connectivity (rate limiting)
    let redisStatus: "healthy" | "degraded" | "down" = "healthy";
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        if (!response.ok) {
          redisStatus = "degraded";
        }
      } catch (error) {
        console.error("[Health Check] Redis check failed:", error);
        redisStatus = "down";
      }
    }

    const duration = Date.now() - start;
    const overallStatus = dbStatus === "down" || redisStatus === "down" ? "unhealthy" : "healthy";

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbStatus,
        redis: redisStatus,
        api: "healthy",
      },
      responseTime: `${duration}ms`,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "unknown",
    });
  } catch (error) {
    console.error("[Health Check] Failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}
