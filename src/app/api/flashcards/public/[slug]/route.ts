import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

/**
 * GET /api/flashcards/public/[slug]
 * Get public deck by share slug (no auth required)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Get deck with creator info
      const result = await client.query(
        `SELECT
          fd.*,
          u.name as creator_name,
          u.username as creator_username,
          COUNT(DISTINCT fc.id) as total_cards
        FROM flashcard_decks fd
        LEFT JOIN users u ON fd.user_id = u.id
        LEFT JOIN flashcard_cards fc ON fd.id = fc.deck_id
        WHERE fd.share_slug = $1 AND fd.is_public = true
        GROUP BY fd.id, u.name, u.username`,
        [slug]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      const deck = result.rows[0];

      // Increment view count
      await client.query(
        `UPDATE flashcard_decks
         SET view_count = view_count + 1
         WHERE id = $1`,
        [deck.id]
      );

      // Get first 5 cards as preview
      const cardsResult = await client.query(
        `SELECT id, front, back
         FROM flashcard_cards
         WHERE deck_id = $1
         ORDER BY position
         LIMIT 5`,
        [deck.id]
      );

      return NextResponse.json({
        deck: {
          id: deck.id,
          title: deck.title,
          description: deck.description,
          exam: deck.exam_id,
          subject: deck.subject_id,
          topic: deck.topic,
          totalCards: parseInt(deck.total_cards),
          creator: {
            name: deck.creator_name || 'Anonymous',
            username: deck.creator_username || `user${deck.user_id}`,
          },
          analytics: {
            studiesToday: deck.studies_today || 0,
            uniqueStudents: deck.unique_students || 0,
            totalStudies: deck.total_studies || 0,
            shareCount: deck.share_count || 0,
            viewCount: deck.view_count + 1, // Include this view
          },
          rating: {
            average: parseFloat(deck.average_rating) || 0,
            count: deck.rating_count || 0,
          },
          cardPreview: cardsResult.rows.map(c => ({
            id: c.id,
            front: c.front,
            back: c.back,
          })),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching public deck:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deck' },
      { status: 500 }
    );
  }
}
