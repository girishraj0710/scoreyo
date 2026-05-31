/**
 * SECURE QUIZ SUBMISSION ROUTE
 *
 * This is the refactored version with:
 * ✅ Transaction safety (all DB operations in single transaction)
 * ✅ Request validation (Zod schemas)
 * ✅ No SQL injection (parameterized queries)
 * ✅ Proper error handling
 *
 * MIGRATION PLAN:
 * 1. Test this version thoroughly
 * 2. Run A/B test (50% traffic to new route)
 * 3. Monitor for errors
 * 4. Replace original route.ts when stable
 */

import { NextRequest, NextResponse, after } from "next/server";
import { getPool } from "@/lib/db";
import { withTransaction } from "@/lib/db/transaction";
import { quizSubmissionSchema, validateRequest, formatValidationErrors } from "@/lib/validation/schemas";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";
import {
  updateBadgeStats,
  getBadgeStats,
  unlockBadge,
  getUserBadges,
  ensureUserExists,
} from "@/lib/db";
import { checkBadges } from "@/lib/achievements";

export const maxDuration = 90;

/**
 * PUT /api/quiz - Submit quiz results
 *
 * SECURITY IMPROVEMENTS:
 * - Validates input with Zod schema (prevents malformed data)
 * - Uses transaction (ensures data consistency)
 * - Parameterized queries only (prevents SQL injection)
 * - Proper error handling (no data leaks)
 */
