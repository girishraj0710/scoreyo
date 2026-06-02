import { NextRequest, NextResponse } from "next/server";
import { getUser, getTeacherStats } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/teacher/stats
 * Get teacher/contributor's contribution statistics
 * Returns: questions_contributed, contribution_points, approval_rate, breakdown by status
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user data
    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get stats
    const stats = await getTeacherStats(userId);

    return NextResponse.json({
      success: true,
      stats: {
        questions_contributed: user.questions_contributed || 0,
        contribution_points: user.contribution_points || 0,
        pending_questions: stats.pending_count || 0,
        approved_questions: stats.approved_count || 0,
        rejected_questions: stats.rejected_count || 0,
        approval_rate: stats.approval_rate || 0,
      },
    });
  } catch (error: any) {
    console.error("[Teacher Stats] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
