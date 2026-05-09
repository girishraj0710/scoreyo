import { NextRequest, NextResponse } from "next/server";
import { getEnglishQuestions } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pathId, topicId, level, count = 10 } = body;

    if (!pathId || !topicId || !level) {
      return NextResponse.json(
        { error: "Missing required fields: pathId, topicId, level" },
        { status: 400 }
      );
    }

    // Fetch questions from database
    const questions = await getEnglishQuestions(pathId, topicId, level, count);

    if (questions.length === 0) {
      // No questions in DB yet - return empty for now
      // In production, this would trigger AI generation
      return NextResponse.json({
        questions: [],
        message: "No questions available yet. Please check back soon!",
      });
    }

    // Return questions
    return NextResponse.json({
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("Error fetching English practice questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
