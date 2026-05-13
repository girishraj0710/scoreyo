import { NextRequest, NextResponse } from "next/server";
import { generateQuiz, type QuizQuestion } from "@/lib/quiz-generator";
import { getVerifiedQuestions } from "@/lib/question-bank";
import {
  createQuizSession,
  saveQuestionAttempts,
  updateTopicMastery,
  getCachedQuestions,
  saveCachedQuestions,
  markCachedQuestionsUsed,
  getCachedQuestionCount,
  isProUser,
  getTodayQuizCount,
  getEnglishQuestions,
} from "@/lib/db";
import { getExamById, getSubjectById } from "@/lib/exams";
import { v4 as uuidv4 } from "uuid";

const FREE_QUIZ_LIMIT = 3;

// Shuffle an array (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Background pre-fill: generate questions and save to cache (fire-and-forget)
function backgroundCacheFill(
  examFullName: string,
  subjectName: string,
  topic: string,
  examId: string,
  subjectId: string,
  difficulty: string,
  count: number = 10
) {
  // Don't await — this runs in the background
  generateQuiz(examFullName, subjectName, topic, count, difficulty as any)
    .then(async (questions) => {
      if (questions.length > 0 && !questions[0].question.includes("[Service Unavailable]")) {
        await saveCachedQuestions(examId, subjectId, topic, questions);
      }
    })
    .catch((err) => {
      console.error("[Cache] Background fill failed:", err);
    });
}

