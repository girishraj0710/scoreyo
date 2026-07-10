import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFlashcardDeck, deleteFlashcardDeck } from '@/lib/db';

/**
 * GET /api/flashcards/decks/[deckId]
 * Get specific deck with all cards and progress
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    console.log('🎯 [GET DECK] Request received');

    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;
    console.log('👤 User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);
    console.log('🎴 Deck ID:', deckId);

    console.log('📥 Fetching deck from database...');
    const deck = await getFlashcardDeck(deckId, parseInt(userId));

    if (!deck) {
      console.log('❌ Deck not found');
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    console.log('✅ Deck fetched:', deck.title, 'with', deck.cards?.length || 0, 'cards');
    return NextResponse.json({ deck });
  } catch (error) {
    console.error('❌ Error fetching flashcard deck:', error);
    if (error instanceof Error) {
      console.error('💥 Error message:', error.message);
      console.error('📍 Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch deck', details: error instanceof Error ? error.message : 'Unknown error' },
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
