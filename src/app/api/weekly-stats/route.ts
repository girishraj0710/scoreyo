import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool, getWeeklyStudyTimeDetailed } from '@/lib/db';

/**
 * GET /api/weekly-stats
 * Get weekly study time statistics
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's weekly goal (default: 8 hours)
    const pool = getPool();
    const client = await pool.connect();

    try {
      const userGoal = await client.query(
        'SELECT weekly_goal_hours FROM users WHERE id = $1',
        [userId]
      );
      const weeklyGoal = userGoal.rows[0]?.weekly_goal_hours || 8;

      // Get detailed study time (actual tracked time from all sources)
      const thisWeekData = await getWeeklyStudyTimeDetailed(userId, 0);
      const lastWeekData = await getWeeklyStudyTimeDetailed(userId, 1);

      const hoursThisWeek = thisWeekData.totalHours;
      const hoursLastWeek = lastWeekData.totalHours;
      const difference = hoursThisWeek - hoursLastWeek;
      const percentage = Math.min(Math.round((hoursThisWeek / weeklyGoal) * 100), 100);

      return NextResponse.json({
        // Summary
        hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
        weeklyGoal,
        hoursLastWeek: Math.round(hoursLastWeek * 10) / 10,
        difference: Math.round(difference * 10) / 10,
        percentage,
        isGoalReached: hoursThisWeek >= weeklyGoal,

        // Breakdown by activity type
        breakdown: {
          thisWeek: {
            quiz: Math.round(thisWeekData.quizHours * 10) / 10,
            flashcard: Math.round(thisWeekData.flashcardHours * 10) / 10,
            reading: Math.round(thisWeekData.readingHours * 10) / 10
          },
          lastWeek: {
            quiz: Math.round(lastWeekData.quizHours * 10) / 10,
            flashcard: Math.round(lastWeekData.flashcardHours * 10) / 10,
            reading: Math.round(lastWeekData.readingHours * 10) / 10
          }
        },

        // Session counts
        sessions: {
          thisWeek: thisWeekData.sessionCounts,
          lastWeek: lastWeekData.sessionCounts
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching weekly stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly stats' },
      { status: 500 }
    );
  }
}
