import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db';

/**
 * POST /api/flashcards/rate/[deckId]
 * Submit or update rating/review for a deck
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);

    const body = await req.json();
    const { rating, reviewText } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate review text (optional, max 500 chars)
    if (reviewText && reviewText.length > 500) {
      return NextResponse.json(
        { error: 'Review text must be under 500 characters' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Check if deck exists
      const deck = await client.query(
        'SELECT id, user_id FROM flashcard_decks WHERE id = $1',
        [deckId]
      );

      if (deck.rows.length === 0) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      // Can't rate your own deck
      if (deck.rows[0].user_id === userId) {
        return NextResponse.json(
          { error: 'Cannot rate your own deck' },
          { status: 400 }
        );
      }

      // Insert or update rating
      await client.query(
        `INSERT INTO flashcard_deck_ratings (deck_id, user_id, rating, review_text)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (deck_id, user_id)
         DO UPDATE SET
           rating = $3,
           review_text = $4,
           updated_at = NOW()`,
        [deckId, userId, rating, reviewText || null]
      );

      // Recalculate average rating
      const avgResult = await client.query(
        `SELECT
          AVG(rating)::DECIMAL(3,2) as avg_rating,
          COUNT(*) as rating_count
        FROM flashcard_deck_ratings
        WHERE deck_id = $1`,
        [deckId]
      );

      const { avg_rating, rating_count } = avgResult.rows[0];

      // Update deck with new average
      await client.query(
        `UPDATE flashcard_decks
         SET
           average_rating = $1,
           rating_count = $2
         WHERE id = $3`,
        [parseFloat(avg_rating), parseInt(rating_count), deckId]
      );

      return NextResponse.json({
        success: true,
        rating: {
          userRating: rating,
          averageRating: parseFloat(avg_rating),
          ratingCount: parseInt(rating_count),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/flashcards/rate/[deckId]
 * Get user's rating for a deck
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    console.log('🔍 [GET RATING] Checking if user rated deck');
    console.log('   User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);
    console.log('   Deck ID:', deckId);

    const pool = getPool();
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT rating, review_text, created_at, updated_at
         FROM flashcard_deck_ratings
         WHERE deck_id = $1 AND user_id = $2`,
        [deckId, userId]
      );

      console.log('   Query result:', result.rows.length, 'rows');
      if (result.rows.length > 0) {
        console.log('   ✅ User has rated:', result.rows[0].rating, 'stars');
      } else {
        console.log('   ❌ User has not rated this deck');
      }

      if (result.rows.length === 0) {
        return NextResponse.json({ hasRated: false });
      }

      return NextResponse.json({
        hasRated: true,
        rating: result.rows[0].rating,
        reviewText: result.rows[0].review_text,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching user rating:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}
