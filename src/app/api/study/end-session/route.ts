import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { endReadingSession } from '@/lib/db';

/**
 * POST /api/study/end-session
 * End reading session and record completion
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, sectionsRead, completionPercentage } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    await endReadingSession(
      sessionId,
      sectionsRead || 0,
      completionPercentage || 0
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error ending reading session:', error);
    return NextResponse.json(
      { error: 'Failed to end reading session' },
      { status: 500 }
    );
  }
}