// POST - Generate a new quiz (3-tier: verified → cached → AI)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      examId,
      subjectId,
      topic,
      numberOfQuestions = 5,
      difficulty = "mixed",
    } = body;

    console.log(`[Quiz API] Request: examId="${examId}", subjectId="${subjectId}", topic="${topic}", difficulty="${difficulty}", count=${numberOfQuestions}`);

    // Check quiz limit for free users
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (userId && !(await isProUser(userId))) {
      const todayCount = await getTodayQuizCount(userId);
      if (todayCount >= FREE_QUIZ_LIMIT) {
        return NextResponse.json(
          {
            error: "Daily quiz limit reached",
            limitReached: true,
            todayCount,
            limit: FREE_QUIZ_LIMIT,
          },
          { status: 403 }
        );
      }
    }

    const exam = getExamById(examId);
    const subject = getSubjectById(examId, subjectId);

    if (!exam || !subject) {
      return NextResponse.json(
        { error: "Invalid exam or subject" },
        { status: 400 }
      );
    }

    let finalQuestions: QuizQuestion[] = [];
    let verifiedCount = 0;
    let cachedCount = 0;
    let aiCount = 0;

    // ── TIER 1: Verified question bank (instant) ─────────
    let verifiedQuestions: QuizQuestion[] = [];

    // Check if this is an English quiz (any English-related exam/subject)
    const isEnglishQuiz =
      examId === 'foundation' ||
      subjectId?.toLowerCase().includes('english') ||
      topic?.toLowerCase().includes('tense') ||
      topic?.toLowerCase().includes('phrasal') ||
      topic?.toLowerCase().includes('grammar');

    if (isEnglishQuiz) {
      // Query English questions from database
      try {
        // For English questions, use 'foundation' as path_id and topic as topic_id
        const pathId = 'foundation';

        // Map frontend topics to database topics (comprehensive mapping)
        const topicMapping: Record<string, string> = {
          // Writing topics → writing-skills (97Q)
          'letter-writing': 'writing-skills',
          'email-writing': 'writing-skills',
          'essay-writing': 'writing-skills',
          'essay-writing-basics': 'writing-skills',
          'paragraph-writing': 'writing-skills',
          'sentence-writing': 'writing-skills',

          // Pronunciation → phonics-vowels (26Q)
          'pronunciation-basics': 'phonics-vowels',
          'pronunciation-practice': 'phonics-vowels',

          // Pronouns → parts-of-speech (62Q - includes pronouns)
          'pronouns-detailed': 'parts-of-speech',

          // Adjectives → parts-of-speech (62Q - includes adjectives)
          'adjectives': 'parts-of-speech',

          // Tense comparison → present-simple (as starting point)
          'all-tenses-comparison': 'present-simple',

          // Sentence types → sentence-structure (12Q)
          'sentence-types': 'sentence-structure',

          // Subject-verb agreement → verbs-basics (5Q)
          'subject-verb-agreement': 'verbs-basics',

          // Active/Passive voice → sentence-structure (12Q)
          'active-passive-voice': 'sentence-structure',

          // Direct/Indirect speech → sentence-structure (12Q)
          'direct-indirect-speech': 'sentence-structure',

          // Vocabulary → essential-vocabulary (5Q) or toefl-vocabulary
          'basic-vocabulary': 'essential-vocabulary',

          // Idioms → idioms (26Q) + idioms-expressions (9Q)
          'idioms-proverbs': 'idioms',

          // Reading → reading-comprehension (42Q)
          'reading-basics': 'reading-comprehension',
          'short-stories': 'reading-comprehension',
          'comprehension-passages': 'reading-comprehension',

          // Listening → reading-comprehension (closest available)
          'listening-comprehension': 'reading-comprehension',

          // Conversations → daily-conversations (5Q in real-world path)
          'daily-conversations': 'daily-conversations',
        };

        let topicId = topic.toLowerCase().replace(/\s+/g, '-');

        // Use mapping if available
        if (topicMapping[topicId]) {
          console.log(`[English Quiz] Mapping topic "${topicId}" to "${topicMapping[topicId]}"`);
          topicId = topicMapping[topicId];
        }

        // Try multiple paths: foundation, real-world, ielts-toefl, competitive-exam
        const pathsToTry = ['foundation', 'real-world', 'ielts-toefl', 'competitive-exam'];
        let dbQuestions: any[] = [];
        let levelToQuery = difficulty === 'mixed' ? 'intermediate' : difficulty;

        // Try each path until we find questions
        for (const pathId of pathsToTry) {
          if (dbQuestions.length > 0) break;

          // Try with requested level
          dbQuestions = await getEnglishQuestions(pathId, topicId, levelToQuery, numberOfQuestions * 2);

          // If no questions found, try other levels
          if (dbQuestions.length === 0 && difficulty !== 'mixed') {
            dbQuestions = await getEnglishQuestions(pathId, topicId, 'intermediate', numberOfQuestions * 2);
          }

          if (dbQuestions.length === 0) {
            dbQuestions = await getEnglishQuestions(pathId, topicId, 'beginner', numberOfQuestions * 2);
          }

          if (dbQuestions.length === 0) {
            dbQuestions = await getEnglishQuestions(pathId, topicId, 'advanced', numberOfQuestions * 2);
          }

          if (dbQuestions.length > 0) {
            console.log(`[English Quiz] Found ${dbQuestions.length} questions in path="${pathId}", topic="${topicId}"`);
            break;
          }
        }

        console.log(`[English Quiz] Final: topic="${topicId}", level="${levelToQuery}", found=${dbQuestions.length} questions`);

        verifiedQuestions = dbQuestions.map((q: any) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          source: 'verified' as const,
        }));
      } catch (error) {
        console.error('Error fetching English questions from DB:', error);
      }
    }

    // If no English questions found, fallback to in-memory question bank
    if (verifiedQuestions.length === 0) {
      console.log(`[English Quiz] No questions found in database, trying in-memory question bank`);
      verifiedQuestions = getVerifiedQuestions(examId, subjectId, topic);
      console.log(`[English Quiz] In-memory question bank returned ${verifiedQuestions.length} questions`);
    }

    if (difficulty !== "mixed" && verifiedQuestions.length > 0) {
      const filtered = verifiedQuestions.filter((q) => q.difficulty === difficulty);
      if (filtered.length > 0) verifiedQuestions = filtered;
    }

    const shuffledVerified = shuffle(verifiedQuestions);
    const verifiedToUse = shuffledVerified.slice(0, Math.min(numberOfQuestions, shuffledVerified.length));
    finalQuestions = [...verifiedToUse];
    verifiedCount = verifiedToUse.length;

    let remaining = numberOfQuestions - finalQuestions.length;

    // ── TIER 2: Cached AI questions (instant) ────────────
    if (remaining > 0) {
      const cached = await getCachedQuestions(examId, subjectId, topic, difficulty, remaining);

      // Filter out questions that match any verified question text (avoid duplicates)
      const verifiedTexts = new Set(verifiedToUse.map((q) => q.question.toLowerCase().trim()));
      const uniqueCached = cached.filter(
        (q: any) => !verifiedTexts.has(q.question?.toLowerCase().trim())
      );

      const cachedToUse = uniqueCached.slice(0, remaining);
      const cacheIds = cachedToUse.map((q: any) => q._cacheId).filter(Boolean);

      // Mark them as used (so least-used questions get priority next time)
      if (cacheIds.length > 0) {
        await markCachedQuestionsUsed(cacheIds);
      }

      // Clean up _cacheId before sending to client
      const cleanCached: QuizQuestion[] = cachedToUse.map((q: any) => {
        const { _cacheId, ...rest } = q;
        return { ...rest, source: "ai" as const };
      });

      finalQuestions = [...finalQuestions, ...cleanCached];
      cachedCount = cleanCached.length;
      remaining = numberOfQuestions - finalQuestions.length;
    }

    // ── TIER 3: Fresh AI generation (slow, ~8-9 sec) ────
    if (remaining > 0) {
      try {
        // Add timeout for AI generation (45 seconds max)
        const aiQuestions = await Promise.race([
          generateQuiz(
            exam.fullName,
            subject.name,
            topic,
            remaining,
            difficulty as any
          ),
          new Promise<QuizQuestion[]>((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timeout")), 45000)
          ),
        ]);

        if (aiQuestions && aiQuestions.length > 0 && !aiQuestions[0].question.includes("[Service Unavailable]")) {
          finalQuestions = [...finalQuestions, ...aiQuestions];
          aiCount = aiQuestions.length;

          // Save AI questions to cache for next time (don't await)
          saveCachedQuestions(examId, subjectId, topic, aiQuestions);
        }
      } catch (error) {
        console.error("[Quiz API] AI generation failed:", error);
        // If AI fails but we have some questions already, continue with what we have
        if (finalQuestions.length === 0) {
          // Last resort: return a helpful error
          return NextResponse.json(
            {
              error: "Unable to generate questions at the moment. Please try again in a few seconds.",
              timeout: true,
            },
            { status: 500 }
          );
        }
        // If we have some questions, continue with partial set
        console.log(`[Quiz API] Continuing with ${finalQuestions.length} questions (${remaining} failed to generate)`);
      }
    }

    // Shuffle the final mix
    finalQuestions = shuffle(finalQuestions);

    const sessionId = uuidv4();

    // ── Aggressive background pre-fill cache ──────────
    // Don't await - run in background to speed up future quizzes
    getCachedQuestionCount(examId, subjectId, topic).then(currentCacheCount => {
      if (currentCacheCount < 50) {
        // Pre-fill more aggressively (50 questions target instead of 20)
        backgroundCacheFill(
          exam.fullName,
          subject.name,
          topic,
          examId,
          subjectId,
          difficulty,
          Math.min(30, 50 - currentCacheCount) // Fill up to 50
        );
      }
    }).catch(err => console.error("[Cache] Pre-fill check failed:", err));

    return NextResponse.json({
      sessionId,
      examId,
      subjectId,
      topic,
      examName: exam.name,
      subjectName: subject.name,
      questions: finalQuestions,
      meta: {
        verifiedCount,
        cachedCount,
        aiCount,
        totalInBank: verifiedQuestions.length,
        totalInCache: currentCacheCount,
      },
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

// PUT - Submit quiz results
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      examId,
      subjectId,
      topic,
      questions,
      answers,
      timeTaken,
    } = body;

    const userId = request.cookies.get("prepgenie-user-id")?.value || "default-user";

    // Calculate score
    let correct = 0;
    const attempts = questions.map((q: any, i: number) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        sessionId,
        userId,
        examId,
        subjectId,
        topic,
        questionText: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[i] ?? null,
        isCorrect,
        explanation: q.explanation,
      };
    });

    // Save to database
    await createQuizSession(
      sessionId,
      userId,
      examId,
      subjectId,
      topic,
      questions.length,
      correct,
      timeTaken || 0
    );

    await saveQuestionAttempts(attempts);

    // Update topic mastery
    await updateTopicMastery(
      userId,
      examId,
      subjectId,
      topic,
      questions.length,
      correct
    );

    return NextResponse.json({
      sessionId,
      totalQuestions: questions.length,
      correctAnswers: correct,
      accuracy: Math.round((correct / questions.length) * 100),
      timeTaken,
      results: attempts.map((a: any, i: number) => ({
        question: a.questionText,
        options: a.options,
        correctAnswer: a.correctAnswer,
        userAnswer: answers[i] ?? null,
        isCorrect: a.isCorrect,
        explanation: a.explanation,
        source: questions[i].source || "ai",
      })),
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
