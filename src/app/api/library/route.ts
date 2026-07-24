import { NextRequest, NextResponse } from "next/server";
import {
  getUserGeneratedQuizzes,
  getUserGeneratedGames,
  getUserGeneratedMockTests,
  getFlashcardDecks,
} from "@/lib/db";

/**
 * GET /api/library
 *
 * The signed-in student's own study sets — everything they've created via the
 * "Turn this into…" convert flow (quizzes / games / mock tests) plus their
 * flashcard decks. Powers the "Your Library" page. Newest first.
 *
 * Each item is normalized to a common shape the library UI renders directly:
 *   { kind, title, count, createdAt, href, shareSlug? }
 *   kind ∈ 'deck' | 'quiz' | 'match' | 'blocks' | 'blast' | 'mock'
 */

interface LibraryItem {
  kind: "deck" | "quiz" | "match" | "blocks" | "blast" | "mock";
  title: string;
  count: number;
  createdAt: string;
  href: string;
  shareSlug?: string;
}

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const [quizzes, games, mocks, decks] = await Promise.all([
      getUserGeneratedQuizzes(userId),
      getUserGeneratedGames(userId),
      getUserGeneratedMockTests(userId),
      getFlashcardDecks(userId),
    ]);

    const items: LibraryItem[] = [];

    for (const q of quizzes) {
      items.push({
        kind: "quiz",
        title: q.title,
        count: q.question_count ?? 0,
        createdAt: new Date(q.created_at).toISOString(),
        href: `/shared/${q.share_slug}`,
        shareSlug: q.share_slug,
      });
    }

    for (const g of games) {
      const kind =
        g.game_type === "blocks" || g.game_type === "blast" ? g.game_type : "match";
      items.push({
        kind,
        title: g.title,
        count: g.pair_count ?? 0,
        createdAt: new Date(g.created_at).toISOString(),
        href: `/shared/${g.share_slug}`,
        shareSlug: g.share_slug,
      });
    }

    for (const m of mocks) {
      items.push({
        kind: "mock",
        title: m.title,
        count: m.question_count ?? 0,
        createdAt: new Date(m.created_at).toISOString(),
        href: `/shared/${m.share_slug}`,
        shareSlug: m.share_slug,
      });
    }

    // getFlashcardDecks returns the user's own decks AND public ones — keep only
    // the ones this user owns so the library shows "your" sets.
    for (const d of decks) {
      if (String(d.user_id) !== String(userId)) continue;
      items.push({
        kind: "deck",
        title: d.title,
        count: d.card_count ?? d.total_cards ?? 0,
        createdAt: new Date(d.created_at).toISOString(),
        href: `/flashcards/study/${d.id}`,
      });
    }

    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[GET /api/library] Error:", error);
    return NextResponse.json({ error: "Failed to load your library." }, { status: 500 });
  }
}
