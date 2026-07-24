import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/pending-questions/[id]/approve
 * Approve a pending question and move it to the main question bank
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const adminId = request.cookies.get("scoreyo-user-id")?.value;

    const { id } = await params;

    // Get pending question
    const pending = await queryOne(
      `SELECT * FROM pending_questions WHERE id = $1`,
      [id]
    );

    if (!pending) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (pending.status !== 'pending') {
      return NextResponse.json(
        { error: `Question already ${pending.status}` },
        { status: 400 }
      );
    }

    // Normalize exam/subject IDs - map common AI mistakes to actual database codes
    const EXAM_ID_MAP: Record<string, string> = {
      'upsc': 'upsc-cse',
      'ssc': 'ssc-cgl',
      'banking': 'ibps-po',
      'gate': 'gate',
      'gate-cs': 'gate',
      'gate-ee': 'gate',
      'gate-me': 'gate',
      'banking-po': 'ibps-po',
      'state-engg': 'kcet',
      'neet': 'neet-ug',
    };

    const SUBJECT_ID_MAP: Record<string, string> = {
      'general-studies': 'upsc-gs',
      'physics': 'jee-physics',
      'chemistry': 'jee-chemistry',
      'mathematics': 'jee-maths',
      'biology': 'neet-biology',
      'quantitative-aptitude': 'cat-quant',
      'reasoning': 'ssc-reasoning',
      'english': 'ssc-english',
      'general-awareness': 'ssc-gk',
      'general-knowledge': 'ssc-gk',
    };

    const normalizedExamId = EXAM_ID_MAP[pending.detected_exam_id] || pending.detected_exam_id;
    const normalizedSubjectId = SUBJECT_ID_MAP[pending.detected_subject_id] || pending.detected_subject_id;

    // Get dimensional IDs for exam and subject
    const examDim = await queryOne(
      `SELECT id FROM dim_exams WHERE exam_code = $1`,
      [normalizedExamId]
    );

    const subjectDim = await queryOne(
      `SELECT id FROM dim_subjects WHERE subject_code = $1`,
      [normalizedSubjectId]
    );

    if (!examDim || !subjectDim) {
      console.error('[Approve] Exam or subject not found in dimensions:', {
        originalExamId: pending.detected_exam_id,
        normalizedExamId,
        examFound: !!examDim,
        originalSubjectId: pending.detected_subject_id,
        normalizedSubjectId,
        subjectFound: !!subjectDim,
      });

      const missingItems = [];
      if (!examDim) missingItems.push(`exam '${normalizedExamId}' (original: '${pending.detected_exam_id}')`);
      if (!subjectDim) missingItems.push(`subject '${normalizedSubjectId}' (original: '${pending.detected_subject_id}')`);

      return NextResponse.json(
        {
          error: `Cannot approve: ${missingItems.join(' and ')} not found in question bank dimensions. Please add them to dim_exams/dim_subjects first.`,
          missingExam: !examDim,
          missingSubject: !subjectDim,
        },
        { status: 400 }
      );
    }

    // Get or create topic dimension
    const topics = typeof pending.detected_topics === 'string'
      ? JSON.parse(pending.detected_topics)
      : pending.detected_topics;

    const firstTopic = topics[0] || 'General Topic';

    let topicDim = await queryOne(
      `SELECT id FROM dim_topics WHERE topic_name = $1`,
      [firstTopic]
    );

    if (!topicDim) {
      // Create new topic - use ON CONFLICT to handle race conditions and sequence issues
      await execute(
        `INSERT INTO dim_topics (topic_name, category, scope) VALUES ($1, $2, $3)
         ON CONFLICT (topic_name) DO NOTHING`,
        [firstTopic, "general", "universal"]
      );
      topicDim = await queryOne(
        `SELECT id FROM dim_topics WHERE topic_name = $1`,
        [firstTopic]
      );

      if (!topicDim) {
        // If still null, the topic_name might not have a unique constraint - try fetching by ILIKE
        topicDim = await queryOne(
          `SELECT id FROM dim_topics WHERE LOWER(topic_name) = LOWER($1) LIMIT 1`,
          [firstTopic]
        );
      }

      if (!topicDim) {
        return NextResponse.json(
          { error: `Failed to create topic '${firstTopic}' in dim_topics. Please check dim_topics sequence.` },
          { status: 500 }
        );
      }
    }

    // Ensure bridge entry exists
    await execute(
      `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [examDim.id, subjectDim.id, topicDim.id]
    );

    // Insert into fact_exam_questions
    const currentYear = new Date().getFullYear();

    // Check if this exact question already exists
    const existingQuestion = await queryOne(
      `SELECT id FROM fact_exam_questions
       WHERE topic_id = $1 AND question = $2`,
      [topicDim.id, pending.question]
    );

    if (existingQuestion) {
      // Question already exists, just update pending status
      await execute(
        `UPDATE pending_questions
         SET status = 'approved',
             reviewed_by = $1,
             reviewed_at = CURRENT_TIMESTAMP,
             review_notes = 'Question already exists in database'
         WHERE id = $2`,
        [adminId, id]
      );

      return NextResponse.json({
        success: true,
        message: "Question already exists in question bank",
        questionId: existingQuestion.id,
        duplicate: true,
      });
    }

    // Insert new question (id will auto-increment)
    const insertResult = await queryOne(
      `INSERT INTO fact_exam_questions (
        topic_id, question, options, correct_answer, explanation,
        difficulty, source, valid_from, valid_until
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        topicDim.id,
        pending.question,
        pending.options,
        pending.correct_answer,
        pending.explanation,
        pending.difficulty || 'medium',
        'ai-validated', // Mark as AI-validated
        currentYear,
        currentYear + 10 // Valid for 10 years
      ]
    );

    const newQuestionId = insertResult?.id;

    // Update pending_questions status
    await execute(
      `UPDATE pending_questions
       SET status = 'approved',
           reviewed_by = $1,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [adminId, id]
    );

    // Credit the contributor (gamification)
    await execute(
      `UPDATE users
       SET questions_contributed = COALESCE(questions_contributed, 0) + 1,
           contribution_points = COALESCE(contribution_points, 0) + 10
       WHERE id = $1`,
      [pending.user_id]
    );

    console.log('[Admin] Approved question:', newQuestionId, 'from pending:', id, 'Contributor:', pending.user_id);

    return NextResponse.json({
      success: true,
      message: "Question approved and added to question bank",
      pendingQuestionId: id,
      newQuestionId: newQuestionId,
      contributorId: pending.user_id,
      pointsAwarded: 10,
    });

  } catch (error: any) {
    console.error('[Approve] Error:', error);
    console.error('[Approve] Error stack:', error.stack);
    console.error('[Approve] Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        errorCode: error.code,
        errorDetail: error.detail,
        errorHint: error.hint,
      },
      { status: 500 }
    );
  }
}
