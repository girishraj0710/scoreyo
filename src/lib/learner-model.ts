// Scoreyo — Behavior-Driven Learner Model (the "heart and soul")
// =============================================================================
// This module is the core intelligence that turns raw quiz behavior into a
// living estimate of what a student actually knows — not a naive accuracy count.
//
// It is intentionally PURE (no database, no network, no clock reads passed in
// implicitly). Every function takes its inputs and returns new state, so the
// math can be unit-tested in isolation and reasoned about precisely.
//
// Three research-grounded models are fused per topic:
//
//   1. Bayesian Knowledge Tracing (BKT)
//      Tracks p(known) — the probability the student has truly mastered the
//      topic — with explicit SLIP (knew it, answered wrong) and GUESS (didn't
//      know, answered right) parameters. On 4-option MCQs, guess is anchored
//      near 0.25 so one lucky correct answer can't scream "mastered", and one
//      careless slip can't scream "weak".
//
//   2. Forgetting curve (FSRS-inspired memory stability)
//      Each topic carries a STABILITY (how many days the memory survives) and a
//      live RETRIEVABILITY R = exp(-elapsedDays / stability). Knowledge decays
//      between sessions; a successful, well-spaced retrieval GROWS stability
//      (the spacing effect), which schedules the next review adaptively per
//      student — not with fixed 7/3/1-day steps.
//
//   3. Elo-style difficulty adjustment
//      Getting a HARD question right is stronger evidence of mastery than an
//      easy one; whiffing an EASY question is stronger evidence of a gap. The
//      per-question evidence is scaled by difficulty and by response speed
//      (fast+correct = fluent; slow+correct = effortful; fast+wrong = careless).
//
// The output per topic is a skill state; aggregated across topics it yields a
// readiness score and behavioral traits for the evolving learner profile.
// =============================================================================

export type Difficulty = "easy" | "medium" | "hard";

// -----------------------------------------------------------------------------
// Tunable model constants. Grouped here so the model is auditable in one place.
// -----------------------------------------------------------------------------
export const MODEL = {
  // --- BKT parameters ---
  // p(learn): chance an unknown topic becomes known after a single exposure.
  P_TRANSIT: 0.12,
  // p(slip): knew it but answered wrong (careless / misread).
  P_SLIP: 0.1,
  // p(guess): didn't know but answered right. Anchored to the MCQ chance level.
  P_GUESS: 0.25,
  // Clamp p(known) away from 0/1 so the model always stays responsive.
  P_KNOWN_MIN: 0.02,
  P_KNOWN_MAX: 0.985,
  // Seed p(known) for a brand-new topic (slightly pessimistic — assume gap).
  P_KNOWN_INIT: 0.3,

  // --- Forgetting curve (memory stability, measured in days) ---
  STABILITY_INIT: 1.0, // fresh memory survives ~1 day before meaningful decay
  STABILITY_MIN: 0.3,
  STABILITY_MAX: 365,
  // Multiplicative growth on a correct, spaced retrieval. Scaled by difficulty
  // and how "due" the memory was (spacing effect: reviewing right before you'd
  // forget strengthens more than cramming).
  STABILITY_GROW_BASE: 1.6,
  // Penalty factor applied to stability on a wrong answer (memory was weaker
  // than thought — pull the durability estimate down).
  STABILITY_LAPSE: 0.55,

  // --- Difficulty weighting (evidence multipliers) ---
  // Evidence strength tracks SURPRISE (IRT intuition):
  //  - A CORRECT answer is strong evidence when the question was HARD.
  //  - A WRONG answer is strong evidence when the question was EASY (a
  //    surprising failure signals a real gap; failing a hard one is expected).
  DIFFICULTY_WEIGHT: { easy: 0.7, medium: 1.0, hard: 1.35 } as Record<Difficulty, number>,
  DIFFICULTY_WEIGHT_WRONG: { easy: 1.35, medium: 1.0, hard: 0.7 } as Record<Difficulty, number>,

  // --- Speed model ---
  // Expected seconds to answer, by difficulty, used to derive a speed ratio.
  EXPECTED_SECONDS: { easy: 25, medium: 45, hard: 75 } as Record<Difficulty, number>,
  // A response faster than this fraction of expected time, when WRONG, is
  // flagged as a careless/rushed error rather than a true concept gap.
  RUSH_RATIO: 0.4,
  // A response slower than this fraction of expected time, when CORRECT, is a
  // fluency gap (knows it but too slow for exam conditions).
  SLOW_RATIO: 1.8,

  // --- Answer-change (indecision) dampening ---
  // Changing the answer signals uncertainty. This ONLY dampens how far the BKT
  // estimate moves (never amplifies it) — a minimal secondary signal that keeps
  // the model humble when a student wavered. Deliberately small vs. the primary
  // signals (correctness, difficulty, speed): each change shaves a little off
  // the evidence weight, down to a floor so it can never dominate.
  CHANGE_DAMP_PER_CHANGE: 0.06, // ~6% less evidence per answer change
  CHANGE_DAMP_FLOOR: 0.8, // never drop evidence below 80% from indecision alone

  // --- EWMA smoothing for behavioral traits (0..1, higher = more reactive) ---
  EWMA_ALPHA: 0.3,

  // --- Review scheduling ---
  // Schedule the next review when retrievability is predicted to fall to this
  // level (0.9 = review while still 90% recallable → strong long-term memory).
  REVIEW_AT_RETRIEVABILITY: 0.9,
} as const;

