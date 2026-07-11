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
        // NEW USER: Get 10 random questions from their preferred exam
        console.log(`🆕 New user ${userId} - generating random questions for ${preferredExam}`);

        const randomQuestions = await client.query(
          `SELECT id, question, options, correct_answer, explanation,
                  exam_id, subject_id, topic, difficulty
           FROM questions
           WHERE exam_id = $1
             AND is_verified = true
           ORDER BY RANDOM()
           LIMIT 10`,
          [preferredExam]
        );

        questions = randomQuestions.rows;
      } else {
        // RETURNING USER: Intelligent question selection
        console.log(`🎯 Returning user ${userId} - generating personalized questions`);

        // 1. Get weak topics (mastery < 70%)
        const weakTopics = await client.query(
          `SELECT DISTINCT m.subject_id, m.topic
           FROM (
             SELECT
               subject_id,
               topic,
               CASE
                 WHEN SUM(total_attempted) > 0
                 THEN (SUM(total_correct)::float / SUM(total_attempted)) * 100
                 ELSE 0
               END as mastery_score
             FROM quiz_sessions
             WHERE user_id = $1
             GROUP BY subject_id, topic
           ) m
           WHERE m.mastery_score < 70
           ORDER BY m.mastery_score ASC
           LIMIT 5`,
          [userId]
        );

        // 2. Get mistake patterns
        const mistakeTypes = await client.query(
          `SELECT mistake_type, COUNT(*) as count
           FROM mistake_patterns
           WHERE user_id = $1
             AND created_at >= NOW() - INTERVAL '30 days'
           GROUP BY mistake_type
           ORDER BY count DESC
           LIMIT 1`,
          [userId]
        );

        const primaryMistakeType = mistakeTypes.rows[0]?.mistake_type || 'concept';

        // 3. Build personalized question query
        // Priority: 60% weak topics, 30% recent exam topics, 10% new topics

        // Get 6 questions from weak topics
        let weakTopicQuestions: any[] = [];
        if (weakTopics.rows.length > 0) {
          const weakTopicConditions = weakTopics.rows
            .map(t => `(subject_id = '${t.subject_id}' AND topic = '${t.topic.replace(/'/g, "''")}')`)
            .join(' OR ');

          const weakResult = await client.query(
            `SELECT id, question, options, correct_answer, explanation,
                    exam_id, subject_id, topic, difficulty
             FROM questions
             WHERE exam_id = $1
               AND is_verified = true
               AND (${weakTopicConditions})
             ORDER BY RANDOM()
             LIMIT 6`,
            [preferredExam]
          );
          weakTopicQuestions = weakResult.rows;
        }

        // Get 3 questions from recently studied topics
        const recentQuestions = await client.query(
          `SELECT DISTINCT q.id, q.question, q.options, q.correct_answer, q.explanation,
                  q.exam_id, q.subject_id, q.topic, q.difficulty
           FROM questions q
           INNER JOIN quiz_sessions qs ON q.subject_id = qs.subject_id
           WHERE qs.user_id = $1
             AND q.exam_id = $2
             AND q.is_verified = true
             AND q.id NOT IN (${weakTopicQuestions.map(wq => wq.id).join(',') || '0'})
             AND qs.created_at >= NOW() - INTERVAL '7 days'
           ORDER BY RANDOM()
           LIMIT 3`,
          [userId, preferredExam]
        );

        // Get 1 question from unexplored topics
        const newTopicQuestions = await client.query(
          `SELECT id, question, options, correct_answer, explanation,
                  exam_id, subject_id, topic, difficulty
           FROM questions
           WHERE exam_id = $1
             AND is_verified = true
             AND id NOT IN (${[...weakTopicQuestions, ...recentQuestions.rows].map(q => q.id).join(',') || '0'})
             AND topic NOT IN (
               SELECT DISTINCT topic FROM quiz_sessions WHERE user_id = $2
             )
           ORDER BY RANDOM()
           LIMIT 1`,
          [preferredExam, userId]
        );

        // Combine all questions
        questions = [
          ...weakTopicQuestions,
          ...recentQuestions.rows,
          ...newTopicQuestions.rows,
        ];

        // If we don't have 10 questions yet, fill with random questions
        if (questions.length < 10) {
          const remainingCount = 10 - questions.length;
          const excludeIds = questions.map(q => q.id).join(',') || '0';

          const fillQuestions = await client.query(
            `SELECT id, question, options, correct_answer, explanation,
                    exam_id, subject_id, topic, difficulty
             FROM questions
             WHERE exam_id = $1
               AND is_verified = true
               AND id NOT IN (${excludeIds})
             ORDER BY RANDOM()
             LIMIT $2`,
            [preferredExam, remainingCount]
          );

          questions = [...questions, ...fillQuestions.rows];
        }
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
