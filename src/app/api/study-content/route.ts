import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * GET /api/study-content
 * Fetch study material for a specific topic using dimensional model
 *
 * Query params:
 * - exam: 'jee-main', 'neet-ug', 'upsc-cse', etc. (exam code)
 * - subject: 'jee-physics', 'neet-biology', etc. (subject code)
 * - topic: 'Thermodynamics', 'Cell Structure', etc. (topic name)
 * - path (optional): For English - 'foundation', 'ielts', etc.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const examCode = searchParams.get("exam");
  const subjectCode = searchParams.get("subject");
  const topicName = searchParams.get("topic");
  const pathId = searchParams.get("path"); // For English multi-path content

  // Direct-lookup mode (e.g. Learn English): the caller knows the exact
  // subject_id/topic_id/path_id and does NOT go through the exam→dim-table
  // mapping. Used by /english/[pathId]/[topicId]/study which calls with
  // ?subject=english&topic=<topicId>&path=<pathId> and no exam code.
  if (!examCode && subjectCode && topicName) {
    try {
      const pool = getPool();
      const result = await pool.query(
        `SELECT * FROM topic_study_content
         WHERE subject_id = $1 AND topic_id = $2 AND path_id = $3
         LIMIT 1`,
        [subjectCode, topicName, pathId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Content not yet available" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, material: result.rows[0] });
    } catch (error) {
      console.error("❌ [STUDY-CONTENT] Direct lookup error:", error);
      return NextResponse.json(
        { error: "Failed to fetch study material" },
        { status: 500 }
      );
    }
  }

  if (!examCode || !subjectCode || !topicName) {
    return NextResponse.json(
      { error: "Missing exam, subject, or topic parameter" },
      { status: 400 }
    );
  }

  try {
    const pool = getPool();

    console.log('📚 [STUDY-CONTENT] Request:', { examCode, subjectCode, topicName, pathId });

    // Step 1: Map exam code → exam_id
    const examResult = await pool.query(
      `SELECT id, exam_name FROM dim_exams WHERE exam_code = $1`,
      [examCode]
    );

    if (examResult.rows.length === 0) {
      console.log('❌ [STUDY-CONTENT] Exam not found:', examCode);
      return NextResponse.json(
        { error: `Exam not found: ${examCode}` },
        { status: 404 }
      );
    }

    const examId = examResult.rows[0].id;
    const examName = examResult.rows[0].exam_name;
    console.log('✓ [STUDY-CONTENT] Exam mapped:', examCode, '→', examId, examName);

    // Step 2: Map subject code → subject_id
    const subjectResult = await pool.query(
      `SELECT id, subject_name FROM dim_subjects WHERE subject_code = $1`,
      [subjectCode]
    );

    if (subjectResult.rows.length === 0) {
      console.log('❌ [STUDY-CONTENT] Subject not found:', subjectCode);
      return NextResponse.json(
        { error: `Subject not found: ${subjectCode}` },
        { status: 404 }
      );
    }

    const subjectId = subjectResult.rows[0].id;
    const subjectName = subjectResult.rows[0].subject_name;
    console.log('✓ [STUDY-CONTENT] Subject mapped:', subjectCode, '→', subjectId, subjectName);

    // Step 3: Find topic in bridge table (exam + subject + topic)
    const topicResult = await pool.query(
      `SELECT
        t.id as topic_id,
        t.topic_name,
        t.category,
        t.scope,
        t.description,
        b.is_mandatory,
        b.weightage
       FROM bridge_exam_subject_topic b
       JOIN dim_topics t ON b.topic_id = t.id
       WHERE b.exam_id = $1
         AND b.subject_id = $2
         AND (
           t.topic_name ILIKE $3
           OR t.topic_name ILIKE $4
           OR t.keywords ILIKE $5
         )
       LIMIT 1`,
      [
        examId,
        subjectId,
        topicName,                              // Exact match
        topicName.replace(/\s+/g, '%'),         // Match with spaces as wildcards
        `%${topicName}%`                        // Partial match
      ]
    );

    if (topicResult.rows.length === 0) {
      console.log('❌ [STUDY-CONTENT] Topic not found in bridge table:', topicName);
      console.log('   Exam:', examId, 'Subject:', subjectId);
      return NextResponse.json(
        { error: `Topic not found: ${topicName} for ${examName} - ${subjectName}` },
        { status: 404 }
      );
    }

    const dimTopicId = topicResult.rows[0].topic_id;
    const dimTopicName = topicResult.rows[0].topic_name;
    console.log('✓ [STUDY-CONTENT] Topic found:', topicName, '→', dimTopicId, dimTopicName);

    // Step 4: Fetch content from topic_study_content
    // Convert topic name to slug format (e.g., "Thermodynamics" → "thermodynamics")
    const topicSlug = topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    console.log('🔍 [STUDY-CONTENT] Searching content with slug:', topicSlug);

    // Try multiple strategies to find content
    let contentResult = null;

    // Strategy 1: Direct slug match
    contentResult = await pool.query(
      `SELECT * FROM topic_study_content
       WHERE topic_id = $1 AND path_id IS NULL
       LIMIT 1`,
      [topicSlug]
    );

    // Strategy 2: Partial match on topic_id
    if (contentResult.rows.length === 0) {
      contentResult = await pool.query(
        `SELECT * FROM topic_study_content
         WHERE topic_id ILIKE $1 AND path_id IS NULL
         LIMIT 1`,
        [`%${topicSlug}%`]
      );
    }

    // Strategy 3: Match on title
    if (contentResult.rows.length === 0) {
      contentResult = await pool.query(
        `SELECT * FROM topic_study_content
         WHERE title ILIKE $1 AND path_id IS NULL
         LIMIT 1`,
        [`%${topicName}%`]
      );
    }

    // Strategy 4: For English, check with path
    if (contentResult.rows.length === 0 && pathId) {
      contentResult = await pool.query(
        `SELECT * FROM topic_study_content
         WHERE topic_id = $1 AND path_id = $2
         LIMIT 1`,
        [topicSlug, pathId]
      );
    }

    if (contentResult.rows.length === 0) {
      console.log('❌ [STUDY-CONTENT] Content not found in topic_study_content');
      console.log('   Tried slug:', topicSlug, 'path:', pathId);

      // Return topic info but no content (frontend will show "under development")
      return NextResponse.json(
        {
          success: false,
          error: "Content not yet available",
          topicInfo: {
            examName,
            subjectName,
            topicName: dimTopicName,
            category: topicResult.rows[0].category,
            scope: topicResult.rows[0].scope,
            isMandatory: topicResult.rows[0].is_mandatory,
            weightage: topicResult.rows[0].weightage
          }
        },
        { status: 404 }
      );
    }

    const material = contentResult.rows[0];
    console.log('✅ [STUDY-CONTENT] Content found:', material.title);

    return NextResponse.json({
      success: true,
      material,
      topicInfo: {
        dimTopicId,
        examName,
        subjectName,
        topicName: dimTopicName,
        category: topicResult.rows[0].category,
        scope: topicResult.rows[0].scope,
        isMandatory: topicResult.rows[0].is_mandatory,
        weightage: topicResult.rows[0].weightage
      }
    });
  } catch (error) {
    console.error("❌ [STUDY-CONTENT] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study material" },
      { status: 500 }
    );
  }
}
