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
    let verifiedQuestions = getVerifiedQuestions(examId, subjectId, topic);

    if (difficulty !== "mixed") {
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
      const aiQuestions = await generateQuiz(
        exam.fullName,
        subject.name,
        topic,
        remaining,
        difficulty as any
      );
      finalQuestions = [...finalQuestions, ...aiQuestions];
      aiCount = aiQuestions.length;

      // Save AI questions to cache for next time (don't await)
      if (aiQuestions.length > 0 && !aiQuestions[0].question.includes("[Service Unavailable]")) {
        saveCachedQuestions(examId, subjectId, topic, aiQuestions);
      }
    }

    // Shuffle the final mix
    finalQuestions = shuffle(finalQuestions);

    const sessionId = uuidv4();

    // ── Background pre-fill cache for next quiz ──────────
    const currentCacheCount = await getCachedQuestionCount(examId, subjectId, topic);
    if (currentCacheCount < 20) {
      backgroundCacheFill(
        exam.fullName,
        subject.name,
        topic,
        examId,
        subjectId,
        difficulty,
        10
      );
    }

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
