import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { cookies } from "next/headers";

/**
 * GET /api/activity-feed
 * Returns unified activity feed from BOTH English and Exam systems
 *
 * This endpoint aggregates all user learning activities:
 * - Exam quiz sessions
 * - English practice sessions
 * - Study reading sessions (both types)
 * - Flashcard reviews
 *
 * Used by dashboard to show "Recently Studied" section
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("krakkify-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const pool = getPool();

    // Unified activity query - aggregates from all systems
    const activities = await pool.query(
      `SELECT * FROM (
        -- Exam quiz sessions
        SELECT
          'exam_quiz' as activity_type,
          created_at as timestamp,
          exam_id as context_id,
          subject_id,
          topic as detail,
          total_questions as metric1,
          correct_answers as metric2,
          CASE
            WHEN total_questions > 0 THEN ROUND((correct_answers::DECIMAL / total_questions::DECIMAL) * 100, 1)
            ELSE 0
          END as metric3
        FROM quiz_sessions
        WHERE user_id = $1

        UNION ALL

        -- English practice sessions
        SELECT
          'english_practice' as activity_type,
          last_practiced as timestamp,
          path_id as context_id,
          topic_id as subject_id,
          level as detail,
          completed_questions as metric1,
          correct_answers as metric2,
          mastery_score as metric3
        FROM english_progress
        WHERE user_id = $1 AND last_practiced IS NOT NULL

        UNION ALL

        -- Study reading sessions (infer type from path_id)
        SELECT
          CASE
            WHEN path_id IN ('foundation', 'advanced', 'ielts-toefl', 'real-world') THEN 'english_study'
            ELSE 'exam_study'
          END as activity_type,
          start_time as timestamp,
          path_id as context_id,
          subject_id,
          topic_id as detail,
          duration_seconds as metric1,
          sections_read as metric2,
          completion_percentage as metric3
        FROM study_reading_sessions
        WHERE user_id = $1 AND start_time IS NOT NULL

        UNION ALL

        -- Flashcard reviews
        SELECT
          'flashcard' as activity_type,
          created_at as timestamp,
          CAST(deck_id AS TEXT) as context_id,
          NULL as subject_id,
          NULL as detail,
          cards_studied as metric1,
          cards_correct as metric2,
          NULL as metric3
        FROM flashcard_study_sessions
        WHERE user_id = $1

      ) AS unified_activity
      ORDER BY timestamp DESC
      LIMIT $2`,
      [userId, limit]
    );

    return NextResponse.json({
      activities: activities.rows,
      count: activities.rowCount
    });

  } catch (error) {
    console.error("Error fetching activity feed:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
