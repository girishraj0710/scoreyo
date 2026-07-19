import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRecentActivities } from '@/lib/db';

/**
 * GET /api/recent-activities
 * Get top 3 recent learning activities (any type) for the logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activities = await getRecentActivities(userId);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    );
  }
}
