import { NextRequest, NextResponse } from "next/server";
import { updateEnglishProgress, updateEnglishDailyPractice } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("krakkify-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      pathId,
      topicId,
      level,
      totalQuestions,
      correctAnswers,
      timeTaken,
    } = body;

    if (!pathId || !topicId || !level || totalQuestions === undefined || correctAnswers === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update topic progress
    await updateEnglishProgress(
      userId,
      pathId,
      topicId,
      level,
      totalQuestions,
      correctAnswers,
      timeTaken || 0
    );

    // Update daily practice streak
    const streak = await updateEnglishDailyPractice(
      userId,
      totalQuestions,
      correctAnswers
    );

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return NextResponse.json({
      success: true,
      accuracy,
      streak,
      message: "Progress saved successfully!",
    });
  } catch (error) {
    console.error("Error saving English practice progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
