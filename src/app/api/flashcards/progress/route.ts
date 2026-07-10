import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { recordFlashcardProgress, getFlashcardStats } from '@/lib/db';

/**
 * POST /api/flashcards/progress
 * Record study session (rate a card)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cardId, deckId, rating } = body;

    // Validate rating
    const validRatings = ['again', 'hard', 'good', 'easy'];
    if (!validRatings.includes(rating)) {
      return NextResponse.json(
        { error: 'Invalid rating. Must be: again, hard, good, or easy' },
        { status: 400 }
      );
    }

    const progress = await recordFlashcardProgress(
      parseInt(userId),
      cardId,
      deckId,
      rating as 'again' | 'hard' | 'good' | 'easy'
    );

    return NextResponse.json({
      success: true,
      progress,
      message: `Card rated as "${rating}"`,
    });
  } catch (error) {
    console.error('Error recording flashcard progress:', error);
    return NextResponse.json(
      { error: 'Failed to record progress' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/flashcards/progress
 * Get user's flashcard statistics
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getFlashcardStats(parseInt(userId));

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching flashcard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
