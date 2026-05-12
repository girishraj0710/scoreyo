import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateQuiz } from "@/lib/quiz-generator";
import { getVerifiedQuestions } from "@/lib/question-bank";
import {
  createMockTest,
  getMockTest,
  completeMockTest,
  getUserMockTests,
  getInProgressMockTest,
  isProUser,
  getCachedQuestions,
  saveCachedQuestions,
  markCachedQuestionsUsed,
} from "@/lib/db";
import { getMockTestConfig, getAllMockTestConfigs } from "@/lib/mock-test-config";
import {
  generateDynamicMockTest,
  selectQuestionsForMockTest,
  calculateMaxTestsAvailable,
  getAllDynamicMockTests
} from "@/lib/dynamic-mock-test-generator";
import { getExamById, getSubjectById } from "@/lib/exams";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// GET - Get mock test configs or user's mock test history
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("prepgenie-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action === "configs") {
    // Use static configs (dynamic generation happens per-test when user starts)
    // This is faster and more reliable than generating all configs upfront
    const staticConfigs = getAllMockTestConfigs();
    return NextResponse.json({ configs: staticConfigs });
  }

  if (action === "capacity") {
    // Return maximum tests available per exam
    const capacity: Record<string, number> = {};

    // Get all unique exam IDs from static configs
    const staticConfigs = getAllMockTestConfigs();
    const examIds = [...new Set(staticConfigs.map(c => c.examId))];

    for (const examId of examIds) {
      try {
        const maxTests = await calculateMaxTestsAvailable(examId);
        // If dynamic calculation succeeds and shows more than 3, use it
        capacity[examId] = maxTests > 3 ? maxTests : 3;
      } catch (error) {
        // Fallback: count static configs for this exam
        const staticTestCount = staticConfigs.filter(c => c.examId === examId).length;
        capacity[examId] = staticTestCount || 3;
      }
    }

    return NextResponse.json({ capacity });
  }

  if (action === "resume") {
    const inProgress = await getInProgressMockTest(userId);
    if (inProgress) {
      return NextResponse.json({ mockTest: inProgress });
    }
    return NextResponse.json({ mockTest: null });
  }

  if (action === "result") {
    const testId = request.nextUrl.searchParams.get("id");
    if (!testId) return NextResponse.json({ error: "Missing test ID" }, { status: 400 });
    const test = await getMockTest(testId, userId);
    if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });
    return NextResponse.json({ mockTest: test });
  }

  // Default: return history
  const history = await getUserMockTests(userId);
  return NextResponse.json({ history });
}