// -----------------------------------------------------------------------------
// Per-topic skill state. This is what we persist and evolve on every attempt.
// -----------------------------------------------------------------------------
export interface SkillState {
  pKnown: number; // BKT probability the topic is truly mastered (0..1)
  stability: number; // forgetting-curve memory durability, in days
  difficulty: number; // Elo-style estimate of this topic's difficulty FOR THIS USER (0..1)
  attempts: number; // lifetime attempts on this topic
  correct: number; // lifetime correct
  streak: number; // current consecutive-correct streak
  ewmaAccuracy: number; // smoothed recent accuracy (0..1)
  ewmaSpeedRatio: number; // smoothed observed/expected time ratio (1 = on pace)
  errors: { calculation: number; concept: number; time: number; careless: number };
  lastSeenMs: number | null; // epoch ms of last attempt (for decay); null = never
}

export function initSkillState(): SkillState {
  return {
    pKnown: MODEL.P_KNOWN_INIT,
    stability: MODEL.STABILITY_INIT,
    difficulty: 0.5,
    attempts: 0,
    correct: 0,
    streak: 0,
    ewmaAccuracy: 0.5,
    ewmaSpeedRatio: 1,
    errors: { calculation: 0, concept: 0, time: 0, careless: 0 },
    lastSeenMs: null,
  };
}

