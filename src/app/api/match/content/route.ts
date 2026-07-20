import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";

/**
 * GET /api/match/content
 * Simplified version for debugging - will build up complexity
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  console.log('[Match Content API] User ID:', userId);

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const examCode = request.nextUrl.searchParams.get("examId");
    console.log('[Match Content API] Exam Code:', examCode);

    if (!examCode) {
      return NextResponse.json({ error: "Exam ID required" }, { status: 400 });
    }

    const pairs: Array<{
      id: string;
      question: string;
      answer: string;
      topic: string;
      subject: string;
      source: string;
    }> = [];

    // Step 1: Try to get flashcards (simplest query)
    console.log('[Match Content API] Step 1: Getting flashcards...');
    try {
      const flashcards = await queryAll(
        `SELECT
          fc.id,
          fc.front as question,
          fc.back as answer,
          fd.title as deck_title
        FROM flashcard_decks fd
        JOIN flashcards fc ON fc.deck_id = fd.id
        WHERE fd.exam_id = $1
        AND LENGTH(fc.back) > 5 AND LENGTH(fc.back) < 150
        ORDER BY RANDOM()
        LIMIT 6`,
        [examCode]
      );

      console.log('[Match Content API] Flashcards found:', flashcards.length);

      flashcards.forEach((fc: any) => {
        pairs.push({
          id: `flashcard_${fc.id}`,
          question: fc.question,
          answer: fc.answer,
          topic: fc.deck_title || "General",
          subject: "General",
          source: "flashcard",
        });
      });
    } catch (err: any) {
      console.error('[Match Content API] Flashcard query error:', err.message);
    }

    // If we have some pairs, return them
    if (pairs.length > 0) {
      const cards = [
        ...pairs.map((p, idx) => ({
          id: `q_${idx}`,
          type: "question" as const,
          content: p.question,
          pairId: idx,
          subject: p.subject,
        })),
        ...pairs.map((p, idx) => ({
          id: `a_${idx}`,
          type: "answer" as const,
          content: p.answer,
          pairId: idx,
          subject: p.subject,
        })),
      ].sort(() => Math.random() - 0.5);

      console.log('[Match Content API] Success! Cards:', cards.length);

      return NextResponse.json({
        cards,
        pairCount: pairs.length,
        contentSource: {
          flashcard: pairs.length,
        },
        subjectName: "General",
        examName: examCode,
      });
    } else {
      return NextResponse.json(
        {
          error: "No flashcards available",
          message: "Create some flashcard decks first!",
          examCode
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("[Match Content API] Error:", error);
    console.error("[Match Content API] Stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch match content", details: error.message },
      { status: 500 }
    );
  }
}
