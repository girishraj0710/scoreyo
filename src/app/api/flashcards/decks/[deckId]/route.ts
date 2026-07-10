import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFlashcardDeck, deleteFlashcardDeck } from '@/lib/db';

/**
 * GET /api/flashcards/decks/[deckId]
 * Get specific deck with all cards and progress
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deckId = parseInt(params.deckId);
    const deck = await getFlashcardDeck(deckId, parseInt(userId));

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Error fetching flashcard deck:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deck' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/flashcards/decks/[deckId]
 * Delete a flashcard deck
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deckId = parseInt(params.deckId);
    const success = await deleteFlashcardDeck(deckId, parseInt(userId));

    if (!success) {
      return NextResponse.json(
        { error: 'Deck not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Deck deleted' });
  } catch (error) {
    console.error('Error deleting flashcard deck:', error);
    return NextResponse.json(
      { error: 'Failed to delete deck' },
      { status: 500 }
    );
  }
}
