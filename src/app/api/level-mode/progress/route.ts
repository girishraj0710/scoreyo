import { NextRequest, NextResponse } from "next/server";
import { queryAll } from "@/lib/db";

// GET /api/level-mode/progress?examId=jee
// Returns user's progress for a specific exam (holistic - all subjects combined)
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("krakkify-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");

  if (!examId) {
    return NextResponse.json({ error: "Missing examId" }, { status: 400 });
  }

  try {
    // Get all level progress for this exam (holistic mode doesn't have subject_id)
    const levels = await queryAll(
      `SELECT * FROM user_exam_levels
       WHERE user_id = ? AND exam_id = ?
       ORDER BY level_number ASC`,
      [userId, examId]
    );

    if (!levels || levels.length === 0) {
      // No progress yet - return initial state
      return NextResponse.json({
        success: true,
        currentLevel: 1,
        totalStars: 0,
        completedLevels: 0,
        attempts: 0,
      });
    }

    const totalStars = levels.reduce((sum: number, l: any) => sum + (l.stars_earned || 0), 0);
    const completedLevels = levels.filter((l: any) => l.is_completed).length;
    const totalAttempts = levels.reduce((sum: number, l: any) => sum + (l.attempts || 0), 0);
    const currentLevel = levels.find((l: any) => l.is_unlocked && !l.is_completed);

    return NextResponse.json({
      success: true,
      currentLevel: currentLevel ? currentLevel.level_number : completedLevels + 1,
      totalStars,
      completedLevels,
      attempts: totalAttempts,
    });
  } catch (error) {
    console.error("Error fetching level progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
