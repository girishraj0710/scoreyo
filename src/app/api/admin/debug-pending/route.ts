import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/debug-pending
 * Debug endpoint to check pending question statuses
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');

    if (secretParam !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all pending questions with their statuses
    const allQuestions = await queryAll(
      `SELECT id, status, detected_exam_id, detected_subject_id,
              created_at, reviewed_at, reviewed_by
       FROM pending_questions
       ORDER BY created_at DESC
       LIMIT 20`
    );

    // Count by status
    const statusCounts = await queryAll(
      `SELECT status, COUNT(*) as count
       FROM pending_questions
       GROUP BY status`
    );

    // Count questions in fact_exam_questions
    const factCount = await queryAll(
      `SELECT source, COUNT(*) as count
       FROM fact_exam_questions
       GROUP BY source`
    );

    return NextResponse.json({
      success: true,
      recentQuestions: allQuestions,
      statusCounts,
      factTableCounts: factCount,
    });

  } catch (error: any) {
    console.error('[Debug Pending] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
