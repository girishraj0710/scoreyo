import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getFlashcardDecks,
  createFlashcardDeck,
  addFlashcardsToDeck,
} from '@/lib/db';

/**
 * GET /api/flashcards/decks
 * Get all flashcard decks for logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decks = await getFlashcardDecks(parseInt(userId));

    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/flashcards/decks
 * Create a new flashcard deck (manual or AI-generated)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      examId,
      subjectId,
      topic,
      isAiGenerated = false,
      cards = [],
    } = body;

    // Validate required fields
    if (!title || !topic) {
      return NextResponse.json(
        { error: 'Title and topic are required' },
        { status: 400 }
      );
    }

    // Create deck
    const deck = await createFlashcardDeck(
      parseInt(userId),
      title,
      description || '',
      examId || '',
      subjectId || '',
      topic,
      isAiGenerated
    );

    // Add cards if provided
    if (cards.length > 0) {
      await addFlashcardsToDeck(deck.id, cards);
    }

    return NextResponse.json({
      success: true,
      deck,
      message: `Deck created with ${cards.length} cards`,
    });
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    );
  }
}
