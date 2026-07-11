import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPool } from '@/lib/db';

/**
 * GET /api/daily-questions
 * Get today's 10 questions for the user
 *
 * Logic:
 * - New users: Random questions from their preferred exam
 * - Returning users: Questions based on weak topics + past performance
 * - Resets daily at midnight IST
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Get today's date in IST (YYYY-MM-DD format)
      const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

      // Check if user has today's questions already
      const existingBlock = await client.query(
        `SELECT * FROM daily_question_blocks
         WHERE user_id = $1 AND date = $2`,
        [userId, todayIST]
      );

      if (existingBlock.rows.length > 0) {
        // Return existing block
        const block = existingBlock.rows[0];
        return NextResponse.json({
          date: block.date,
          questions: block.questions,
          completed: block.completed,
          score: block.score,
          attempted_at: block.attempted_at,
        });
      }

      // Generate new block for today
      const user = await client.query(
        `SELECT preferred_exam, email FROM users WHERE id = $1`,
        [userId]
      );

      if (user.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const preferredExam = user.rows[0].preferred_exam;

      // Check if user is new (no quiz history)
      const historyCheck = await client.query(
        `SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = $1`,
        [userId]
      );

      const isNewUser = parseInt(historyCheck.rows[0].count) === 0;

      let questions = [];

      if (isNewUser) {
        // NEW USER: Get 10 random questions from fact_exam_questions
        console.log(`🆕 New user ${userId} - generating random questions`);

        const randomQuestions = await client.query(
          `SELECT feq.id, feq.question, feq.options, feq.correct_answer, feq.explanation,
                  de.exam_id, ds.subject_id, dt.topic_name as topic, feq.difficulty
           FROM fact_exam_questions feq
           LEFT JOIN dim_topics dt ON feq.topic_id = dt.id
           LEFT JOIN dim_subjects ds ON dt.subject_id = ds.id
           LEFT JOIN dim_exams de ON ds.exam_id = de.id
           ORDER BY RANDOM()
           LIMIT 10`
        );

        questions = randomQuestions.rows.map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || 'No explanation provided',
          exam_id: q.exam_id || preferredExam || 'general',
          subject_id: q.subject_id || 'general',
          topic: q.topic || 'General Knowledge',
          difficulty: q.difficulty || 'medium'
        }));
      } else {
        // RETURNING USER: Intelligent question selection
        console.log(`🎯 Returning user ${userId} - generating personalized questions`);

        // For now, use random questions from fact_exam_questions
        // TODO: Implement intelligent selection based on weak topics
        const randomQuestions = await client.query(
          `SELECT feq.id, feq.question, feq.options, feq.correct_answer, feq.explanation,
                  de.exam_id, ds.subject_id, dt.topic_name as topic, feq.difficulty
           FROM fact_exam_questions feq
           LEFT JOIN dim_topics dt ON feq.topic_id = dt.id
           LEFT JOIN dim_subjects ds ON dt.subject_id = ds.id
           LEFT JOIN dim_exams de ON ds.exam_id = de.id
           ORDER BY RANDOM()
           LIMIT 10`
        );

        questions = randomQuestions.rows.map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || 'No explanation provided',
          exam_id: q.exam_id || preferredExam || 'general',
          subject_id: q.subject_id || 'general',
          topic: q.topic || 'General Knowledge',
          difficulty: q.difficulty || 'medium'
        }));
      }

      // Ensure we have exactly 10 questions
      questions = questions.slice(0, 10);

      if (questions.length < 10) {
        return NextResponse.json(
          { error: 'Not enough questions available for your exam' },
          { status: 400 }
        );
      }

      // Save to daily_question_blocks table
      await client.query(
        `INSERT INTO daily_question_blocks (user_id, date, questions, completed, score)
         VALUES ($1, $2, $3, false, 0)`,
        [userId, todayIST, JSON.stringify(questions)]
      );

      console.log(`✅ Generated ${questions.length} daily questions for user ${userId}`);

      return NextResponse.json({
        date: todayIST,
        questions: questions,
        completed: false,
        score: 0,
        attempted_at: null,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching daily questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/daily-questions
 * Submit answers for today's daily questions
 *
 * Body: { answers: [0, 2, 1, ...] } - array of 10 answer indices
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid answers format - must be array of 10 indices' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

      // Get today's block
      const blockResult = await client.query(
        `SELECT * FROM daily_question_blocks
         WHERE user_id = $1 AND date = $2`,
        [userId, todayIST]
      );

      if (blockResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'No daily questions found for today' },
          { status: 404 }
        );
      }

      const block = blockResult.rows[0];

      if (block.completed) {
        return NextResponse.json(
          { error: 'Daily questions already completed' },
          { status: 400 }
        );
      }

      const questions = block.questions;

      // Calculate score
      let correctCount = 0;
      const results = questions.map((q: any, index: number) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === q.correct_answer;
        if (isCorrect) correctCount++;

        return {
          questionId: q.id,
          userAnswer,
          correctAnswer: q.correct_answer,
          isCorrect,
          explanation: q.explanation,
        };
      });

      // Update block
      await client.query(
        `UPDATE daily_question_blocks
         SET completed = true,
             score = $1,
             attempted_at = NOW(),
             user_answers = $2
         WHERE user_id = $3 AND date = $4`,
        [correctCount, JSON.stringify(answers), userId, todayIST]
      );

      console.log(`✅ User ${userId} completed daily questions: ${correctCount}/10 correct`);

      return NextResponse.json({
        completed: true,
        score: correctCount,
        total: 10,
        results,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error submitting daily questions:', error);
    return NextResponse.json(
      { error: 'Failed to submit answers' },
      { status: 500 }
    );
  }
}
