import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getContinueLearning } from '@/lib/db';

/**
 * GET /api/continue-learning
 * Get the user's last incomplete learning activity to resume
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const continueData = await getContinueLearning(userId);

    if (!continueData) {
      return NextResponse.json({ continue: null });
    }

    return NextResponse.json({ continue: continueData });
  } catch (error) {
    console.error('❌ Error fetching continue learning:', error);
    return NextResponse.json(
      { error: 'Failed to fetch continue learning data' },
      { status: 500 }
    );
  }
}
