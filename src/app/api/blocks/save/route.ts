import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/**
 * POST /api/blocks/save
 * Save blocks game session results
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
      subjectName,
      score,
      questionsAnswered,
      correctAnswers,
      linesCleared,
      highestCombo,
      timeSeconds,
      levelReached,
      contentSource,
    } = body;

    // Save session
    const session = await queryOne(
      `INSERT INTO blocks_game_sessions
       (user_id, exam_id, subject_name, score, questions_answered, correct_answers,
        lines_cleared, highest_combo, time_seconds, level_reached, content_source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, score, created_at`,
      [
        userId,
        examId,
        subjectName || null,
        score,
        questionsAnswered || 0,
        correctAnswers || 0,
        linesCleared || 0,
        highestCombo || 0,
        timeSeconds,
        levelReached || 1,
        contentSource || "mixed",
      ]
    );

    // Check if personal best
    const personalBest = await queryOne(
      `SELECT MAX(score) as best_score
       FROM blocks_game_sessions
       WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );

    const isPersonalBest = personalBest && session.score >= personalBest.best_score;

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      score: session.score,
      isPersonalBest,
      createdAt: session.created_at,
    });
  } catch (error: any) {
    console.error("[Blocks Save API] Error:", error);
    return NextResponse.json(
      { error: "Failed to save blocks game", details: error.message },
      { status: 500 }
    );
  }
}
