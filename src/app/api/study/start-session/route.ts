import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { startReadingSession } from '@/lib/db';

/**
 * POST /api/study/start-session
 * Start tracking reading time for study material
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subjectId, topicId, pathId } = await req.json();

    if (!subjectId || !topicId) {
      return NextResponse.json(
        { error: 'subjectId and topicId are required' },
        { status: 400 }
      );
    }

    const sessionId = await startReadingSession(userId, subjectId, topicId, pathId);

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('❌ Error starting reading session:', error);
    return NextResponse.json(
      { error: 'Failed to start reading session' },
      { status: 500 }
    );
  }
}