// POST - Start a new mock test
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Only Pro users can take mock tests
    if (!(await isProUser(userId))) {
      return NextResponse.json(
        { error: "Mock tests are a Pro feature. Upgrade to access.", proRequired: true },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { examId, testNumber = 1, isFullLength = false } = body;

    // Try dynamic generation first
    let config: any;
    let allQuestions: any[] = [];
    let useDynamic = false;

    try {
      // Check if exam supports dynamic generation
      const dynamicConfig = await generateDynamicMockTest(examId, testNumber, isFullLength);
      if (dynamicConfig) {
        config = dynamicConfig;
        allQuestions = await selectQuestionsForMockTest(examId, testNumber, isFullLength);
        useDynamic = true;
        console.log(`[MockTest] Using dynamic generation for ${examId} test ${testNumber}`);
      }
    } catch (error) {
      console.log(`[MockTest] Dynamic generation not available for ${examId}, falling back to static`);
    }

    // Fallback to static config if dynamic generation fails or is unavailable
    if (!useDynamic) {
      config = getMockTestConfig(examId, testNumber);
      if (!config) {
        return NextResponse.json({ error: "Mock test not available for this exam" }, { status: 400 });
      }

      // If full-length requested, multiply questions by 3x and time by 2.5x
      if (isFullLength) {
        config = {
          ...config,
          totalQuestions: config.totalQuestions * 3,
          timeLimitMinutes: Math.round(config.timeLimitMinutes * 2.5),
          sections: config.sections.map((s: any) => ({
            ...s,
            questionCount: s.questionCount * 3,
          })),
        };
      }
    }

    const exam = getExamById(examId);
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 400 });
    }

    // If using dynamic generation and already have questions, skip the old generation logic
    if (useDynamic && allQuestions.length > 0) {
      // Questions already fetched by selectQuestionsForMockTest
    } else {
      // Use the old generation logic as fallback

    for (const section of config.sections) {
      const subject = getSubjectById(examId, section.subjectId);
      if (!subject) continue;

      const needed = section.questionCount;
      let sectionQuestions: any[] = [];

      // Try verified questions first
      const topics = subject.topics;
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      // Get from cache
      const cached = await getCachedQuestions(examId, section.subjectId, randomTopic, "mixed", needed);
      if (cached.length > 0) {
        const cacheIds = cached.map((q: any) => q._cacheId).filter(Boolean);
        if (cacheIds.length > 0) await markCachedQuestionsUsed(cacheIds);
        sectionQuestions = cached.map((q: any) => {
          const { _cacheId, ...rest } = q;
          return { ...rest, subjectId: section.subjectId, subjectName: section.subjectName };
        });
      }

      // If not enough, get verified questions from various topics
      if (sectionQuestions.length < needed) {
        for (const t of shuffle(topics).slice(0, 5)) {
          const verified = getVerifiedQuestions(examId, section.subjectId, t);
          const shuffled = shuffle(verified);
          for (const q of shuffled) {
            if (sectionQuestions.length >= needed) break;
            sectionQuestions.push({ ...q, subjectId: section.subjectId, subjectName: section.subjectName });
          }
          if (sectionQuestions.length >= needed) break;
        }
      }

      // If still not enough, generate via AI (with timeout)
      if (sectionQuestions.length < needed) {
        const remaining = needed - sectionQuestions.length;
        const aiTopic = topics[Math.floor(Math.random() * topics.length)];
        try {
          const aiQuestions = await Promise.race([
            generateQuiz(
              exam.fullName,
              subject.name,
              aiTopic,
              remaining,
              "mixed"
            ),
            new Promise<any[]>((_, reject) =>
              setTimeout(() => reject(new Error("AI generation timeout")), 20000)
            ),
          ]);

          if (aiQuestions && aiQuestions.length > 0) {
            for (const q of aiQuestions) {
              sectionQuestions.push({ ...q, subjectId: section.subjectId, subjectName: section.subjectName });
            }
            // Save to cache
            if (!aiQuestions[0].question.includes("[Service Unavailable]")) {
              await saveCachedQuestions(examId, section.subjectId, aiTopic, aiQuestions);
            }
          }
        } catch (err) {
          console.error(`[MockTest] AI generation failed/timeout for ${section.subjectName}:`, err);
          // Continue with whatever questions we have
        }
      }

        allQuestions.push(...sectionQuestions.slice(0, needed));
      }
    } // End of fallback generation

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    const testId = uuidv4();
    const timeLimitSeconds = config.timeLimitMinutes * 60;

    await createMockTest(
      testId,
      userId,
      examId,
      allQuestions.length,
      timeLimitSeconds,
      JSON.stringify(allQuestions)
    );

    return NextResponse.json({
      testId,
      examId,
      examName: config.examName,
      totalQuestions: allQuestions.length,
      timeLimitSeconds,
      timeLimitMinutes: config.timeLimitMinutes,
      sections: config.sections,
      questions: allQuestions,
    });
  } catch (error) {
    console.error("Mock test creation error:", error);
    return NextResponse.json({ error: "Failed to create mock test" }, { status: 500 });
  }
}

// PUT - Submit mock test
export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await request.json();
    const { testId, answers, timeTaken } = body;

    const test = await getMockTest(testId, userId);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const questions = JSON.parse(test.questions_json);
    let correct = 0;
    const results = questions.map((q: any, i: number) => {
      const userAnswer = answers[i] ?? null;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        explanation: q.explanation,
        subjectId: q.subjectId,
        subjectName: q.subjectName,
      };
    });

    // Calculate section-wise results
    const sectionResults: Record<string, { correct: number; total: number; subjectName: string }> = {};
    results.forEach((r: any) => {
      if (!sectionResults[r.subjectId]) {
        sectionResults[r.subjectId] = { correct: 0, total: 0, subjectName: r.subjectName };
      }
      sectionResults[r.subjectId].total++;
      if (r.isCorrect) sectionResults[r.subjectId].correct++;
    });

    await completeMockTest(testId, userId, correct, timeTaken || 0, JSON.stringify(answers));

    return NextResponse.json({
      testId,
      totalQuestions: questions.length,
      correctAnswers: correct,
      accuracy: Math.round((correct / questions.length) * 100),
      timeTaken,
      sectionResults,
      results,
    });
  } catch (error) {
    console.error("Mock test submit error:", error);
    return NextResponse.json({ error: "Failed to submit mock test" }, { status: 500 });
  }
}
