import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/study-content
 * Fetch study material for a specific topic
 *
 * Query params:
 * - subject: 'physics', 'chemistry', 'english', etc.
 * - topic: 'thermodynamics', 'present-simple', etc.
 * - path (optional): For English - 'foundation', 'ielts', etc.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject");
  const topic = searchParams.get("topic");
  const pathId = searchParams.get("path"); // For English: 'foundation', 'ielts', etc.

  if (!subject || !topic) {
    return NextResponse.json(
      { error: "Missing subject or topic parameter" },
      { status: 400 }
    );
  }

  try {
    const pool = getPool();

    let query = `
      SELECT
        id,
        subject_id,
        topic_id,
        path_id,
        title,
        subtitle,
        overview,
        content,
        difficulty_level,
        estimated_time_minutes,
        prerequisites,
        diagrams,
        videos,
        curriculum_standard,
        textbook_references,
        created_at,
        updated_at
      FROM topic_study_content
      WHERE subject_id = $1 AND topic_id = $2
    `;

    const params: any[] = [subject, topic];

    if (pathId) {
      query += ` AND path_id = $3`;
      params.push(pathId);
    } else {
      query += ` AND path_id IS NULL`;
    }

    const result = await pool.query(query, params);

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: "Study material not found for this topic" },
        { status: 404 }
      );
    }

    const material = result.rows[0];

    return NextResponse.json({
      success: true,
      material
    });
  } catch (error) {
    console.error("Error fetching study material:", error);
    return NextResponse.json(
      { error: "Failed to fetch study material" },
      { status: 500 }
    );
  }
}
