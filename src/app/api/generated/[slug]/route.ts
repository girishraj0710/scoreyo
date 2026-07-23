import { NextRequest, NextResponse } from "next/server";
import {
  getGeneratedQuizBySlug,
  getGeneratedGameBySlug,
  getGeneratedMockTestBySlug,
} from "@/lib/db";

/**
 * GET /api/generated/[slug]
 *
 * Public fetch of a generated study artifact (quiz / game / mock) by its
 * share slug. Powers both shareable links and the "play now" hop straight
 * after a conversion. Decks are NOT here — they keep /api/flashcards/public/[slug].
 *
 * Returns:
 *   quiz  → { type:'quiz',  title, difficulty, questions:[{question,options,correctAnswer,explanation}] }
 *   mock  → { type:'mock',  title, difficulty, durationMinutes, questions:[...] }
 *   game  → { type:'game',  title, gameType, pairs:[{term,definition}] }
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  try {
    const quiz = await getGeneratedQuizBySlug(slug);
    if (quiz) {
      return NextResponse.json({
        type: quiz.mode === "mock" ? "mock" : "quiz",
        title: quiz.title,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      });
    }

    const mock = await getGeneratedMockTestBySlug(slug);
    if (mock) {
      return NextResponse.json({
        type: "mock",
        title: mock.title,
        difficulty: mock.difficulty,
        durationMinutes: mock.duration_minutes,
        questions: mock.questions,
      });
    }

    const game = await getGeneratedGameBySlug(slug);
    if (game) {
      return NextResponse.json({
        type: "game",
        title: game.title,
        gameType: game.game_type,
        pairs: game.pairs,
      });
    }

    return NextResponse.json({ error: "Not found." }, { status: 404 });
  } catch (error) {
    console.error("[GET /api/generated] Error:", error);
    return NextResponse.json({ error: "Failed to load study set." }, { status: 500 });
  }
}
