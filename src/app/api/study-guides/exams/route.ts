import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/study-guides/exams
 * Fetch all exams with their subjects and topics from dimensional model
 *
 * Returns exams grouped by category with subject and topic counts
 */
export async function GET() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log('📚 [EXAMS-API] Fetching exams from dimensional model');

    // Fetch all exams with counts
    const examsResult = await client.query(`
      SELECT
        e.id,
        e.exam_code,
        e.exam_name,
        e.category,
        e.conducting_body,
        COUNT(DISTINCT b.subject_id) as subject_count,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM dim_exams e
      LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
      GROUP BY e.id, e.exam_code, e.exam_name, e.category, e.conducting_body
      ORDER BY e.category, e.exam_name
    `);

    console.log(`✓ [EXAMS-API] Found ${examsResult.rows.length} exams`);

    // For each exam, fetch subjects (but NOT all topics - too slow)
    const exams = [];

    for (const exam of examsResult.rows) {
      // Get subjects for this exam (simplified - no deduplication needed after migration)
      const subjectsResult = await client.query(
        `SELECT
          s.id,
          s.subject_code,
          s.subject_name,
          s.category,
          COUNT(DISTINCT b.topic_id) as topic_count,
          COUNT(DISTINCT CASE WHEN b.is_mandatory = true THEN b.topic_id END) as mandatory_count
        FROM bridge_exam_subject_topic b
        JOIN dim_subjects s ON b.subject_id = s.id
        WHERE b.exam_id = $1
        GROUP BY s.id, s.subject_code, s.subject_name, s.category
        ORDER BY s.subject_name`,
        [exam.id]
      );

      const subjects = subjectsResult.rows.map(subject => ({
        id: subject.subject_code,
        name: subject.subject_name,
        category: subject.category,
        topicCount: parseInt(subject.topic_count),
        mandatoryCount: parseInt(subject.mandatory_count),
        // Topics will be fetched on-demand when user expands subject
        topics: [] // Empty - will be loaded lazily
      }));

      exams.push({
        id: exam.exam_code,
        name: exam.exam_name,
        fullName: exam.exam_name,
        category: exam.category,
        conductingBody: exam.conducting_body,
        subjectCount: parseInt(exam.subject_count),
        topicCount: parseInt(exam.topic_count),
        subjects
      });
    }

    console.log(`✅ [EXAMS-API] Returning ${exams.length} exams`);

    return NextResponse.json({
      success: true,
      exams,
      totalExams: exams.length,
      totalSubjects: exams.reduce((sum, e) => sum + e.subjectCount, 0),
      totalTopics: exams.reduce((sum, e) => sum + e.topicCount, 0)
    });
  } catch (error: any) {
    console.error("❌ [EXAMS-API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
