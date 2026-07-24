import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/pending-questions
 * Fetch pending questions for admin review
 */
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    // Get filter from query params
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let whereClause = "status = 'pending'";

    if (filter === 'high-confidence') {
      whereClause += " AND classification_confidence > 0.8 AND quality_score > 70";
    } else if (filter === 'needs-review') {
      whereClause += " AND (classification_confidence < 0.7 OR quality_score < 70 OR duplicate_check_passed = false)";
    }

    const pendingQuestions = await queryAll(
      `SELECT
        id,
        user_id,
        source_type,
        source_file,
        content_preview,
        detected_exam_id,
        detected_subject_id,
        detected_topics,
        classification_confidence,
        question,
        options,
        correct_answer,
        explanation,
        trap_alerts,
        difficulty,
        quality_score,
        duplicate_check_passed,
        status,
        created_at
      FROM pending_questions
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1`,
      [limit]
    );

    // Parse JSON fields
    const parsedQuestions = pendingQuestions.map((q: any) => ({
      ...q,
      detected_topics: typeof q.detected_topics === 'string' ? JSON.parse(q.detected_topics) : q.detected_topics,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      trap_alerts: typeof q.trap_alerts === 'string' ? JSON.parse(q.trap_alerts) : q.trap_alerts,
    }));

    // Get summary stats
    const stats = await queryOne(`
      SELECT
        COUNT(*) as total_pending,
        COUNT(CASE WHEN classification_confidence > 0.8 AND quality_score > 70 THEN 1 END) as high_confidence,
        COUNT(CASE WHEN classification_confidence < 0.7 OR quality_score < 70 THEN 1 END) as needs_review,
        COUNT(CASE WHEN duplicate_check_passed = false THEN 1 END) as potential_duplicates
      FROM pending_questions
      WHERE status = 'pending'
    `);

    return NextResponse.json({
      success: true,
      questions: parsedQuestions,
      stats: {
        totalPending: parseInt(stats?.total_pending || '0'),
        highConfidence: parseInt(stats?.high_confidence || '0'),
        needsReview: parseInt(stats?.needs_review || '0'),
        potentialDuplicates: parseInt(stats?.potential_duplicates || '0'),
      }
    });

  } catch (error: any) {
    console.error('[Admin Pending Questions] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