// Optional seed from onboarding self-rating so the very first quiz doesn't start
// from a blind 0.3. Self-ratings are weak priors — deliberately conservative.
export function seedFromSelfRating(rating: "strong" | "average" | "weak"): SkillState {
  const s = initSkillState();
  s.pKnown = rating === "strong" ? 0.6 : rating === "average" ? 0.4 : 0.25;
  s.difficulty = rating === "strong" ? 0.4 : rating === "average" ? 0.5 : 0.6;
  return s;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

// -----------------------------------------------------------------------------
// Retrievability: how likely the memory is recallable RIGHT NOW given decay.
// R = exp(-elapsedDays / stability). Returns 1 if never decayed / just seen.
// -----------------------------------------------------------------------------
export function retrievability(state: SkillState, nowMs: number): number {
  if (state.lastSeenMs == null) return 1;
  const elapsedDays = Math.max(0, (nowMs - state.lastSeenMs) / 86_400_000);
  if (state.stability <= 0) return 0;
  return Math.exp(-elapsedDays / state.stability);
}

// Effective mastery = confidence you know it AND can recall it now.
export function effectiveMastery(state: SkillState, nowMs: number): number {
  return state.pKnown * retrievability(state, nowMs);
}

// -----------------------------------------------------------------------------
// One attempt's observed evidence.
// -----------------------------------------------------------------------------
export interface Attempt {
  isCorrect: boolean;
  difficulty: Difficulty;
  // Seconds spent on THIS question. If unknown (session-level timing only),
  // pass null — the speed dimension is skipped for that attempt.
  seconds: number | null;
  nowMs: number; // epoch ms when the attempt was submitted
  // How many times the answer was changed before submitting. Optional minimal
  // indecision signal that only dampens evidence strength. Defaults to 0.
  answerChanges?: number | null;
}

export type ErrorType = "calculation" | "concept" | "time" | "careless" | null;

export interface AttemptResult {
  state: SkillState;
  errorType: ErrorType; // classified mistake (null if correct or unclassifiable)
  speedRatio: number | null; // observed/expected (null if no timing)
}

// -----------------------------------------------------------------------------
// THE CORE UPDATE. Fuses decay → BKT (difficulty+speed-weighted) → stability →
// Elo difficulty → behavioral EWMAs, in that causal order.
// -----------------------------------------------------------------------------
export function applyAttempt(prev: SkillState, attempt: Attempt): AttemptResult {
  const { isCorrect, difficulty, seconds, nowMs } = attempt;
  const answerChanges = attempt.answerChanges != null && attempt.answerChanges > 0 ? attempt.answerChanges : 0;

  // --- 0. Decay first: the memory has faded since it was last exercised. ---
  const R = retrievability(prev, nowMs);
  // p(known) is eroded toward "not recallable" by the decay since last seen.
  // We fold retrievability into the prior so a long gap makes the model humble.
  const decayedPKnown = clamp(prev.pKnown * R + MODEL.P_KNOWN_INIT * (1 - R) * 0.5, MODEL.P_KNOWN_MIN, MODEL.P_KNOWN_MAX);

  // --- 1. Speed analysis ---
  const expected = MODEL.EXPECTED_SECONDS[difficulty];
  const speedRatio = seconds != null && seconds > 0 ? seconds / expected : null;

  // --- 2. Difficulty & speed-weighted evidence strength ---
  // diffWeight (used for stability growth on correct) always rewards harder Qs.
  const diffWeight = MODEL.DIFFICULTY_WEIGHT[difficulty];
  // evidenceWeight (how far the BKT estimate moves) tracks SURPRISE: a correct
  // answer counts more when hard; a wrong answer counts more when easy.
  let evidenceWeight = isCorrect
    ? MODEL.DIFFICULTY_WEIGHT[difficulty]
    : MODEL.DIFFICULTY_WEIGHT_WRONG[difficulty];
  if (speedRatio != null) {
    if (isCorrect && speedRatio <= 1) evidenceWeight *= 1.1; // fluent correct
    if (isCorrect && speedRatio >= MODEL.SLOW_RATIO) evidenceWeight *= 0.85; // slow correct = shaky
    if (!isCorrect && speedRatio <= MODEL.RUSH_RATIO) evidenceWeight *= 0.7; // rushed wrong = careless, weaker evidence of a gap
  }
  evidenceWeight = clamp(evidenceWeight, 0.4, 1.6);

  // Indecision dampening (minimal, one-directional): each answer change shaves a
  // little off the evidence weight, floored so it can never dominate the primary
  // signals. Wavering makes the model slightly more humble — never more certain.
  if (answerChanges > 0) {
    const damp = Math.max(MODEL.CHANGE_DAMP_FLOOR, 1 - answerChanges * MODEL.CHANGE_DAMP_PER_CHANGE);
    evidenceWeight *= damp;
  }

  // --- 3. BKT posterior update with slip/guess, tempered by evidenceWeight ---
  // Standard BKT conditioning:
  //   P(known | correct)  = P(k)(1-slip)          / [P(k)(1-slip) + (1-P(k))guess]
  //   P(known | wrong)    = P(k)slip              / [P(k)slip     + (1-P(k))(1-guess)]
  // then learning transition: P(k)' = P + (1-P)*transit.
  const slip = MODEL.P_SLIP;
  const guess = MODEL.P_GUESS;
  const pk = decayedPKnown;

  let posterior: number;
  if (isCorrect) {
    posterior = (pk * (1 - slip)) / (pk * (1 - slip) + (1 - pk) * guess);
  } else {
    posterior = (pk * slip) / (pk * slip + (1 - pk) * (1 - guess));
  }

  // Blend posterior with prior by evidence weight: strong evidence (hard, fluent)
  // moves the estimate fully to the posterior; weak evidence moves it less.
  const blend = clamp(evidenceWeight / 1.6, 0.25, 1); // 0.25..1
  let pKnown = pk + (posterior - pk) * blend;

  // Learning transition only on correct (a correct answer may reflect learning).
  if (isCorrect) pKnown = pKnown + (1 - pKnown) * MODEL.P_TRANSIT;
  pKnown = clamp(pKnown, MODEL.P_KNOWN_MIN, MODEL.P_KNOWN_MAX);

  // --- 4. Stability (forgetting curve) update ---
  let stability = prev.stability;
  if (isCorrect) {
    // Spacing effect: retrieving a memory that had decayed more (lower R) grows
    // durability more. Hard questions grow it more. Bounded growth.
    const spacingBonus = 1 + (1 - R); // 1..2 as memory was more "due"
    const grow = MODEL.STABILITY_GROW_BASE * (0.6 + 0.4 * diffWeight) * (0.7 + 0.3 * spacingBonus);
    stability = clamp(prev.stability * grow, MODEL.STABILITY_MIN, MODEL.STABILITY_MAX);
  } else {
    // Lapse: memory was weaker than believed. Pull durability down.
    stability = clamp(prev.stability * MODEL.STABILITY_LAPSE, MODEL.STABILITY_MIN, MODEL.STABILITY_MAX);
  }

  // --- 5. Elo-style per-user difficulty of this topic ---
  // If the user gets it right, the topic is "easier for them" (nudge down);
  // wrong nudges it up. Learning-rate scaled so it drifts, not jumps.
  const eloK = 0.08;
  const expectedScore = 1 - prev.difficulty; // higher difficulty => lower expected success
  const actual = isCorrect ? 1 : 0;
  const difficultyEst = clamp(prev.difficulty + eloK * (expectedScore - actual), 0.05, 0.95);

  // --- 6. Error classification (feeds the Mistake Map) ---
  let errorType: ErrorType = null;
  if (!isCorrect) {
    if (speedRatio != null && speedRatio <= MODEL.RUSH_RATIO) {
      errorType = "careless"; // answered too fast to have reasoned
    } else if (speedRatio != null && speedRatio >= MODEL.SLOW_RATIO) {
      errorType = "time"; // ran long and still missed — timing/pressure issue
    } else if (pk >= 0.6) {
      errorType = "calculation"; // model thought they knew it → likely execution slip
    } else {
      errorType = "concept"; // genuine knowledge gap
    }
  }

  // --- 7. Behavioral EWMAs & counters ---
  const a = MODEL.EWMA_ALPHA;
  const ewmaAccuracy = prev.ewmaAccuracy * (1 - a) + (isCorrect ? 1 : 0) * a;
  const ewmaSpeedRatio = speedRatio != null ? prev.ewmaSpeedRatio * (1 - a) + speedRatio * a : prev.ewmaSpeedRatio;

  const errors = { ...prev.errors };
  if (errorType) errors[errorType] += 1;

  const state: SkillState = {
    pKnown,
    stability,
    difficulty: difficultyEst,
    attempts: prev.attempts + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
    streak: isCorrect ? prev.streak + 1 : 0,
    ewmaAccuracy,
    ewmaSpeedRatio,
    errors,
    lastSeenMs: nowMs,
  };

  return { state, errorType, speedRatio };
}

// -----------------------------------------------------------------------------
// Next-review scheduling (adaptive spaced repetition).
// Solve exp(-t/stability) = REVIEW_AT_RETRIEVABILITY for t (days).
// -----------------------------------------------------------------------------
export function daysUntilReview(state: SkillState): number {
  const t = -Math.log(MODEL.REVIEW_AT_RETRIEVABILITY) * state.stability;
  // Never schedule same-instant; floor at ~a few hours for very weak memories.
  return Math.max(0.1, t);
}

export function nextReviewMs(state: SkillState, nowMs: number): number {
  return nowMs + daysUntilReview(state) * 86_400_000;
}

// -----------------------------------------------------------------------------
// Confidence in a topic estimate: low attempts = low confidence. Used to weight
// topics in the readiness aggregate so 1-attempt topics don't dominate.
// -----------------------------------------------------------------------------
export function confidence(state: SkillState): number {
  // Saturating curve: ~0.4 at 1 attempt, ~0.75 at 5, ~0.9 at 12.
  return 1 - Math.exp(-state.attempts / 5);
}

// -----------------------------------------------------------------------------
// Aggregation across topics → readiness + traits for the evolving profile.
// -----------------------------------------------------------------------------
export interface TopicSnapshot {
  topic: string;
  subjectId: string;
  state: SkillState;
}

export interface ReadinessResult {
  readiness: number; // 0..100 — confidence & coverage weighted effective mastery
  confidence: number; // 0..1 — how much data backs the readiness number
  topicsTracked: number;
}

export function computeReadiness(snapshots: TopicSnapshot[], nowMs: number): ReadinessResult {
  if (!snapshots.length) return { readiness: 0, confidence: 0, topicsTracked: 0 };
  let weightedSum = 0;
  let weightTotal = 0;
  let confSum = 0;
  for (const s of snapshots) {
    const conf = confidence(s.state);
    const mastery = effectiveMastery(s.state, nowMs); // 0..1
    weightedSum += mastery * conf;
    weightTotal += conf;
    confSum += conf;
  }
  const readiness = weightTotal > 0 ? (weightedSum / weightTotal) * 100 : 0;
  return {
    readiness: Math.round(readiness),
    confidence: +(confSum / snapshots.length).toFixed(3),
    topicsTracked: snapshots.length,
  };
}

export interface LearnerTraits {
  dominantErrorType: "calculation" | "concept" | "time" | "careless" | null;
  errorBreakdown: { calculation: number; concept: number; time: number; careless: number };
  pace: "rushing" | "on-pace" | "deliberate"; // from aggregate speed ratio
  consistency: number; // 0..1 — inverse of accuracy volatility across topics
  momentum: "improving" | "steady" | "declining";
  weakestTopics: { topic: string; subjectId: string; mastery: number }[];
  strongestTopics: { topic: string; subjectId: string; mastery: number }[];
}

export function computeTraits(snapshots: TopicSnapshot[], nowMs: number): LearnerTraits {
  const totals = { calculation: 0, concept: 0, time: 0, careless: 0 };
  let speedRatioSum = 0;
  let speedN = 0;
  const accs: number[] = [];

  for (const { state } of snapshots) {
    totals.calculation += state.errors.calculation;
    totals.concept += state.errors.concept;
    totals.time += state.errors.time;
    totals.careless += state.errors.careless;
    if (state.attempts > 0) {
      speedRatioSum += state.ewmaSpeedRatio;
      speedN += 1;
      accs.push(state.ewmaAccuracy);
    }
  }

  const errorEntries = Object.entries(totals) as [keyof typeof totals, number][];
  const totalErrors = errorEntries.reduce((n, [, v]) => n + v, 0);
  const dominantErrorType = totalErrors === 0 ? null : errorEntries.sort((a, b) => b[1] - a[1])[0][0];

  const avgSpeed = speedN > 0 ? speedRatioSum / speedN : 1;
  const pace = avgSpeed <= 0.75 ? "rushing" : avgSpeed >= 1.4 ? "deliberate" : "on-pace";

  // Consistency = 1 - normalized stdev of per-topic accuracy.
  let consistency = 1;
  if (accs.length > 1) {
    const mean = accs.reduce((n, v) => n + v, 0) / accs.length;
    const variance = accs.reduce((n, v) => n + (v - mean) ** 2, 0) / accs.length;
    consistency = clamp(1 - Math.sqrt(variance) * 2, 0, 1);
  }

  const ranked = snapshots
    .filter((s) => s.state.attempts > 0)
    .map((s) => ({ topic: s.topic, subjectId: s.subjectId, mastery: Math.round(effectiveMastery(s.state, nowMs) * 100) }))
    .sort((a, b) => a.mastery - b.mastery);

  return {
    dominantErrorType,
    errorBreakdown: totals,
    pace,
    consistency: +consistency.toFixed(3),
    momentum: "steady", // refined by caller using historical readiness deltas
    weakestTopics: ranked.slice(0, 5),
    strongestTopics: ranked.slice(-5).reverse(),
  };
}
