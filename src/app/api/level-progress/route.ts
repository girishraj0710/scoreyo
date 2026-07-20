import { NextRequest, NextResponse } from "next/server";
import { queryOne, queryAll, getUserBadges } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    // Get total completed levels across all subjects
    const completedLevels = await queryAll(
      "SELECT * FROM user_quiz_levels WHERE user_id = $1 AND is_completed = 1 ORDER BY completed_at DESC",
      [userId]
    );

    const totalLevelsCompleted = completedLevels.length;

    // Get total stars
    const starsResult = await queryOne(
      "SELECT COALESCE(SUM(stars_earned), 0) as total FROM user_quiz_levels WHERE user_id = $1",
      [userId]
    );
    const totalStars = starsResult?.total || 0;

    // Get current level (highest unlocked but not completed)
    const currentLevel = await queryOne(
      "SELECT level_number FROM user_quiz_levels WHERE user_id = $1 AND is_unlocked = 1 AND is_completed = 0 ORDER BY level_number DESC LIMIT 1",
      [userId]
    );

    const currentLevelNumber = currentLevel?.level_number || (totalLevelsCompleted + 1);

    // Get recent badges
    const recentBadges = await getUserBadges(userId);

    // Calculate progress to next level
    const progressToNext = 0; // Can be calculated based on current quiz performance

    return NextResponse.json({
      totalLevelsCompleted,
      totalStars,
      currentLevelNumber,
      progressToNext,
      recentBadges,
    });
  } catch (error) {
    console.error("Level progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch level progress" },
      { status: 500 }
    );
  }
}
