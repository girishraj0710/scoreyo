import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";

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
    const adminId = request.cookies.get("prepgenie-user-id")?.value;
    if (!adminId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

    // Get dimensional IDs for exam and subject
    const examDim = await queryOne(
      `SELECT id FROM dim_exams WHERE exam_code = $1`,
      [pending.detected_exam_id]
    );

    const subjectDim = await queryOne(
      `SELECT id FROM dim_subjects WHERE subject_code = $1`,
      [pending.detected_subject_id]
    );

    if (!examDim || !subjectDim) {
      console.error('[Approve] Exam or subject not found in dimensions:', {
        examId: pending.detected_exam_id,
        subjectId: pending.detected_subject_id
      });

      return NextResponse.json(
        { error: "Cannot approve: exam or subject not found in question bank dimensions" },
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
      // Create new topic
      await execute(
        `INSERT INTO dim_topics (topic_name, category, scope) VALUES ($1, $2, $3)`,
        [firstTopic, "general", "universal"]
      );
      topicDim = await queryOne(
        `SELECT id FROM dim_topics WHERE topic_name = $1`,
        [firstTopic]
      );

      // Create bridge entry
      await execute(
        `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [examDim.id, subjectDim.id, topicDim.id]
      );
    } else {
      // Ensure bridge entry exists
      await execute(
        `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [examDim.id, subjectDim.id, topicDim.id]
      );
    }

    // Insert into fact_exam_questions
    const currentYear = new Date().getFullYear();

    await execute(
      `INSERT INTO fact_exam_questions (
        topic_id, question, options, correct_answer, explanation,
        difficulty, source, valid_from, valid_until
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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

    console.log('[Admin] Approved question:', id, 'Contributor:', pending.user_id);

    return NextResponse.json({
      success: true,
      message: "Question approved and added to question bank",
      questionId: id,
      contributorId: pending.user_id,
      pointsAwarded: 10,
    });

  } catch (error: any) {
    console.error('[Approve] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
