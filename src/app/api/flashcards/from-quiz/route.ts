import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

/**
 * POST /api/flashcards/from-quiz
 * Create flashcard deck from quiz mistakes
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, includeAll = false } = body; // includeAll = include correct answers too

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Get quiz session info
      const session = await client.query(
        `SELECT id, exam_id, subject_id, topic, total_questions, correct_answers
         FROM quiz_sessions
         WHERE id = $1 AND user_id = $2`,
        [sessionId, parseInt(userId)]
      );

      if (session.rows.length === 0) {
        return NextResponse.json({ error: 'Quiz session not found' }, { status: 404 });
      }

      const sessionData = session.rows[0];

      // Get question attempts (wrong answers or all if includeAll)
      const attemptsQuery = includeAll
        ? `SELECT * FROM question_attempts WHERE session_id = $1 ORDER BY id`
        : `SELECT * FROM question_attempts WHERE session_id = $1 AND is_correct = false ORDER BY id`;

      const attempts = await client.query(attemptsQuery, [sessionId]);

      if (attempts.rows.length === 0) {
        return NextResponse.json(
          { error: 'No questions found for flashcard creation' },
          { status: 400 }
        );
      }

      // Create deck
      const shareSlug = nanoid();
      const deckTitle = includeAll
        ? `${sessionData.topic} - Complete Review`
        : `${sessionData.topic} - Mistake Review`;

      const deckDescription = includeAll
        ? `All ${attempts.rows.length} questions from your quiz on ${new Date().toLocaleDateString()}`
        : `${attempts.rows.length} questions you got wrong on ${new Date().toLocaleDateString()}. Review to master these concepts!`;

      const deckResult = await client.query(
        `INSERT INTO flashcard_decks (
          user_id, title, description, exam_id, subject_id, topic,
          is_ai_generated, is_public, source_type, source_quiz_session_id,
          created_from_mistakes, share_slug, card_count
        )
        VALUES ($1, $2, $3, $4, $5, $6, false, true, 'quiz_mistakes', $7, true, $8, $9)
        RETURNING *`,
        [
          parseInt(userId),
          deckTitle,
          deckDescription,
          sessionData.exam_id,
          sessionData.subject_id,
          sessionData.topic,
          sessionId,
          shareSlug,
          attempts.rows.length,
        ]
      );

      const deck = deckResult.rows[0];

      // Create flashcards from questions
      const cards = attempts.rows.map((attempt: any, index: number) => {
        // Parse options if stored as JSON string
        let options = attempt.options;
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            options = [];
          }
        }

        // Format options for better readability
        const optionsText = Array.isArray(options)
          ? options.map((opt: any, i: number) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              const text = typeof opt === 'string' ? opt : opt.text || opt;
              return `${letter}. ${text}`;
            }).join('\n')
          : '';

        // Front: Question + Options
        const front = `${attempt.question_text}\n\n${optionsText}`;

        // Back: Correct Answer + Explanation + User's Wrong Answer
        let back = `✅ Correct Answer: ${attempt.correct_answer}`;

        if (!attempt.is_correct) {
          back += `\n\n❌ Your Answer: ${attempt.user_answer || 'Not answered'}`;
        }

        if (attempt.explanation) {
          back += `\n\n💡 Explanation:\n${attempt.explanation}`;
        }

        return {
          deckId: deck.id,
          front,
          back,
          position: index + 1,
        };
      });

      // Insert all cards
      for (const card of cards) {
        await client.query(
          `INSERT INTO flashcard_cards (deck_id, front, back, position)
           VALUES ($1, $2, $3, $4)`,
          [card.deckId, card.front, card.back, card.position]
        );
      }

      // Update badge stats (decks_created)
      await client.query(
        `INSERT INTO badge_stats (user_id, decks_created)
         VALUES ($1, 1)
         ON CONFLICT (user_id)
         DO UPDATE SET decks_created = badge_stats.decks_created + 1`,
        [parseInt(userId)]
      );

      console.log(`✅ Created flashcard deck from quiz session ${sessionId}: ${cards.length} cards`);

      return NextResponse.json({
        success: true,
        deck: {
          id: deck.id,
          title: deck.title,
          description: deck.description,
          cardCount: cards.length,
          sourceType: 'quiz_mistakes',
          sessionId: sessionId,
          shareSlug: shareSlug,
        },
        message: `Created deck with ${cards.length} flashcards from your quiz`,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating flashcards from quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    );
  }
}
