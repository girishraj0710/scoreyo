import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/flashcards/reviews/[deckId]
 * Get all reviews for a deck (public, no auth required)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const resolvedParams = await params;
    const deckId = parseInt(resolvedParams.deckId);

    const pool = getPool();
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT
          r.rating,
          r.review_text,
          r.created_at,
          r.updated_at,
          u.name as reviewer_name,
          u.username as reviewer_username
        FROM flashcard_deck_ratings r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.deck_id = $1 AND r.review_text IS NOT NULL
        ORDER BY r.created_at DESC
        LIMIT 50`,
        [deckId]
      );

      const reviews = result.rows.map(r => ({
        rating: r.rating,
        reviewText: r.review_text,
        reviewer: {
          name: r.reviewer_name || 'Anonymous',
          username: r.reviewer_username || 'user',
        },
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));

      // Get rating distribution
      const distribution = await client.query(
        `SELECT
          rating,
          COUNT(*) as count
        FROM flashcard_deck_ratings
        WHERE deck_id = $1
        GROUP BY rating
        ORDER BY rating DESC`,
        [deckId]
      );

      const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      distribution.rows.forEach(row => {
        ratingDistribution[row.rating as keyof typeof ratingDistribution] = parseInt(row.count);
      });

      return NextResponse.json({
        reviews,
        distribution: ratingDistribution,
        totalReviews: reviews.length,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
