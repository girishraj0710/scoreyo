import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { startQuizSession } from '@/lib/db';

/**
 * POST /api/quiz/start-session
 * Start a new quiz session with timestamp
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('scoreyo-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { examId, subjectId } = await req.json();

    if (!examId || !subjectId) {
      return NextResponse.json(
        { error: 'examId and subjectId are required' },
        { status: 400 }
      );
    }

    const sessionId = await startQuizSession(userId, examId, subjectId);

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('❌ Error starting quiz session:', error);
    return NextResponse.json(
      { error: 'Failed to start quiz session' },
      { status: 500 }
    );
  }
}
