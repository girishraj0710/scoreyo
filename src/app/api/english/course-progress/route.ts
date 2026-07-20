import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { englishPaths } from "@/lib/english-content";

/**
 * GET /api/english/course-progress
 * Returns dynamic progress for all course tracks
 *
 * Progress calculation:
 * - Foundation: 43 topics (A1-B1)
 * - Advanced: 22 topics (B2-C1)
 * - Vocabulary: TBD (placeholder for now)
 * - IELTS/TOEFL: 6 topics
 *
 * Progress % = (topics with at least 1 completed question) / total topics * 100
 */
export async function GET(request: NextRequest) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get progress for all 4 paths
    const courseProgress: Record<string, number> = {};

    for (const path of englishPaths) {
      // Query PostgreSQL
      const result = await client.query(
        "SELECT * FROM english_progress WHERE user_id = $1 AND path_id = $2 ORDER BY last_practiced DESC",
        [userId, path.id]
      );

      const progressRecords = result.rows;

      // Count topics where user has completed at least 1 question
      const completedTopics = progressRecords.filter(
        (record) => (record.completed_questions as number) > 0
      ).length;

      const totalTopics = path.topics.length;
      const progressPercentage = totalTopics > 0
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0;

      courseProgress[path.id] = progressPercentage;
    }

    // Vocabulary path doesn't exist yet in englishPaths, so add placeholder
    courseProgress['vocabulary'] = 0;

    return NextResponse.json({
      success: true,
      progress: courseProgress,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch course progress" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
