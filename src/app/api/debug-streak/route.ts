import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * DEBUG ONLY: Check streak data
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get recent sessions
    const recentSessions = await queryAll(
      "SELECT id, created_at, exam_id, total_questions FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    // Get unique days
    const uniqueDays = await queryAll(
      "SELECT DISTINCT DATE(created_at) as day FROM quiz_sessions WHERE user_id = ? ORDER BY day DESC",
      [userId]
    );

    // Get count
    const count = await queryOne(
      "SELECT COUNT(*) as total FROM quiz_sessions WHERE user_id = ?",
      [userId]
    );

    // Check today's sessions
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = await queryAll(
      "SELECT * FROM quiz_sessions WHERE user_id = ? AND DATE(created_at) = ?",
      [userId, today]
    );

    return NextResponse.json({
      userId,
      totalSessions: count.total,
      recentSessions: recentSessions.map(s => ({
        id: s.id,
        created_at: s.created_at,
        exam: s.exam_id,
        questions: s.total_questions
      })),
      uniqueDays: uniqueDays.map(d => d.day),
      todaySessions: todaySessions.length,
      today: today,
    });
  } catch (error) {
    console.error("[Debug Streak] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug data", details: String(error) },
      { status: 500 }
    );
  }
}
