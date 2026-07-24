/**
 * Admin: Bulk Question Generation
 * Generates questions directly. Admin-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/quiz-generator';
import { saveVerifiedQuestions } from '@/lib/db';
import { getExamById, getSubjectById } from '@/lib/exams';
import { requireAdmin } from '@/lib/admin-guard';

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const { examId, subjectId, topic, numberOfQuestions = 10, difficulty = 'mixed' } = await request.json();

    // Get exam and subject info
    const exam = getExamById(examId);
    const subject = getSubjectById(examId, subjectId);

    if (!exam || !subject) {
      return NextResponse.json({ error: 'Invalid exam or subject' }, { status: 400 });
    }

    console.log(`[Bulk Gen] ${exam.name} - ${subject.name} - ${topic} (${numberOfQuestions} questions)`);

    // Generate questions
    const questions = await generateQuiz(
      exam.name,
      subject.name,
      topic,
      numberOfQuestions,
      difficulty as any
    );

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions generated' }, { status: 500 });
    }

    // Filter out service unavailable messages
    const validQuestions = questions.filter(
      q => !q.question.includes('[Service Unavailable]')
    );

    if (validQuestions.length === 0) {
      return NextResponse.json({ error: 'All questions were invalid' }, { status: 500 });
    }

    // Save to database
    await saveVerifiedQuestions(examId, subjectId, topic, validQuestions);

    console.log(`[Bulk Gen] ✅ Saved ${validQuestions.length} questions`);

    return NextResponse.json({
      success: true,
      generated: validQuestions.length,
      exam: exam.name,
      subject: subject.name,
      topic,
    });
  } catch (error) {
    console.error('[Bulk Gen] Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
