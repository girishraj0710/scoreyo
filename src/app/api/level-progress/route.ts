import { NextRequest, NextResponse } from "next/server";
import { getUserBadges } from "@/lib/db";
import { createClient } from "@libsql/client";

async function queryOne(sql: string, args: any[] = []): Promise<any | undefined> {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const result = await db.execute({ sql, args });
  if (result.rows.length === 0) return undefined;
  const row = result.rows[0];
  const obj: any = {};
  for (const col of result.columns) {
    obj[col] = row[col];
  }
  return obj;
}

async function queryAll(sql: string, args: any[] = []): Promise<any[]> {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const result = await db.execute({ sql, args });
  return result.rows.map((row) => {
    const obj: any = {};
    for (const col of result.columns) {
      obj[col] = row[col];
    }
    return obj;
  });
}

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";

  try {
    // Get total completed levels across all subjects
    const completedLevels = await queryAll(
      "SELECT * FROM user_quiz_levels WHERE user_id = ? AND is_completed = 1 ORDER BY completed_at DESC",
      [userId]
    );

    const totalLevelsCompleted = completedLevels.length;

    // Get total stars
    const starsResult = await queryOne(
      "SELECT COALESCE(SUM(stars_earned), 0) as total FROM user_quiz_levels WHERE user_id = ?",
      [userId]
    );
    const totalStars = starsResult?.total || 0;

    // Get current level (highest unlocked but not completed)
    const currentLevel = await queryOne(
      "SELECT level_number FROM user_quiz_levels WHERE user_id = ? AND is_unlocked = 1 AND is_completed = 0 ORDER BY level_number DESC LIMIT 1",
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
