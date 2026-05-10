import { NextRequest, NextResponse } from "next/server";
import {
  getUserQuizLevels,
  initializeFirstLevel,
  getQuizLevelProgress,
} from "@/lib/db";
import { getLevelsForSubject } from "@/lib/level-definitions";

// GET /api/quiz/levels?examId=jee&subjectId=physics
export async function GET(req: NextRequest) {
  const userId = req.cookies.get("prepgenie-user-id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");
  const subjectId = searchParams.get("subjectId");

  if (!examId || !subjectId) {
    return NextResponse.json({ error: "Missing examId or subjectId" }, { status: 400 });
  }

  try {
    // Initialize first level if no levels exist
    await initializeFirstLevel(userId, examId, subjectId);

    // Get user progress
    const userProgress = await getUserQuizLevels(userId, examId, subjectId);

    // Get level definitions
    const levelDefinitions = getLevelsForSubject(examId, subjectId);

    // Get progress summary
    const progress = await getQuizLevelProgress(userId, examId, subjectId);

    return NextResponse.json({
      success: true,
      levels: levelDefinitions,
      userProgress,
      progress,
    });
  } catch (error) {
    console.error("Error fetching quiz levels:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}
