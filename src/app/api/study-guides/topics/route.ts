import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/study-guides/topics
 * Fetch topics for a specific exam and subject
 *
 * Query params:
 * - exam: exam code (e.g., 'jee-main')
 * - subject: subject code (e.g., 'jee-physics')
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const examCode = searchParams.get("exam");
  const subjectCode = searchParams.get("subject");

  if (!examCode || !subjectCode) {
    return NextResponse.json(
      { error: "Missing exam or subject parameter" },
      { status: 400 }
    );
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log(`📚 [TOPICS-API] Fetching topics for ${examCode} → ${subjectCode}`);

    // Map exam code → exam_id
    const examResult = await client.query(
      `SELECT id, exam_name FROM dim_exams WHERE exam_code = $1`,
      [examCode]
    );

    if (examResult.rows.length === 0) {
      return NextResponse.json(
        { error: `Exam not found: ${examCode}` },
        { status: 404 }
      );
    }

    const examId = examResult.rows[0].id;

    // Map subject code → subject_id
    const subjectResult = await client.query(
      `SELECT id, subject_name FROM dim_subjects WHERE subject_code = $1`,
      [subjectCode]
    );

    if (subjectResult.rows.length === 0) {
      return NextResponse.json(
        { error: `Subject not found: ${subjectCode}` },
        { status: 404 }
      );
    }

    const subjectId = subjectResult.rows[0].id;

    // Fetch topics from bridge table
    const topicsResult = await client.query(
      `SELECT
        t.id,
        t.topic_name,
        t.category,
        t.scope,
        t.description,
        t.keywords,
        b.is_mandatory,
        b.weightage
      FROM bridge_exam_subject_topic b
      JOIN dim_topics t ON b.topic_id = t.id
      WHERE b.exam_id = $1 AND b.subject_id = $2
      ORDER BY t.topic_name`,
      [examId, subjectId]
    );

    console.log(`✓ [TOPICS-API] Found ${topicsResult.rows.length} topics`);

    const topics = topicsResult.rows.map(topic => ({
      id: topic.id,
      name: topic.topic_name,
      category: topic.category,
      scope: topic.scope,
      description: topic.description,
      keywords: topic.keywords,
      isMandatory: topic.is_mandatory,
      weightage: topic.weightage
    }));

    return NextResponse.json({
      success: true,
      exam: examResult.rows[0].exam_name,
      subject: subjectResult.rows[0].subject_name,
      topics,
      totalTopics: topics.length
    });
  } catch (error: any) {
    console.error("❌ [TOPICS-API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
