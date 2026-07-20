import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db';

/**
 * POST /api/flashcards/share/[deckId]
 * Increment share count and return shareable link
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

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Verify deck ownership
      const deck = await client.query(
        `SELECT id, user_id, title, share_slug, share_count
         FROM flashcard_decks
         WHERE id = $1`,
        [deckId]
      );

      if (deck.rows.length === 0) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      const deckData = deck.rows[0];

      if (deckData.user_id !== parseInt(userId)) {
        return NextResponse.json({ error: 'Not your deck' }, { status: 403 });
      }

      // Increment share count
      await client.query(
        `UPDATE flashcard_decks
         SET share_count = share_count + 1
         WHERE id = $1`,
        [deckId]
      );

      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://scoreyo.in'}/deck/${deckData.share_slug}`;

      return NextResponse.json({
        success: true,
        shareUrl,
        shareSlug: deckData.share_slug,
        shareCount: deckData.share_count + 1,
        title: deckData.title,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error sharing deck:', error);
    return NextResponse.json(
      { error: 'Failed to share deck' },
      { status: 500 }
    );
  }
}