export async function PUT(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── STEP 1: Validate Request ──────────────────────────────
    let validatedData;
    try {
      validatedData = await validateRequest(request, quizSubmissionSchema);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = formatValidationErrors(error);
        logger.warn('Quiz submission validation failed', { errors: errorMessages });
        return NextResponse.json(
          {
            error: "Invalid request data",
            details: errorMessages
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const {
      examId,
      subjectId,
      topic,
      questions,
      userAnswers,
      timeTakenSeconds,
      correctCount,
      totalQuestions,
      pressureMode = false,
      isSprintMode = false,
      sprintId = null,
    } = validatedData;

    // ── STEP 2: Authenticate User ──────────────────────────────
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Generate session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    logger.info('Quiz submission started', {
      userId,
      sessionId,
      examId,
      subjectId,
      topic,
      questionCount: totalQuestions,
      correctCount,
      timeTaken: timeTakenSeconds,
      pressureMode,
      isSprintMode,
    });

    // ── STEP 3: Ensure User Exists ──────────────────────────────
    // This handles edge cases where user was created but not in DB
    await ensureUserExists(userId);

    // ── STEP 4: Prepare Question Attempts ──────────────────────
    const attempts = questions.map((q, i) => {
      const userAnswer = userAnswers[i] ?? null;
      const isCorrect = userAnswer === q.correctAnswer;

      return {
        sessionId,
        userId,
        examId,
        subjectId,
        topic,
        questionText: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        explanation: q.explanation || null,
        difficulty: q.difficulty || 'medium',
      };
    });

    // Calculate accuracy
    const accuracy = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

    // Calculate source stats
    const sourceStats = {
      verified: questions.filter(q => q.difficulty === 'easy').length, // Placeholder
      ai: questions.filter(q => q.difficulty !== 'easy').length,
    };

    // ── STEP 5: Save to Database in Transaction ────────────────
    // 🔒 CRITICAL: All 3 operations must succeed or all fail
    const pool = getPool();

    try {
      await withTransaction(pool, async (tx) => {
        // 5a. Create quiz session
        await tx.execute(
          `INSERT INTO quiz_sessions (
            id, user_id, exam_id, subject_id, topic,
            total_questions, correct_answers, time_taken_seconds,
            source_stats, sprint_id, pressure_mode, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)`,
          [
            sessionId,
            userId,
            examId,
            subjectId,
            topic,
            totalQuestions,
            correctCount,
            timeTakenSeconds,
            JSON.stringify(sourceStats),
            sprintId,
            pressureMode,
          ]
        );

        // 5b. Save question attempts (batch insert for performance)
        if (attempts.length > 0) {
          const valuesClauses: string[] = [];
          const params: any[] = [];
          let paramIndex = 1;

          for (const attempt of attempts) {
            valuesClauses.push(
              `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, CURRENT_TIMESTAMP)`
            );
            params.push(
              attempt.sessionId,
              attempt.userId,
              attempt.examId,
              attempt.subjectId,
              attempt.topic,
              attempt.questionText,
              attempt.options,
              attempt.correctAnswer,
              attempt.userAnswer,
              attempt.isCorrect,
              attempt.explanation
            );
          }

          await tx.execute(
            `INSERT INTO question_attempts (
              session_id, user_id, exam_id, subject_id, topic,
              question_text, options, correct_answer, user_answer,
              is_correct, explanation, created_at
            ) VALUES ${valuesClauses.join(', ')}`,
            params
          );
        }

        // 5c. Update topic mastery (upsert)
        await tx.execute(
          `INSERT INTO topic_mastery (
            user_id, exam_id, subject_id, topic,
            total_attempted, total_correct, last_attempted, mastery_score
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7)
          ON CONFLICT (user_id, exam_id, subject_id, topic)
          DO UPDATE SET
            total_attempted = topic_mastery.total_attempted + EXCLUDED.total_attempted,
            total_correct = topic_mastery.total_correct + EXCLUDED.total_correct,
            last_attempted = CURRENT_TIMESTAMP,
            mastery_score = ROUND(
              ((topic_mastery.total_correct + EXCLUDED.total_correct)::numeric /
               (topic_mastery.total_attempted + EXCLUDED.total_attempted)::numeric * 100)::numeric,
              1
            )`,
          [
            userId,
            examId,
            subjectId,
            topic,
            totalQuestions,
            correctCount,
            accuracy, // Initial mastery score
          ]
        );
      });

      const transactionTime = Date.now() - startTime;
      logger.info('Quiz submission transaction completed', {
        sessionId,
        transactionTime,
      });

    } catch (dbError) {
      logger.error('Quiz submission transaction failed', { sessionId }, dbError as Error);
      return NextResponse.json(
        {
          error: "Database error",
          message: "Failed to save quiz results. Please try again.",
        },
        { status: 500 }
      );
    }

    // ── STEP 6: Badge Processing (Background) ──────────────────
    // Process badges asynchronously - don't block response
    after(async () => {
      try {
        // Update badge stats based on performance
        const badgeUpdates: any = {};

        // Accuracy badges
        if (accuracy >= 90) badgeUpdates.highAccuracyQuizzes = 1;
        if (accuracy >= 95) badgeUpdates.veryHighAccuracyQuizzes = 1;
        if (accuracy === 100) badgeUpdates.perfectQuizzes = 1;

        // Speed badges (< 3 minutes for 5 questions = fast)
        if (timeTakenSeconds > 0 && timeTakenSeconds < 180 && totalQuestions >= 5) {
          badgeUpdates.fastQuizzes = 1;
        }

        // Time-based badges
        const hour = new Date().getHours();
        if (hour >= 23 || hour < 6) badgeUpdates.lateQuizzes = 1;

        // Weekend badges
        const dayOfWeek = new Date().getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) badgeUpdates.weekendSessions = 1;

        // Update badge stats if any achievements earned
        if (Object.keys(badgeUpdates).length > 0) {
          await updateBadgeStats(userId, badgeUpdates);
          logger.debug('Badge stats updated', { userId, updates: badgeUpdates });
        }

        // Check for newly earned badges
        const stats = await getBadgeStats(userId);
        const earnedBadges = checkBadges(stats);
        const userBadges = await getUserBadges(userId);
        const userBadgeIds = new Set(userBadges.map((b: any) => b.badge_id));

        for (const badge of earnedBadges) {
          if (!userBadgeIds.has(badge.id)) {
            await unlockBadge(userId, badge.id);
            logger.info('Badge unlocked', { userId, badgeId: badge.id, badgeName: badge.name });
          }
        }
      } catch (badgeError) {
        // Log but don't fail the request
        logger.error('Badge processing failed', { userId, sessionId }, badgeError as Error);
      }
    });

    // ── STEP 7: Return Response ──────────────────────────────────
    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      sessionId,
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timeTaken: timeTakenSeconds,
      newBadges: [], // Badges shown on next page load
      results: attempts.map((a, i) => ({
        question: a.questionText,
        options: JSON.parse(a.options),
        correctAnswer: a.correctAnswer,
        userAnswer: userAnswers[i] ?? null,
        isCorrect: a.isCorrect,
        explanation: a.explanation,
        difficulty: a.difficulty,
      })),
      performance: {
        totalTime,
        transactionSuccess: true,
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    logger.error('Quiz submission error', { totalTime }, error as Error);

    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : String(error))
      : 'An unexpected error occurred';

    return NextResponse.json(
      {
        error: "Failed to submit quiz",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
