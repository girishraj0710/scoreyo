import { NextRequest, NextResponse } from "next/server";
import { queryOne, queryAll, getUserBadges } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required", userId: null },
      { status: 401 }
    );
  }

  const debugInfo: any = {
    userId,
    steps: [],
    errors: [],
  };

  try {
    // Step 1: Check if user_quiz_levels table exists
    debugInfo.steps.push("Checking user_quiz_levels table...");
    try {
      const tableCheck = await queryOne(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_quiz_levels')",
        []
      );
      debugInfo.tableExists = tableCheck?.exists || false;
      debugInfo.steps.push(`Table exists: ${debugInfo.tableExists}`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "table_check", error: error.message });
    }

    // Step 2: Get total completed levels
    debugInfo.steps.push("Fetching completed levels...");
    try {
      const completedLevels = await queryAll(
        "SELECT * FROM user_quiz_levels WHERE user_id = $1 AND is_completed = true ORDER BY completed_at DESC",
        [userId]
      );
      debugInfo.completedLevels = completedLevels.length;
      debugInfo.completedLevelsData = completedLevels;
      debugInfo.steps.push(`Found ${completedLevels.length} completed levels`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "completed_levels", error: error.message, stack: error.stack });
    }

    // Step 3: Get total stars
    debugInfo.steps.push("Fetching total stars...");
    try {
      const starsResult = await queryOne(
        "SELECT COALESCE(SUM(stars_earned), 0) as total FROM user_quiz_levels WHERE user_id = $1",
        [userId]
      );
      debugInfo.totalStars = starsResult?.total || 0;
      debugInfo.steps.push(`Total stars: ${debugInfo.totalStars}`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "total_stars", error: error.message, stack: error.stack });
    }

    // Step 4: Get current level
    debugInfo.steps.push("Fetching current level...");
    try {
      const currentLevel = await queryOne(
        "SELECT level_number FROM user_quiz_levels WHERE user_id = $1 AND is_unlocked = true AND is_completed = false ORDER BY level_number DESC LIMIT 1",
        [userId]
      );
      debugInfo.currentLevel = currentLevel;
      debugInfo.steps.push(`Current level: ${currentLevel?.level_number || 'none'}`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "current_level", error: error.message, stack: error.stack });
    }

    // Step 5: Get recent badges
    debugInfo.steps.push("Fetching recent badges...");
    try {
      const recentBadges = await getUserBadges(userId);
      debugInfo.recentBadgesCount = recentBadges.length;
      debugInfo.steps.push(`Found ${recentBadges.length} badges`);
    } catch (error: any) {
      debugInfo.errors.push({ step: "recent_badges", error: error.message, stack: error.stack });
    }

    return NextResponse.json({
      success: debugInfo.errors.length === 0,
      debugInfo,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      debugInfo,
    }, { status: 500 });
  }
}
