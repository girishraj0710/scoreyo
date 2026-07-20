import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";

/**
 * POST /api/blast/save
 * Save Blast game results
 */
export async function POST(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      examId,
      score,
      questionsAnswered,
      correctAnswers,
      timeSeconds,
      accuracy,
      streak,
    } = body;

    console.log('[Blast Save API] Saving game result:', {
      userId,
      examId,
      score,
      questionsAnswered,
      correctAnswers,
      timeSeconds,
      accuracy,
      streak,
    });

    // Check if this is a personal best
    const previousBest = await queryOne(
      `SELECT score, accuracy
       FROM blast_games
       WHERE user_id = $1 AND exam_id = $2
       ORDER BY score DESC
       LIMIT 1`,
      [userId, examId]
    );

    const isPersonalBest = !previousBest || score > previousBest.score;

    // Save the game result
    await execute(
      `INSERT INTO blast_games (
        user_id,
        exam_id,
        score,
        questions_answered,
        correct_answers,
        time_seconds,
        accuracy,
        highest_streak,
        is_personal_best,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [
        userId,
        examId,
        score,
        questionsAnswered,
        correctAnswers,
        timeSeconds,
        accuracy,
        streak,
        isPersonalBest,
      ]
    );

    console.log('[Blast Save API] Game saved successfully');

    return NextResponse.json({
      success: true,
      isPersonalBest,
      previousBest: previousBest?.score || 0,
    });
  } catch (error: any) {
    console.error("[Blast Save API] Error:", error);
    return NextResponse.json(
      { error: "Failed to save blast game", details: error.message },
      { status: 500 }
    );
  }
}
