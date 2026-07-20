// Scoreyo — Learner Model Service (DB ↔ pure engine bridge)
// =============================================================================
// Glue between the persisted skill state (topic_skill_state) and the pure
// behavior-driven engine (learner-model.ts). This is what the quiz submit
// handler calls in its background `after()` block. It:
//
//   1. Loads the current SkillState for the quizzed topic.
//   2. Replays each question attempt through the engine (decay → BKT → etc.).
//   3. Persists the updated skill state + adaptive next-review.
//   4. Records the classified mistakes into the Mistake Map (weakness_profiles).
//   5. Re-aggregates ALL topics into learner_profiles.profile.evolving so the
//      home/readiness always reflects measured behavior, not self-ratings.
//
// Kept separate from the HTTP layer so it stays testable and reusable.
// =============================================================================

import {
  getSkillState,
  getAllSkillState,
  upsertSkillState,
  getLearnerProfile,
  saveLearnerProfile,
  recordWeaknessType,
  type SkillStateRow,
} from "@/lib/db";
import {
  initSkillState,
  applyAttempt,
  nextReviewMs,
  computeReadiness,
  computeTraits,
  type SkillState,
  type Difficulty,
  type ErrorType,
  type TopicSnapshot,
} from "@/lib/learner-model";

// One question's outcome from a submitted quiz.
export interface QuizAttemptInput {
  isCorrect: boolean;
  difficulty: Difficulty;
  seconds: number | null; // per-question seconds (approx from session time is ok)
  answerChanges?: number | null; // minimal indecision signal (optional)
}

// ── Row ↔ model mapping ──────────────────────────────────────────────────
function rowToState(row: SkillStateRow | null | undefined): SkillState {
  if (!row) return initSkillState();
  return {
    pKnown: row.p_known,
    stability: row.stability,
    difficulty: row.difficulty,
    attempts: row.attempts,
    correct: row.correct,
    streak: row.streak,
    ewmaAccuracy: row.ewma_accuracy,
    ewmaSpeedRatio: row.ewma_speed_ratio,
    errors: {
      calculation: row.err_calculation,
      concept: row.err_concept,
      time: row.err_time,
      careless: row.err_careless,
    },
    lastSeenMs: row.last_seen ? new Date(row.last_seen).getTime() : null,
  };
}

/**
 * Process one quiz's worth of attempts for a single topic. Updates the topic's
 * skill state and mistake map, then re-aggregates the learner profile.
 *
 * `nowMs` is passed in (not read from the clock here) so callers/tests control
 * time. The quiz route passes Date.now().
 */
export async function processQuizForLearnerModel(params: {
  userId: string;
  examId: string;
  subjectId: string;
  topic: string;
  attempts: QuizAttemptInput[];
  nowMs: number;
}): Promise<void> {
  const { userId, examId, subjectId, topic, attempts, nowMs } = params;
  if (!attempts.length) return;

  // 1. Load current state and replay attempts through the engine.
  const row = (await getSkillState(userId, examId, subjectId, topic)) as SkillStateRow | null;
  let state = rowToState(row);
  const errorTally: Record<Exclude<ErrorType, null>, number> = {
    calculation: 0,
    concept: 0,
    time: 0,
    careless: 0,
  };

  for (const a of attempts) {
    const res = applyAttempt(state, {
      isCorrect: a.isCorrect,
      difficulty: a.difficulty,
      seconds: a.seconds,
      answerChanges: a.answerChanges,
      nowMs,
    });
    state = res.state;
    if (res.errorType) errorTally[res.errorType] += 1;
  }

  // 2. Persist updated skill state with adaptive next-review.
  const nextReview = new Date(nextReviewMs(state, nowMs)).toISOString();
  await upsertSkillState(userId, examId, subjectId, topic, {
    pKnown: state.pKnown,
    stability: state.stability,
    difficulty: state.difficulty,
    attempts: state.attempts,
    correct: state.correct,
    streak: state.streak,
    ewmaAccuracy: state.ewmaAccuracy,
    ewmaSpeedRatio: state.ewmaSpeedRatio,
    errors: state.errors,
    lastSeen: new Date(nowMs).toISOString(),
    nextReview,
  });

  // 3. Feed classified mistakes into the existing Mistake Map.
  for (const [type, count] of Object.entries(errorTally) as [Exclude<ErrorType, null>, number][]) {
    for (let i = 0; i < count; i++) {
      try {
        await recordWeaknessType(userId, examId, subjectId, topic, type);
      } catch {
        /* mistake-map is best-effort; never fail the quiz submit over it */
      }
    }
  }

  // 4. Re-aggregate the whole exam into the evolving learner profile.
  await refreshEvolvingProfile(userId, examId, nowMs);
}

/**
 * Rebuild learner_profiles.profile.evolving from ALL tracked topics for an exam.
 * This is what the personalized home / readiness reads. Non-fatal on error.
 */
export async function refreshEvolvingProfile(userId: string, examId: string, nowMs: number): Promise<void> {
  try {
    const rows = (await getAllSkillState(userId, examId)) as SkillStateRow[];
    const snapshots: TopicSnapshot[] = rows.map((r) => ({
      topic: (r as any).topic,
      subjectId: (r as any).subject_id,
      state: rowToState(r),
    }));

    const readiness = computeReadiness(snapshots, nowMs);
    const traits = computeTraits(snapshots, nowMs);

    // Momentum: compare new readiness to the last stored value.
    const existing = await getLearnerProfile(userId);
    const profile = (existing?.profile || {}) as Record<string, any>;
    const prevReadiness: number | null = profile?.evolving?.readiness ?? null;
    let momentum: "improving" | "steady" | "declining" = "steady";
    if (prevReadiness != null) {
      if (readiness.readiness > prevReadiness + 2) momentum = "improving";
      else if (readiness.readiness < prevReadiness - 2) momentum = "declining";
    }

    const evolving = {
      source: "behavior",
      readiness: readiness.readiness, // 0..100, measured
      readinessConfidence: readiness.confidence, // 0..1
      topicsTracked: readiness.topicsTracked,
      dominantErrorType: traits.dominantErrorType,
      errorBreakdown: traits.errorBreakdown,
      pace: traits.pace,
      consistency: traits.consistency,
      momentum,
      weakestTopics: traits.weakestTopics,
      strongestTopics: traits.strongestTopics,
      updatedAt: new Date(nowMs).toISOString(),
    };

    const merged = { ...profile, evolving };
    // saveLearnerProfile preserves onboarding_completed when completed is omitted.
    await saveLearnerProfile(userId, existing?.exam_id || examId, merged);
  } catch (error) {
    console.error("[LearnerModel] refreshEvolvingProfile failed:", error);
  }
}
