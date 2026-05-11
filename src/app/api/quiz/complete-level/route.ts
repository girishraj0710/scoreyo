import { NextRequest, NextResponse } from "next/server";
import { completeQuizLevel } from "@/lib/db";
import { calculateStars } from "@/lib/level-definitions";

// POST /api/quiz/complete-level
export async function POST(req: NextRequest) {
  const userId = req.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      examId,
      subjectId,
      levelNumber,
      levelType,
      correctAnswers,
      totalQuestions,
      timeTakenSeconds,
    } = body;

    if (!examId || !subjectId || !levelNumber || correctAnswers === undefined || !totalQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate accuracy and stars
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const stars = calculateStars(accuracy);

    // Save level completion
    await completeQuizLevel(
      userId,
      examId,
      subjectId,
      levelNumber,
      levelType || 'normal',
      accuracy,
      stars
    );

    // Check if next level should be unlocked
    const shouldUnlock = levelType === 'boss' ? accuracy >= 70 : accuracy >= 60;

    return NextResponse.json({
      success: true,
      stars,
      accuracy,
      nextLevelUnlocked: shouldUnlock,
    });
  } catch (error) {
    console.error("Error completing level:", error);
    return NextResponse.json({ error: "Failed to complete level" }, { status: 500 });
  }
}
