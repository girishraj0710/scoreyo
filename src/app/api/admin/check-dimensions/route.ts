import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";
import { requireAdminSecret } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/check-dimensions
 * Debug endpoint to check what exam/subject codes exist in dimension tables
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');

    const denied = requireAdminSecret(secretParam, process.env.ADMIN_SECRET);
    if (denied) return denied;

    // Get all exams
    const exams = await queryAll(
      `SELECT id, exam_code, exam_name FROM dim_exams ORDER BY exam_code`
    );

    // Get all subjects
    const subjects = await queryAll(
      `SELECT id, subject_code, subject_name FROM dim_subjects ORDER BY subject_code`
    );

    // Get count of topics
    const topicCount = await queryAll(
      `SELECT COUNT(*) as count FROM dim_topics`
    );

    return NextResponse.json({
      success: true,
      exams,
      subjects,
      topicCount: topicCount[0]?.count || 0,
    });

  } catch (error: any) {
    console.error('[Check Dimensions] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
