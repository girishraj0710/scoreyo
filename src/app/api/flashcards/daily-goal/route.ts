import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db';

/**
 * GET /api/flashcards/daily-goal
 * Get today's flashcard goal and progress
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Get or create today's goal
      let goal = await client.query(
        `SELECT * FROM flashcard_daily_goals WHERE user_id = $1 AND date = $2`,
        [parseInt(userId), today]
      );

      if (goal.rows.length === 0) {
        // Create default goal for today
        const newGoal = await client.query(
          `INSERT INTO flashcard_daily_goals (user_id, date, target_cards, cards_studied, goal_reached)
           VALUES ($1, $2, 20, 0, false)
           RETURNING *`,
          [parseInt(userId), today]
        );
        goal = newGoal;
      }

      const goalData = goal.rows[0];

      // Get total due cards
      const dueCards = await client.query(
        `SELECT COUNT(*) as count
         FROM flashcard_progress
         WHERE user_id = $1 AND next_review <= NOW()`,
        [parseInt(userId)]
      );

      return NextResponse.json({
        goal: {
          date: goalData.date,
          target: goalData.target_cards,
          studied: goalData.cards_studied,
          goalReached: goalData.goal_reached,
          progress: Math.min(100, Math.round((goalData.cards_studied / goalData.target_cards) * 100)),
          dueCards: parseInt(dueCards.rows[0].count),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching daily goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily goal' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/flashcards/daily-goal
 * Update daily goal progress (called after studying cards)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cardsStudied } = body; // Number of cards just studied

    if (!cardsStudied || cardsStudied < 1) {
      return NextResponse.json(
        { error: 'Invalid cards_studied count' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const today = new Date().toISOString().split('T')[0];

      // Get or create today's goal
      let goal = await client.query(
        `SELECT * FROM flashcard_daily_goals WHERE user_id = $1 AND date = $2`,
        [parseInt(userId), today]
      );

      if (goal.rows.length === 0) {
        // Create goal with current progress
        goal = await client.query(
          `INSERT INTO flashcard_daily_goals (user_id, date, target_cards, cards_studied, goal_reached)
           VALUES ($1, $2, 20, $3, false)
           RETURNING *`,
          [parseInt(userId), today, cardsStudied]
        );
      } else {
        // Update progress
        goal = await client.query(
          `UPDATE flashcard_daily_goals
           SET
             cards_studied = cards_studied + $1,
             goal_reached = (cards_studied + $1) >= target_cards,
             updated_at = NOW()
           WHERE user_id = $2 AND date = $3
           RETURNING *`,
          [cardsStudied, parseInt(userId), today]
        );
      }

      const goalData = goal.rows[0];
      const justReached = goalData.goal_reached && (goalData.cards_studied - cardsStudied < goalData.target_cards);

      return NextResponse.json({
        success: true,
        goal: {
          date: goalData.date,
          target: goalData.target_cards,
          studied: goalData.cards_studied,
          goalReached: goalData.goal_reached,
          progress: Math.min(100, Math.round((goalData.cards_studied / goalData.target_cards) * 100)),
          justReached, // Show celebration if goal just reached
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating daily goal:', error);
    return NextResponse.json(
      { error: 'Failed to update daily goal' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/flashcards/daily-goal
 * Update daily goal target (user customization)
 */
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { targetCards } = body;

    if (!targetCards || targetCards < 5 || targetCards > 100) {
      return NextResponse.json(
        { error: 'Target must be between 5 and 100 cards' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const today = new Date().toISOString().split('T')[0];

      // Update or insert today's goal with new target
      const result = await client.query(
        `INSERT INTO flashcard_daily_goals (user_id, date, target_cards, cards_studied, goal_reached)
         VALUES ($1, $2, $3, 0, false)
         ON CONFLICT (user_id, date)
         DO UPDATE SET
           target_cards = $3,
           goal_reached = flashcard_daily_goals.cards_studied >= $3,
           updated_at = NOW()
         RETURNING *`,
        [parseInt(userId), today, targetCards]
      );

      const goalData = result.rows[0];

      return NextResponse.json({
        success: true,
        goal: {
          date: goalData.date,
          target: goalData.target_cards,
          studied: goalData.cards_studied,
          goalReached: goalData.goal_reached,
          progress: Math.min(100, Math.round((goalData.cards_studied / goalData.target_cards) * 100)),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating daily goal target:', error);
    return NextResponse.json(
      { error: 'Failed to update goal target' },
      { status: 500 }
    );
  }
}
