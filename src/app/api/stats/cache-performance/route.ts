import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

/**
 * Cache Performance Analytics API
 *
 * Returns cache hit rates and question source breakdown.
 * GET /api/stats/cache-performance?period=7d
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const period = request.nextUrl.searchParams.get("period") || "7d";

    const db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // Parse period (7d, 30d, etc.)
    const days = parseInt(period.replace("d", "")) || 7;

    // Fetch quiz sessions with source_stats for this user
    const sessions = await db.execute({
      sql: `
        SELECT source_stats, exam_id, created_at
        FROM quiz_sessions
        WHERE user_id = ?
        AND created_at > datetime('now', ?)
        AND source_stats IS NOT NULL
      `,
      args: [userId, `-${days} days`],
    });

    // Aggregate source stats
    const totals = {
      verified: 0,
      ai: 0,
      total: 0,
    };

    const byExam: Record<string, { verified: number; ai: number }> = {};

    for (const row of sessions.rows) {
      try {
        const stats = JSON.parse(String(row.source_stats));
        const verified = stats.verified || 0;
        const ai = stats.ai || 0;

        totals.verified += verified;
        totals.ai += ai;
        totals.total += verified + ai;

        const examId = String(row.exam_id);
        if (!byExam[examId]) {
          byExam[examId] = { verified: 0, ai: 0 };
        }
        byExam[examId].verified += verified;
        byExam[examId].ai += ai;
      } catch (err) {
        // Skip malformed source_stats
      }
    }

    // Calculate cache hit rate (verified questions are from cache)
    const cacheHitRate = totals.total > 0
      ? Math.round((totals.verified / totals.total) * 100)
      : 0;

    // Performance rating
    let performanceRating = "Unknown";
    if (cacheHitRate >= 80) performanceRating = "Excellent";
    else if (cacheHitRate >= 60) performanceRating = "Good";
    else if (cacheHitRate >= 40) performanceRating = "Fair";
    else performanceRating = "Needs Improvement";

    // Format by-exam breakdown
    const examBreakdown = Object.entries(byExam).map(([examId, stats]) => {
      const total = stats.verified + stats.ai;
      const hitRate = total > 0 ? Math.round((stats.verified / total) * 100) : 0;
      return {
        examId,
        verified: stats.verified,
        ai: stats.ai,
        total,
        hitRate,
      };
    }).sort((a, b) => b.total - a.total);

    return NextResponse.json({
      period: `${days} days`,
      totals,
      cacheHitRate,
      performanceRating,
      quizzesTaken: sessions.rows.length,
      examBreakdown,
    });
  } catch (error: any) {
    console.error("[Cache Performance API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cache performance", details: error.message },
      { status: 500 }
    );
  }
}
