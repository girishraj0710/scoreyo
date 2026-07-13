import { NextRequest, NextResponse } from "next/server";
import { queryAll, execute } from "@/lib/db";

// Generate 30 holistic levels for an exam (all subjects mixed)
function generateHolisticLevels(examId: string) {
  const levels = [];

  // Levels 1-10: Beginner (Easy - 10 questions)
  for (let i = 1; i <= 9; i++) {
    levels.push({
      examId,
      levelNumber: i,
      levelName: `Level ${i} - Foundation`,
      levelType: "normal",
      difficulty: "easy",
      questionCount: 10,
      unlockRequirement: i === 1 ? "Start here" : `Complete Level ${i - 1} with 80%+`,
    });
  }

  // Level 10: Boss
  levels.push({
    examId,
    levelNumber: 10,
    levelName: "🏆 BOSS: Foundation Master",
    levelType: "boss",
    difficulty: "mixed",
    questionCount: 20,
    unlockRequirement: "Complete Level 9 with 80%+",
  });

  // Levels 11-20: Intermediate (Medium - 15 questions)
  for (let i = 11; i <= 19; i++) {
    levels.push({
      examId,
      levelNumber: i,
      levelName: `Level ${i} - Intermediate`,
      levelType: "normal",
      difficulty: "medium",
      questionCount: 15,
      unlockRequirement: `Complete Level ${i - 1} with 80%+`,
    });
  }

  // Level 20: Boss
  levels.push({
    examId,
    levelNumber: 20,
    levelName: "🏆 BOSS: Intermediate Champion",
    levelType: "boss",
    difficulty: "mixed",
    questionCount: 20,
    unlockRequirement: "Complete Level 19 with 80%+",
  });

  // Levels 21-30: Advanced (Hard - 20 questions)
  for (let i = 21; i <= 29; i++) {
    levels.push({
      examId,
      levelNumber: i,
      levelName: `Level ${i} - Advanced`,
      levelType: "normal",
      difficulty: "hard",
      questionCount: 20,
      unlockRequirement: `Complete Level ${i - 1} with 80%+`,
    });
  }

  // Level 30: Final Boss
  levels.push({
    examId,
    levelNumber: 30,
    levelName: "👑 FINAL BOSS: Ultimate Challenge",
    levelType: "boss",
    difficulty: "mixed",
    questionCount: 25,
    unlockRequirement: "Complete Level 29 with 80%+",
  });

  return levels;
}

// GET /api/level-mode/levels?examId=jee
// Returns 30 holistic levels with user progress
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
    // Initialize first level if doesn't exist
    const existingLevels = await queryAll(
      `SELECT * FROM user_exam_levels WHERE user_id = ? AND exam_id = ?`,
      [userId, examId]
    );

    if (!existingLevels || existingLevels.length === 0) {
      // Create Level 1 as unlocked
      const { randomUUID } = await import("crypto");
      await execute(
        `INSERT INTO user_exam_levels (id, user_id, exam_id, level_number, level_type, is_unlocked)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [randomUUID(), userId, examId, 1, "normal", 1]
      );
    }

    // Get user progress
    const userProgress = await queryAll(
      `SELECT * FROM user_exam_levels
       WHERE user_id = ? AND exam_id = ?
       ORDER BY level_number ASC`,
      [userId, examId]
    );

    // Generate level definitions
    const levelDefinitions = generateHolisticLevels(examId);

    // Merge definitions with user progress
    const levels = levelDefinitions.map((def) => {
      const progress = userProgress?.find((p: any) => p.level_number === def.levelNumber);

      return {
        levelNumber: def.levelNumber,
        levelName: def.levelName,
        levelType: def.levelType,
        difficulty: def.difficulty,
        questionCount: def.questionCount,
        isUnlocked: progress ? Boolean(progress.is_unlocked) : false,
        isCompleted: progress ? Boolean(progress.is_completed) : false,
        starsEarned: progress ? progress.stars_earned || 0 : 0,
        bestAccuracy: progress ? progress.best_accuracy || 0 : 0,
        attempts: progress ? progress.attempts || 0 : 0,
      };
    });

    return NextResponse.json({
      success: true,
      levels,
    });
  } catch (error) {
    console.error("Error fetching levels:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}
