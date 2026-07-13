import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { endQuizSession } from '@/lib/db';

/**
 * POST /api/quiz/end-session
 * End quiz session and calculate duration
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, totalQuestions, correctAnswers, accuracy } = await req.json();

    if (!sessionId || totalQuestions === undefined) {
      return NextResponse.json(
        { error: 'sessionId and totalQuestions are required' },
        { status: 400 }
      );
    }

    await endQuizSession(sessionId, totalQuestions, correctAnswers, accuracy);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error ending quiz session:', error);
    return NextResponse.json(
      { error: 'Failed to end quiz session' },
      { status: 500 }
    );
  }
}
