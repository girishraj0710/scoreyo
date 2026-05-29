import { NextRequest, NextResponse, after } from "next/server";
import { generateQuiz, type QuizQuestion } from "@/lib/quiz-generator";
import { getVerifiedQuestions } from "@/lib/question-bank";
import { mapTopicToDatabase } from "@/lib/topic-mapping";
import {
  createQuizSession,
  saveQuestionAttempts,
  updateTopicMastery,
  saveVerifiedQuestions,
  getCachedQuestionCount,
  isProUser,
  getTodayQuizCount,
  getEnglishQuestions,
  getExamQuestions,
  updateBadgeStats,
  getBadgeStats,
  unlockBadge,
  getUserBadges,
} from "@/lib/db";
import { checkBadges } from "@/lib/achievements";
import { getExamById, getSubjectById } from "@/lib/exams";
import { v4 as uuidv4 } from "uuid";
import { getCached, setCached, CacheKeys, incrementCached } from "@/lib/redis";
import { quizGenerationLimiter } from "@/lib/rate-limit";

// Vercel serverless freezes the function when the response is returned, which
// kills any in-flight `saveCachedQuestions` / background-prefill promises and
// prevents the cache from ever warming. Setting maxDuration gives `after()`
// callbacks room to finish their AI calls + DB writes after we respond.
// Increased to 90s to handle 10-question generation (20-30s) + background cache fill
export const maxDuration = 90;

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

