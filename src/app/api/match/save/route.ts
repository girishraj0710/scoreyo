import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/**
 * POST /api/match/save
 * Saves match game session results
 */
export async function POST(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      examId,
      subjectName,
      timeSeconds,
      pairsCount = 6,
      mistakes = 0,
      contentSource = "mixed",
    } = body;

    if (!examId || timeSeconds === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save session
    const session = await queryOne(
      `INSERT INTO match_game_sessions (
        user_id,
        exam_id,
        subject_name,
        time_seconds,
        pairs_count,
        mistakes,
        content_source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, time_seconds, mistakes, created_at`,
      [userId, examId, subjectName, timeSeconds, pairsCount, mistakes, contentSource]
    );

    // Get user's best time for this exam
    const bestTime = await queryOne(
      `SELECT MIN(time_seconds) as best_time
      FROM match_game_sessions
      WHERE user_id = $1 AND exam_id = $2`,
      [userId, examId]
    );

    // Check if this is a personal best
    const isPersonalBest = bestTime?.best_time === timeSeconds;

    return NextResponse.json({
      success: true,
      session,
      isPersonalBest,
      bestTime: bestTime?.best_time || timeSeconds,
    });
  } catch (error) {
    console.error("[Match Save API] Error:", error);
    return NextResponse.json(
      { error: "Failed to save match game session" },
      { status: 500 }
    );
  }
}
