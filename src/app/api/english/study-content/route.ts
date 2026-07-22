import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/english/study-content
 * Fetch Learn English lesson content from the dedicated english_study_content
 * table. English content is kept separate from exam content (which lives in
 * topic_study_content and is served by /api/study-content).
 *
 * Query params:
 * - path:  learning path id — 'foundation' | 'advanced' | 'ielts-toefl' | 'real-world'
 * - topic: topic id (matches the id in the english TS content library)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pathId = searchParams.get("path");
  const topicId = searchParams.get("topic");

  if (!pathId || !topicId) {
    return NextResponse.json(
      { error: "Missing path or topic parameter" },
      { status: 400 }
    );
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT * FROM english_study_content
       WHERE path_id = $1 AND topic_id = $2
       LIMIT 1`,
      [pathId, topicId]
    );

    if (result.rows.length === 0) {
      // No content authored yet → the study page shows a graceful
      // "coming soon" state. This is expected for not-yet-authored topics.
      return NextResponse.json(
        { success: false, error: "Content not yet available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, material: result.rows[0] });
  } catch (error) {
    console.error("❌ [ENGLISH-STUDY-CONTENT] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study material" },
      { status: 500 }
    );
  }
}