// Background pre-fill: generate questions and save to FACT TABLE (dimensional model).
// MUST be invoked from inside an `after()` callback so the work survives the
// response. Without `after()` Vercel freezes the function and the AI fetch +
// DB write are killed mid-flight — that's why the cache never warmed in prod.
async function backgroundCacheFill(
  examFullName: string,
  subjectName: string,
  topic: string,
  examId: string,
  subjectId: string,
  difficulty: string,
  count: number = 10,
  saveAsTopic?: string  // Optional: save with different topic name (for mapping)
) {
  try {
    const questions = await generateQuiz(
      examFullName,
      subjectName,
      topic,  // Use original topic for AI prompt
      count,
      difficulty as any
    );
    if (questions.length > 0 && !questions[0].question.includes("[Service Unavailable]")) {
      const topicToSave = saveAsTopic || topic;  // Use mapped topic if provided

      // Always save to dimensional fact_exam_questions table
      await saveVerifiedQuestions(examId, subjectId, topicToSave, questions);
      console.log(`[Dimensional] Background fill saved ${questions.length} verified qs for ${examId}/${topicToSave}`);
    }
  } catch (err) {
    console.error("[Background fill] Failed:", err);
  }
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

    // Map topic to database format (fixes 88.7% empty topic issue)
    const mappedTopic = mapTopicToDatabase(examId, subjectId, topic);
    if (mappedTopic !== topic) {
      console.log(`[Quiz API] Topic mapped: "${topic}" → "${mappedTopic}"`);
    }

    // Require authentication for quiz generation
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required to generate quizzes" },
        { status: 401 }
      );
    }

    // Rate limit: 10 quizzes per hour (prevents abuse)
    if (quizGenerationLimiter) {
      const rateLimitResult = await quizGenerationLimiter.limit(userId);
      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: "Too many requests",
            message: "You're generating quizzes too quickly. Please wait a moment.",
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          },
          { status: 429 }
        );
      }
    }

    // Check quiz limit for free users (CACHED - reduces DB load by 90%)
    const isPro = await isProUser(userId);
    if (!isPro) {
      // Use Redis counter instead of DB query - much faster!
      const limitKey = CacheKeys.quizLimit(userId);
      const todayCount = await incrementCached(limitKey, 86400); // 24h TTL

      if (todayCount > FREE_QUIZ_LIMIT) {
        return NextResponse.json(
          {
            error: "Daily quiz limit reached",
            message: "Free users can generate 3 quizzes per day. Upgrade to Pro for unlimited access.",
            limitReached: true,
            todayCount: todayCount - 1, // Don't count this failed attempt
            limit: FREE_QUIZ_LIMIT,
            upgradeUrl: "/pricing",
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

    // ── TIER 1: Redis Cache (FASTEST - 50ms response) ─────────────────
    // With 150K questions in DB, cache hit rate should be 95%+
    const cacheKey = CacheKeys.questions(examId, subjectId, mappedTopic, difficulty, numberOfQuestions);
    let verifiedQuestions: QuizQuestion[] = [];

    // Try Redis first
    const cachedQuestions = await getCached<QuizQuestion[]>(cacheKey);
    if (cachedQuestions && cachedQuestions.length >= numberOfQuestions) {
      verifiedQuestions = cachedQuestions;
      console.log(`[Quiz API] ✓ CACHE HIT: ${verifiedQuestions.length} questions from Redis`);
    } else {
      console.log(`[Quiz API] Cache miss, querying database...`);

      // ── TIER 2: Database questions (verified + cached, prioritized by source) ─
      try {
        verifiedQuestions = await getExamQuestions(
          examId,
          subjectId,
          mappedTopic,
          difficulty,
          numberOfQuestions * 2  // Request more for variety
        ) as QuizQuestion[];
        console.log(
          `[Quiz API] Found ${verifiedQuestions.length} questions from DB for ${examId}/${mappedTopic}`
        );

        // Cache for 24 hours if we got good results
        if (verifiedQuestions.length >= numberOfQuestions) {
          await setCached(cacheKey, verifiedQuestions, 86400);
          console.log(`[Quiz API] ✓ Cached ${verifiedQuestions.length} questions to Redis`);
        }
      } catch (error) {
        console.error("[Quiz API] Database query failed:", error);
      }
    }

    // If no verified DB questions, try the alternate paths (English bank
    // and in-memory bank) — same as before. The cached pool above is
    // unaffected; it still serves Tier 2 below.
    if (verifiedQuestions.length === 0) {

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

      // If still no questions, try in-memory question bank as last resort
      if (verifiedQuestions.length === 0) {
        console.log(`[Quiz API] Trying in-memory question bank...`);
        verifiedQuestions = getVerifiedQuestions(examId, subjectId, topic);
        console.log(`[Quiz API] In-memory bank returned ${verifiedQuestions.length} questions`);
      }
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

    // ── TIER 2: Fresh AI generation (only if database doesn't have enough) ─
    // generateQuiz uses gpt-4o-mini with 60s timeout per model.
    // 10 questions typically take 20-30s, so outer guard set to 65s to avoid premature timeout.
    let aiTimedOut = false;
    if (remaining > 0) {
      console.log(`[Quiz API] Need ${remaining} more questions, calling AI generation...`);
      try {
        const aiQuestions = await Promise.race([
          generateQuiz(
            exam.fullName,
            subject.name,
            topic,
            remaining,
            difficulty as any
          ),
          new Promise<QuizQuestion[]>((_, reject) =>
            setTimeout(() => reject(new Error("AI generation timeout")), 65000)
          ),
        ]);

        console.log(`[Quiz API] AI returned ${aiQuestions?.length || 0} questions`);

        if (aiQuestions && aiQuestions.length > 0) {
          const isFallback = aiQuestions[0].question.includes("[Service Unavailable]");

          if (!isFallback) {
            finalQuestions = [...finalQuestions, ...aiQuestions];
            aiCount = aiQuestions.length;
            // Persist to FACT TABLE (dimensional model) AFTER the response
            // `after()` keeps the serverless function alive long enough for the DB write
            // Save with mappedTopic so future queries can find it in Tier 1
            after(async () => {
              try {
                // Always save to dimensional fact_exam_questions table
                await saveVerifiedQuestions(examId, subjectId, mappedTopic, aiQuestions);
              } catch (err) {
                console.error("[Quiz API] post-response save failed:", err);
              }
            });
            console.log(`[Quiz API] ✓ Added ${aiCount} AI-generated questions (will save to fact table)`);
          } else {
            aiTimedOut = true;
            console.log(`[Quiz API] ✗ AI returned fallback questions`);
          }
        } else {
          aiTimedOut = true;
        }
      } catch (error) {
        aiTimedOut = true;
        console.error("[Quiz API] AI generation failed:", error);
        if (finalQuestions.length === 0) {
          // No verified or cached questions and AI couldn't generate — likely
          // an upstream model service issue. Return 503 so the UI can show
          // a meaningful "service warming up" message and offer retry.
          return NextResponse.json(
            {
              error:
                "Our AI question generator is currently slow. This topic isn't cached yet — please retry in a few seconds, or pick a different topic.",
              aiBusy: true,
              topic,
              retryable: true,
            },
            { status: 503 }
          );
        }
        console.log(`[Quiz API] Continuing with ${finalQuestions.length} questions (partial set)`);
      }
    }

    // No questions from any source — distinguish AI failure from missing content.
    if (finalQuestions.length === 0) {
      console.error("[Quiz API] No questions available from any source");
      if (aiTimedOut) {
        return NextResponse.json(
          {
            error:
              "Our AI question generator is currently slow. This topic isn't cached yet — please retry in a few seconds, or pick a different topic.",
            aiBusy: true,
            topic,
            retryable: true,
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: "No questions available for this topic yet. Please try a different topic or check back later.",
          noQuestions: true,
        },
        { status: 404 }
      );
    }

    // Shuffle the final mix
    finalQuestions = shuffle(finalQuestions);

    const sessionId = uuidv4();

    // ── Aggressive background pre-fill to FACT TABLE ──────────
    // Check how many verified questions exist in fact table for this topic
    const cacheCountForMeta = await getCachedQuestionCount(examId, subjectId, topic);

    if (cacheCountForMeta < 50) {
      // Pre-fill more aggressively (50 questions target).
      // Wrapped in `after()` so the AI generation + DB write actually runs
      // to completion on Vercel.
      const fillCount = Math.min(30, 50 - cacheCountForMeta);
      after(() =>
        backgroundCacheFill(
          exam.fullName,
          subject.name,
          topic,  // Use original topic for AI prompt context
          examId,
          subjectId,
          difficulty,
          fillCount,
          mappedTopic  // Save with mapped topic for future retrieval
        )
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
        totalInCache: cacheCountForMeta,
      },
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to generate quiz",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
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

    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

    // Calculate source stats for analytics
    const sourceStats = {
      verified: questions.filter((q: any) => q.source === 'verified').length,
      ai: questions.filter((q: any) => q.source === 'ai').length,
    };
    // If cached distinction exists, count it separately
    const cached = questions.filter((q: any) => q.source === 'cached').length;
    if (cached > 0) {
      sourceStats.ai += cached; // Group cached with AI for now
    }

    // Extract sprint_id if this is a sprint quiz
    const sprintId = body.sprintId || null;

    // Save to database
    try {
      console.log(`[Quiz Submit] Creating session for user=${userId}, sessionId=${sessionId}`);
      await createQuizSession(
        sessionId,
        userId,
        examId,
        subjectId,
        topic,
        questions.length,
        correct,
        timeTaken || 0,
        sourceStats,
        sprintId
      );
      console.log(`[Quiz Submit] ✓ Session created`);
    } catch (error) {
      console.error('[Quiz Submit] createQuizSession failed:', error);
      throw new Error(`Database error (createQuizSession): ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      console.log(`[Quiz Submit] Saving ${attempts.length} question attempts`);
      await saveQuestionAttempts(attempts);
      console.log(`[Quiz Submit] ✓ Question attempts saved`);
    } catch (error) {
      console.error('[Quiz Submit] saveQuestionAttempts failed:', error);
      throw new Error(`Database error (saveQuestionAttempts): ${error instanceof Error ? error.message : String(error)}`);
    }

    // Update topic mastery
    try {
      console.log(`[Quiz Submit] Updating topic mastery`);
      await updateTopicMastery(
        userId,
        examId,
        subjectId,
        topic,
        questions.length,
        correct
      );
      console.log(`[Quiz Submit] ✓ Topic mastery updated`);
    } catch (error) {
      console.error('[Quiz Submit] updateTopicMastery failed:', error);
      throw new Error(`Database error (updateTopicMastery): ${error instanceof Error ? error.message : String(error)}`);
    }

    // ── Badge Tracking ──────────────────────────────────────
    const accuracy = Math.round((correct / questions.length) * 100);
    const timeInSeconds = timeTaken || 0;

    // Update badge stats based on performance
    const badgeUpdates: any = {};

    // Accuracy badges
    if (accuracy >= 90) badgeUpdates.highAccuracyQuizzes = 1;
    if (accuracy >= 95) badgeUpdates.veryHighAccuracyQuizzes = 1;
    if (accuracy === 100) badgeUpdates.perfectQuizzes = 1;

    // Speed badges (< 3 minutes for 5 questions = fast)
    if (timeInSeconds > 0 && timeInSeconds < 180) {
      badgeUpdates.fastQuizzes = 1;
    }

    // Time-based badges
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) badgeUpdates.lateQuizzes = 1; // Night Owl (after 11 PM or before 6 AM)

    // Weekend badges
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) badgeUpdates.weekendSessions = 1;

    // Update badge stats if any achievements earned this quiz
    if (Object.keys(badgeUpdates).length > 0) {
      try {
        console.log(`[Quiz Submit] Updating badge stats:`, badgeUpdates);
        await updateBadgeStats(userId, badgeUpdates);
        console.log(`[Quiz Submit] ✓ Badge stats updated`);
      } catch (error) {
        console.error('[Quiz Submit] updateBadgeStats failed:', error);
        throw new Error(`Database error (updateBadgeStats): ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Check for newly earned badges (non-fatal - don't block quiz submission)
    let newBadges: any[] = [];
    try {
      console.log(`[Quiz Submit] Checking for new badges`);
      const stats = await getBadgeStats(userId);
      const earnedBadges = checkBadges(stats);
      const userBadges = await getUserBadges(userId);
      const userBadgeIds = new Set(userBadges.map((b: any) => b.badge_id));

      for (const badge of earnedBadges) {
        if (!userBadgeIds.has(badge.id)) {
          const unlocked = await unlockBadge(userId, badge.id);
          if (unlocked) {
            newBadges.push({
              id: badge.id,
              name: badge.name,
              description: badge.description,
              icon: badge.icon,
              rarity: badge.rarity,
            });
          }
        }
      }
      console.log(`[Quiz Submit] ✓ Badge check complete, ${newBadges.length} new badges`);
    } catch (error) {
      // Badges are optional - don't fail quiz submission if this fails
      console.error('[Quiz Submit] Badge processing failed (non-fatal):', error);
    }

    return NextResponse.json({
      sessionId,
      totalQuestions: questions.length,
      correctAnswers: correct,
      accuracy,
      timeTaken,
      newBadges, // Return newly unlocked badges
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to submit quiz",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
