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

    const rawDecks = await getFlashcardDecks(parseInt(userId));

    // Transform database format to UI format
    const decks = rawDecks.map((deck: any) => ({
      id: deck.id,
      exam: deck.exam_id || 'General',
      examColor: getExamColor(deck.exam_id),
      subject: deck.subject_id || 'General',
      topic: deck.topic,
      cards: deck.card_count || 0,
      mastered: deck.mastered_count || 0,
      due: deck.due_count || 0,
      title: deck.title,
      description: deck.description,
      isAiGenerated: deck.is_ai_generated,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
    }));

    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

// Helper function to get exam color (handles both IDs and names)
function getExamColor(examIdOrName: string): string {
  const examKey = examIdOrName?.toLowerCase() || '';

  const colors: { [key: string]: string } = {
    // By ID
    'upsc': '#E76F51',
    'jee': '#2A9D8F',
    'neet': '#E9C46A',
    'ssc': '#F4A261',
    'banking': '#264653',
    'cat': '#9B59B6',
    'gate': '#3498DB',
    'kcet': '#F4A261',
    'keam': '#2A9D8F',
    'mht-cet': '#E76F51',

    // By Name (fallback)
    'karnataka cet': '#F4A261',
    'kerala cet': '#2A9D8F',
    'physics': '#2A9D8F',
    'chemistry': '#E9C46A',
    'biology': '#E76F51',
  };

  return colors[examKey] || '#6B7280';
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
