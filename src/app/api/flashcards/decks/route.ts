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

    console.log('📥 Fetching community decks for user:', userId);

    // Get user's preferred exam
    const { getPool } = await import('@/lib/db');
    const pool = getPool();
    const client = await pool.connect();

    try {
      // Get user info
      const userResult = await client.query(
        `SELECT preferred_exam, name, username FROM users WHERE id = $1`,
        [userId]
      );
      const user = userResult.rows[0];
      const preferredExam = user?.preferred_exam;

      console.log('👤 User exam preference:', preferredExam || 'not set');

      // Fetch user's decks + community decks (same exam)
      const result = await client.query(`
        SELECT
          fd.*,
          u.name as creator_name,
          u.username as creator_username,
          u.id as creator_id,
          CASE WHEN fd.user_id = $1 THEN true ELSE false END as is_mine,
          COUNT(DISTINCT fp.id) FILTER (WHERE fp.times_correct > 0) as mastered_count,
          COUNT(DISTINCT fp.id) FILTER (WHERE fp.next_review <= NOW()) as due_count
        FROM flashcard_decks fd
        LEFT JOIN users u ON fd.user_id = u.id
        LEFT JOIN flashcard_progress fp ON fd.id = fp.deck_id AND fp.user_id = $1
        WHERE
          fd.user_id = $1  -- My decks
          OR (
            fd.is_public = true
            AND ($2::text IS NULL OR fd.exam_id = $2)  -- Same exam or no preference
          )
        GROUP BY fd.id, u.name, u.username, u.id
        ORDER BY
          is_mine DESC,  -- My decks first
          fd.studies_today DESC,  -- Then by popularity
          fd.updated_at DESC
      `, [userId, preferredExam]);

      console.log(`✅ Found ${result.rows.length} decks (user + community)`);

      // Transform to UI format
      const decks = result.rows.map((deck: any) => ({
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
        isMine: deck.is_mine,
        sourceType: deck.source_type || 'manual',
        sourceQuizSessionId: deck.source_quiz_session_id,
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
        // Community fields
        creator: {
          id: deck.creator_id,
          name: deck.creator_name || 'Anonymous',
          username: deck.creator_username || `user${deck.creator_id}`,
        },
        analytics: {
          studiesToday: deck.studies_today || 0,
          uniqueStudents: deck.unique_students || 0,
          totalStudies: deck.total_studies || 0,
          lastStudiedAt: deck.last_studied_at,
        },
        averageRating: parseFloat(deck.average_rating) || 0,
        ratingCount: deck.rating_count || 0,
      }));

      return NextResponse.json({ decks });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching flashcard decks:', error);
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
      userId,
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
