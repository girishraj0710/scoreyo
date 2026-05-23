import { NextRequest, NextResponse } from "next/server";
import { generateQuiz, type QuizQuestion } from "@/lib/quiz-generator";
import { getVerifiedQuestions } from "@/lib/question-bank";
import {
  getCachedQuestions,
  saveVerifiedQuestions,
  isProUser,
  getTodayQuizCount,
  getLevelQuestionCache,
  saveLevelQuestionCache,
  markLevelPassed,
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

// POST - Generate level quiz (with retry consistency)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      examId,
      subjectId,
      levelNumber,
      topic,
      numberOfQuestions = 10,
      difficulty = "mixed",
    } = body;

    if (!examId || !subjectId || !levelNumber) {
      return NextResponse.json(
        { error: "Missing required fields: examId, subjectId, levelNumber" },
        { status: 400 }
      );
    }

    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check quiz limit for free users
    if (!(await isProUser(userId))) {
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

    // ── Check if this level has cached questions (for retry consistency) ──
    const levelCache = await getLevelQuestionCache(userId, examId, subjectId, levelNumber);

    if (levelCache && !levelCache.isPassed) {
      // User is retrying a failed level - return THE SAME questions
      const sessionId = uuidv4();

      return NextResponse.json({
        sessionId,
        examId,
        subjectId,
        levelNumber,
        topic,
        examName: exam.name,
        subjectName: subject.name,
        questions: levelCache.questions,
        isRetry: true,
        meta: {
          message: "Same questions for retry - master these to unlock next level!",
        },
      });
    }

    // ── Generate NEW questions (first attempt or passed level) ──
    let finalQuestions: QuizQuestion[] = [];
    let verifiedCount = 0;
    let cachedCount = 0;
    let aiCount = 0;

    // TIER 1: Verified question bank
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

    // TIER 2: Cached AI questions
    if (remaining > 0) {
      const cached = await getCachedQuestions(examId, subjectId, topic, difficulty, remaining);

      const verifiedTexts = new Set(verifiedToUse.map((q) => q.question.toLowerCase().trim()));
      const uniqueCached = cached.filter(
        (q: any) => !verifiedTexts.has(q.question?.toLowerCase().trim())
      );

      const cachedToUse = uniqueCached.slice(0, remaining);
      const cacheIds = cachedToUse.map((q: any) => q._cacheId).filter(Boolean);

      if (cacheIds.length > 0) {
        await // markCachedQuestionsUsed - no longer needed(cacheIds);
      }

      const cleanCached: QuizQuestion[] = cachedToUse.map((q: any) => {
        const { _cacheId, ...rest } = q;
        return { ...rest, source: "ai" as const };
      });

      finalQuestions = [...finalQuestions, ...cleanCached];
      cachedCount = cleanCached.length;
      remaining = numberOfQuestions - finalQuestions.length;
    }

    // TIER 3: Fresh AI generation
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

      if (aiQuestions.length > 0 && !aiQuestions[0].question.includes("[Service Unavailable]")) {
        saveVerifiedQuestions(examId, subjectId, topic, aiQuestions);
      }
    }

    // Shuffle final mix
    finalQuestions = shuffle(finalQuestions);

    // ── Save to level cache (will be used if they fail and retry) ──
    await saveLevelQuestionCache(userId, examId, subjectId, levelNumber, finalQuestions);

    const sessionId = uuidv4();

    return NextResponse.json({
      sessionId,
      examId,
      subjectId,
      levelNumber,
      topic,
      examName: exam.name,
      subjectName: subject.name,
      questions: finalQuestions,
      isRetry: false,
      meta: {
        verifiedCount,
        cachedCount,
        aiCount,
      },
    });
  } catch (error) {
    console.error("Level quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate level quiz" },
      { status: 500 }
    );
  }
}

// PUT - Mark level as passed (clears cache, allows new questions on next attempt)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId, subjectId, levelNumber } = body;

    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!examId || !subjectId || !levelNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mark this level as passed - future attempts will get fresh questions
    await markLevelPassed(userId, examId, subjectId, levelNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark level passed error:", error);
    return NextResponse.json(
      { error: "Failed to mark level as passed" },
      { status: 500 }
    );
  }
}
