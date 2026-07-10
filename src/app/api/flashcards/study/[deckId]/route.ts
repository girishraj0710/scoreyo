import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDueFlashcards, getFlashcardDeck } from '@/lib/db';

/**
 * GET /api/flashcards/study/[deckId]
 * Get cards due for review (spaced repetition)
 * Query params:
 *   - mode: 'due' (only due cards) | 'all' (all cards) | 'new' (never reviewed)
 *   - shuffle: 'true' | 'false'
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('mode') || 'all';
    const shuffle = searchParams.get('shuffle') === 'true';

    let cards;

    if (mode === 'due') {
      // Only cards due for review
      cards = await getDueFlashcards(parseInt(userId), deckId);
    } else {
      // All cards with progress
      const deck = await getFlashcardDeck(deckId, parseInt(userId));
      if (!deck) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      cards = deck.cards;

      if (mode === 'new') {
        // Only cards never reviewed
        cards = cards.filter((c: any) => !c.last_reviewed);
      }
    }

    // Shuffle if requested
    if (shuffle) {
      cards = cards.sort(() => Math.random() - 0.5);
    }

    return NextResponse.json({
      deckId,
      cards,
      totalCards: cards.length,
      mode,
      shuffle,
    });
  } catch (error) {
    console.error('Error fetching study cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study cards' },
      { status: 500 }
    );
  }
}
