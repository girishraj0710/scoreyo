import { NextRequest, NextResponse, after } from "next/server";
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
  getExamQuestions,
} from "@/lib/db";
import { getMockTestConfig, getAllMockTestConfigs } from "@/lib/mock-test-config";
import {
  generateDynamicMockTest,
  selectQuestionsForMockTest,
  calculateMaxTestsAvailable,
  getAllDynamicMockTests
} from "@/lib/dynamic-mock-test-generator";
import { getExamById, getSubjectById } from "@/lib/exams";

// Mock-test generation can chain several AI calls (one per section) plus
// post-response cache writes. Without an extended maxDuration Vercel kills the
// serverless function at the platform default (10s on hobby) — well before
// `after()` callbacks finish persisting AI questions to the cache.
export const maxDuration = 60;

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
    // Capacity = how many tests can ACTUALLY be delivered for each exam.
    // The UI uses this to decide how many "Test N" buttons to render, so it
    // must not be inflated — every advertised slot needs a real backing source.
    //
    // Per-exam capacity = max(staticConfigCount, dynamicDeliverableCount).
    //   - staticConfigCount: hand-curated mockTestConfigs entries
    //   - dynamicDeliverableCount: how many unique tests the cached question
    //     pool can satisfy (bottleneck-aware across sections)
    const capacity: Record<string, number> = {};
    const staticConfigs = getAllMockTestConfigs();
    const examIds = [...new Set(staticConfigs.map((c) => c.examId))];

    await Promise.all(
      examIds.map(async (examId) => {
        const staticCount = staticConfigs.filter((c) => c.examId === examId).length;
        let dynamicCount = 0;
        try {
          dynamicCount = await calculateMaxTestsAvailable(examId);
        } catch (error) {
          console.error(`[MockTest] capacity calc failed for ${examId}:`, error);
        }
        capacity[examId] = Math.max(staticCount, dynamicCount);
      })
    );

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

    // If dynamic generation already produced questions, skip the fallback path.
    if (useDynamic && allQuestions.length > 0) {
      // already populated
    } else {
      // Per-section fallback runs IN PARALLEL — the old sequential loop
      // multiplied AI latency by section count. With 3-5 sections each
      // potentially needing AI, this dropped p95 from ~30s to ~8s.
      const sectionResults = await Promise.all(
        config.sections.map(async (section: any) => {
          const subject = getSubjectById(examId, section.subjectId);
          if (!subject) return [];

          const needed = section.questionCount;
          let sectionQuestions: any[] = [];
          const topics = subject.topics;

          // Tier 1: verified DB pool (exam_questions) + AI cache pool
          // (cached_questions), queried in parallel and merged. Both use
          // empty-topic mode so we sample broadly across the subject. The
          // verified rows take precedence because we push them first into
          // the dedupe set — duplicate question text in cached_questions
          // is dropped in favour of the verified copy.
          const [verifiedPool, cachedPool] = await Promise.all([
            getExamQuestions(examId, section.subjectId, "", "mixed", needed * 4),
            getCachedQuestions(examId, section.subjectId, "", "mixed", needed * 4),
          ]);

          const cacheIds = cachedPool
            .map((q: any) => q._cacheId)
            .filter(Boolean);
          if (cacheIds.length > 0) await markCachedQuestionsUsed(cacheIds);

          const seen = new Set<string>();
          const merged: any[] = [];
          for (const q of [...verifiedPool, ...cachedPool]) {
            const { _cacheId, ...rest } = q as any;
            const k = (rest.question || "").toLowerCase().trim();
            if (!k || seen.has(k)) continue;
            seen.add(k);
            merged.push({
              ...rest,
              subjectId: section.subjectId,
              subjectName: section.subjectName,
            });
            if (merged.length >= needed) break;
          }
          sectionQuestions = merged;

          // Tier 2: in-memory verified bank, sampled across topics (only
          // reached if Tier 1 came up short — usually only for exams that
          // haven't been seeded into exam_questions yet).
          if (sectionQuestions.length < needed) {
            for (const t of shuffle(topics).slice(0, 5)) {
              const verified = getVerifiedQuestions(examId, section.subjectId, t);
              for (const q of shuffle(verified)) {
                const k = (q.question || "").toLowerCase().trim();
                if (!k || seen.has(k)) continue;
                seen.add(k);
                sectionQuestions.push({
                  ...q,
                  subjectId: section.subjectId,
                  subjectName: section.subjectName,
                });
                if (sectionQuestions.length >= needed) break;
              }
              if (sectionQuestions.length >= needed) break;
            }
          }

          // Tier 3 (AI) has been REMOVED from the request path. Inline AI
          // generation made mock tests slow and flaky: 3–5 sections each
          // racing a 14s AI call meant p95 latency in the tens of seconds
          // and frequent timeouts during model rate-limits.
          //
          // New behavior: if the section is short, ship what we have and
          // schedule an `after()` prewarm so the next mock test for the
          // same exam is fully cache-served. The first user on a cold
          // exam may get a slightly shorter section; every subsequent
          // user gets an instant, fully-populated test.
          if (sectionQuestions.length < needed) {
            const shortBy = needed - sectionQuestions.length;
            const prewarmTopic = topics[Math.floor(Math.random() * topics.length)];
            console.log(
              `[MockTest] section "${section.subjectName}" short by ${shortBy} — scheduling background prewarm`
            );
            after(async () => {
              try {
                const ai = await generateQuiz(
                  exam.fullName,
                  subject.name,
                  prewarmTopic,
                  Math.max(shortBy, 10), // overshoot a bit to actually warm the cache
                  "mixed"
                );
                if (ai.length > 0 && !ai[0].question.includes("[Service Unavailable]")) {
                  await saveCachedQuestions(examId, section.subjectId, prewarmTopic, ai);
                  console.log(
                    `[MockTest] post-response prewarm cached ${ai.length} qs for ${examId}/${section.subjectName}`
                  );
                }
              } catch (err) {
                console.error("[MockTest] post-response prewarm failed:", err);
              }
            });
          }

          return sectionQuestions.slice(0, needed);
        })
      );

      for (const qs of sectionResults) allQuestions.push(...qs);
    } // End of fallback generation

    // Since AI is no longer in the request path, the response is bounded by
    // what cache + verified bank can deliver. If that's drastically short of
    // the configured total, return 503 with `aiBusy` so the UI can show a
    // "preparing" state and retry — the after() prewarm scheduled above will
    // have warmed the cache by then. Threshold = 50% of configured total.
    const minAcceptable = Math.ceil(config.totalQuestions * 0.5);
    if (allQuestions.length < minAcceptable) {
      console.warn(
        `[MockTest] not enough questions for ${examId} test ${testNumber}: have ${allQuestions.length}, need >= ${minAcceptable} (configured ${config.totalQuestions}) — returning 503, prewarm scheduled`
      );
      return NextResponse.json(
        {
          error:
            "We're preparing fresh questions for this mock test. Please retry in a minute — subsequent tests will load instantly.",
          aiBusy: true,
          retryable: true,
          have: allQuestions.length,
          need: config.totalQuestions,
        },
        { status: 503 }
      );
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
