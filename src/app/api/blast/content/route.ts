import { NextRequest, NextResponse } from "next/server";
import { queryAll, queryOne } from "@/lib/db";

/**
 * GET /api/blast/content
 * Intelligent content sourcing for Blast game:
 * 1. Study content topics (what user has studied)
 * 2. Flashcards (user-created content)
 * 3. Quiz history (questions with proper options)
 * 4. Fresh users: Based on preferred exam
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;

  console.log('[Blast Content API] User ID:', userId);

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const examCode = request.nextUrl.searchParams.get("examId");
    console.log('[Blast Content API] Exam Code:', examCode);

    if (!examCode) {
      return NextResponse.json({ error: "Exam ID required" }, { status: 400 });
    }

    const questions: Array<{
      id: string;
      question: string;
      answer: string;
      options: string[];
      topic: string;
      subject: string;
      source: string;
    }> = [];

    // STEP 1: Get questions from quiz history (with proper options)
    console.log('[Blast Content API] Step 1: Getting quiz history questions...');
    try {
      const quizQuestions = await queryAll(
        `SELECT DISTINCT ON (qq.question_text)
          qq.id,
          qq.question_text as question,
          qq.correct_answer as answer,
          qq.option_a,
          qq.option_b,
          qq.option_c,
          qq.option_d,
          qq.topic_name as topic,
          qq.subject_name as subject
        FROM quiz_results qr
        JOIN quiz_questions qq ON qr.id = qq.quiz_result_id
        WHERE qr.user_id = $1
        AND qr.exam_id = $2
        AND qq.option_a IS NOT NULL
        AND qq.option_b IS NOT NULL
        AND qq.option_c IS NOT NULL
        AND qq.option_d IS NOT NULL
        AND LENGTH(qq.question_text) > 10
        AND LENGTH(qq.correct_answer) > 1
        ORDER BY qq.question_text, qr.created_at DESC
        LIMIT 20`,
        [userId, examCode]
      );

      console.log('[Blast Content API] Quiz questions found:', quizQuestions.length);

      quizQuestions.forEach((q: any) => {
        const options = [q.option_a, q.option_b, q.option_c, q.option_d]
          .filter(Boolean)
          .filter(opt => opt.trim().length > 0);

        if (options.length >= 3) {
          questions.push({
            id: `quiz_${q.id}`,
            question: q.question,
            answer: q.answer,
            options: options,
            topic: q.topic || "General",
            subject: q.subject || "General",
            source: "quiz_history",
          });
        }
      });
    } catch (err: any) {
      console.error('[Blast Content API] Quiz history error:', err.message);
    }

    // STEP 2: Get flashcards (convert to MCQ format)
    console.log('[Blast Content API] Step 2: Getting flashcards...');
    try {
      const flashcards = await queryAll(
        `SELECT
          fc.id,
          fc.front as question,
          fc.back as answer,
          fd.title as deck_title
        FROM flashcard_decks fd
        JOIN flashcards fc ON fc.deck_id = fd.id
        WHERE fd.user_id = $1
        AND fd.exam_id = $2
        AND LENGTH(fc.back) > 2 AND LENGTH(fc.back) < 100
        ORDER BY RANDOM()
        LIMIT 10`,
        [userId, examCode]
      );

      console.log('[Blast Content API] Flashcards found:', flashcards.length);

      // Generate distractors for flashcards
      for (const fc of flashcards) {
        const distractors = await generateDistractors(fc.answer, fc.question, userId, examCode);

        if (distractors.length >= 2) {
          questions.push({
            id: `flashcard_${fc.id}`,
            question: fc.question,
            answer: fc.answer,
            options: [fc.answer, ...distractors].sort(() => Math.random() - 0.5),
            topic: fc.deck_title || "General",
            subject: "General",
            source: "flashcard",
          });
        }
      }
    } catch (err: any) {
      console.error('[Blast Content API] Flashcard error:', err.message);
    }

    // STEP 3: Get questions from studied topics (for fresh users or to fill gaps)
    if (questions.length < 15) {
      console.log('[Blast Content API] Step 3: Getting questions from verified bank...');
      try {
        const bankQuestions = await queryAll(
          `SELECT
            id,
            question,
            correct_answer as answer,
            option_a,
            option_b,
            option_c,
            option_d,
            topic,
            subject,
            exam_id
          FROM question_bank
          WHERE exam_id = $1
          AND option_a IS NOT NULL
          AND option_b IS NOT NULL
          AND option_c IS NOT NULL
          AND option_d IS NOT NULL
          AND LENGTH(question) > 10
          ORDER BY RANDOM()
          LIMIT ${20 - questions.length}`,
          [examCode]
        );

        console.log('[Blast Content API] Bank questions found:', bankQuestions.length);

        bankQuestions.forEach((q: any) => {
          const options = [q.option_a, q.option_b, q.option_c, q.option_d]
            .filter(Boolean)
            .filter(opt => opt.trim().length > 0);

          if (options.length >= 3) {
            questions.push({
              id: `bank_${q.id}`,
              question: q.question,
              answer: q.answer,
              options: options,
              topic: q.topic || "General",
              subject: q.subject || "General",
              source: "question_bank",
            });
          }
        });
      } catch (err: any) {
        console.error('[Blast Content API] Bank question error:', err.message);
      }
    }

    // STEP 4: If still no questions, provide sample fallback questions for testing
    if (questions.length === 0) {
      console.log('[Blast Content API] Step 4: Using sample fallback questions...');
      const sampleQuestions = [
        {
          id: 'sample_1',
          question: 'What is the capital of India?',
          answer: 'New Delhi',
          options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
          topic: 'Geography',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_2',
          question: 'Who wrote the Indian national anthem?',
          answer: 'Rabindranath Tagore',
          options: ['Rabindranath Tagore', 'Bankim Chandra', 'Sarojini Naidu', 'Subhas Chandra Bose'],
          topic: 'History',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_3',
          question: 'What is 15 × 12?',
          answer: '180',
          options: ['160', '170', '180', '190'],
          topic: 'Arithmetic',
          subject: 'Mathematics',
          source: 'sample'
        },
        {
          id: 'sample_4',
          question: 'Which planet is known as the Red Planet?',
          answer: 'Mars',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          topic: 'Astronomy',
          subject: 'Science',
          source: 'sample'
        },
        {
          id: 'sample_5',
          question: 'What is the chemical symbol for Gold?',
          answer: 'Au',
          options: ['Go', 'Au', 'Gd', 'Ag'],
          topic: 'Chemistry',
          subject: 'Science',
          source: 'sample'
        },
        {
          id: 'sample_6',
          question: 'How many states are there in India?',
          answer: '28',
          options: ['26', '28', '29', '30'],
          topic: 'Geography',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_7',
          question: 'What is the square root of 144?',
          answer: '12',
          options: ['10', '11', '12', '13'],
          topic: 'Arithmetic',
          subject: 'Mathematics',
          source: 'sample'
        },
        {
          id: 'sample_8',
          question: 'Who is known as the Father of the Nation in India?',
          answer: 'Mahatma Gandhi',
          options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel', 'Dr. Ambedkar'],
          topic: 'History',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_9',
          question: 'What is the largest ocean on Earth?',
          answer: 'Pacific Ocean',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
          topic: 'Geography',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_10',
          question: 'What is 50% of 200?',
          answer: '100',
          options: ['90', '100', '110', '120'],
          topic: 'Arithmetic',
          subject: 'Mathematics',
          source: 'sample'
        },
        {
          id: 'sample_11',
          question: 'Which gas do plants absorb from the atmosphere?',
          answer: 'Carbon dioxide',
          options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
          topic: 'Biology',
          subject: 'Science',
          source: 'sample'
        },
        {
          id: 'sample_12',
          question: 'What is the speed of light in vacuum?',
          answer: '3 × 10⁸ m/s',
          options: ['3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁸ m/s', '3 × 10⁹ m/s'],
          topic: 'Physics',
          subject: 'Science',
          source: 'sample'
        },
        {
          id: 'sample_13',
          question: 'Who invented the telephone?',
          answer: 'Alexander Graham Bell',
          options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'],
          topic: 'Inventions',
          subject: 'General Knowledge',
          source: 'sample'
        },
        {
          id: 'sample_14',
          question: 'What is the boiling point of water at sea level?',
          answer: '100°C',
          options: ['90°C', '100°C', '110°C', '120°C'],
          topic: 'Chemistry',
          subject: 'Science',
          source: 'sample'
        },
        {
          id: 'sample_15',
          question: 'Which is the longest river in the world?',
          answer: 'Nile',
          options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
          topic: 'Geography',
          subject: 'General Knowledge',
          source: 'sample'
        }
      ];
      questions.push(...sampleQuestions);
    }

    // Shuffle and limit to 15 questions
    const finalQuestions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);

    if (finalQuestions.length === 0) {
      return NextResponse.json(
        {
          error: "No questions available",
          message: "Something went wrong loading questions",
          examCode
        },
        { status: 404 }
      );
    }

    console.log('[Blast Content API] Success! Questions:', finalQuestions.length);

    return NextResponse.json({
      questions: finalQuestions,
      questionCount: finalQuestions.length,
      contentSource: {
        quiz_history: finalQuestions.filter(q => q.source === "quiz_history").length,
        flashcard: finalQuestions.filter(q => q.source === "flashcard").length,
        question_bank: finalQuestions.filter(q => q.source === "question_bank").length,
      },
      examName: examCode,
    });
  } catch (error: any) {
    console.error("[Blast Content API] Error:", error);
    console.error("[Blast Content API] Stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch blast content", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generate distractor options for flashcard answers
 */
async function generateDistractors(
  correctAnswer: string,
  question: string,
  userId: string,
  examCode: string
): Promise<string[]> {
  try {
    // Try to find similar answers from other flashcards or quiz questions
    const similar = await queryAll(
      `(SELECT DISTINCT fc.back as text
        FROM flashcard_decks fd
        JOIN flashcards fc ON fc.deck_id = fd.id
        WHERE fd.exam_id = $1
        AND fc.back != $2
        AND LENGTH(fc.back) BETWEEN ${Math.max(correctAnswer.length - 20, 2)} AND ${correctAnswer.length + 20}
        ORDER BY RANDOM()
        LIMIT 3)
      UNION
      (SELECT DISTINCT qq.correct_answer as text
        FROM quiz_results qr
        JOIN quiz_questions qq ON qr.id = qq.quiz_result_id
        WHERE qr.exam_id = $1
        AND qq.correct_answer != $2
        AND LENGTH(qq.correct_answer) BETWEEN ${Math.max(correctAnswer.length - 20, 2)} AND ${correctAnswer.length + 20}
        ORDER BY RANDOM()
        LIMIT 3)
      LIMIT 3`,
      [examCode, correctAnswer]
    );

    return similar.map((s: any) => s.text).filter(Boolean);
  } catch (err) {
    console.error('[Blast Content API] Distractor generation error:', err);
    return [];
  }
}
