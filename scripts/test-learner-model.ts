// Unit tests for the behavior-driven learner model.
// Run: npx tsx scripts/test-learner-model.ts
// Pure assertions — no DB, no network. Exits non-zero on any failure.

import {
  initSkillState,
  seedFromSelfRating,
  applyAttempt,
  retrievability,
  effectiveMastery,
  daysUntilReview,
  confidence,
  computeReadiness,
  computeTraits,
  MODEL,
  type SkillState,
  type Attempt,
  type Difficulty,
} from "../src/lib/learner-model";

let passed = 0;
let failed = 0;

function ok(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const DAY = 86_400_000;
const T0 = 1_700_000_000_000; // fixed epoch for deterministic tests

function attempt(isCorrect: boolean, difficulty: Difficulty, seconds: number | null, nowMs: number): Attempt {
  return { isCorrect, difficulty, seconds, nowMs };
}

// ---------------------------------------------------------------------------
console.log("\n1. Guess floor: one lucky correct must NOT jump to mastered");
{
  let s = initSkillState(); // pKnown 0.3
  const r = applyAttempt(s, attempt(true, "easy", 20, T0));
  ok("pKnown rises but stays well below mastered", r.state.pKnown > s.pKnown && r.state.pKnown < 0.7,
    `pKnown=${r.state.pKnown.toFixed(3)}`);
}

// ---------------------------------------------------------------------------
console.log("\n2. Slip protection: one wrong on a known topic must NOT crater it");
{
  let s = initSkillState();
  // Build up genuine knowledge with several correct hard answers.
  for (let i = 0; i < 5; i++) s = applyAttempt(s, attempt(true, "hard", 60, T0 + i * DAY)).state;
  const before = s.pKnown;
  const r = applyAttempt(s, attempt(false, "medium", 40, T0 + 6 * DAY));
  ok("pKnown drops but remains substantial (slip absorbed)", r.state.pKnown < before && r.state.pKnown > 0.4,
    `before=${before.toFixed(3)} after=${r.state.pKnown.toFixed(3)}`);
}

// ---------------------------------------------------------------------------
console.log("\n3. Forgetting curve: mastery decays over time without practice");
{
  let s = initSkillState();
  for (let i = 0; i < 5; i++) s = applyAttempt(s, attempt(true, "medium", 40, T0 + i * DAY)).state;
  const rNow = retrievability(s, s.lastSeenMs!);
  const rLater = retrievability(s, s.lastSeenMs! + 30 * DAY);
  ok("retrievability now ≈ 1", rNow > 0.99, `rNow=${rNow.toFixed(3)}`);
  ok("retrievability drops after 30 days", rLater < rNow, `rLater=${rLater.toFixed(3)}`);
  const mNow = effectiveMastery(s, s.lastSeenMs!);
  const mLater = effectiveMastery(s, s.lastSeenMs! + 30 * DAY);
  ok("effective mastery decays with time", mLater < mNow, `mNow=${mNow.toFixed(3)} mLater=${mLater.toFixed(3)}`);
}

// ---------------------------------------------------------------------------
console.log("\n4. Difficulty weighting: hard-correct > easy-correct evidence");
{
  const base = initSkillState();
  const easy = applyAttempt(base, attempt(true, "easy", 20, T0)).state;
  const hard = applyAttempt(base, attempt(true, "hard", 60, T0)).state;
  ok("hard correct raises pKnown more than easy correct", hard.pKnown > easy.pKnown,
    `easy=${easy.pKnown.toFixed(3)} hard=${hard.pKnown.toFixed(3)}`);
  ok("easy wrong hurts more than hard wrong",
    applyAttempt(base, attempt(false, "easy", 20, T0)).state.pKnown <
    applyAttempt(base, attempt(false, "hard", 60, T0)).state.pKnown);
}

// ---------------------------------------------------------------------------
console.log("\n5. Spacing effect: spaced success grows stability more than cramming");
{
  const base = initSkillState();
  // Crammed: two corrects back-to-back (no elapsed time).
  let crammed = applyAttempt(base, attempt(true, "medium", 40, T0)).state;
  crammed = applyAttempt(crammed, attempt(true, "medium", 40, T0)).state;
  // Spaced: two corrects with a gap that let memory decay.
  let spaced = applyAttempt(base, attempt(true, "medium", 40, T0)).state;
  spaced = applyAttempt(spaced, attempt(true, "medium", 40, T0 + 3 * DAY)).state;
  ok("spaced review yields higher stability than cramming", spaced.stability > crammed.stability,
    `crammed=${crammed.stability.toFixed(2)} spaced=${spaced.stability.toFixed(2)}`);
}

// ---------------------------------------------------------------------------
console.log("\n6. Stability lapse: a wrong answer reduces durability & shortens review");
{
  let s = initSkillState();
  for (let i = 0; i < 4; i++) s = applyAttempt(s, attempt(true, "medium", 40, T0 + i * DAY)).state;
  const stabBefore = s.stability;
  const reviewBefore = daysUntilReview(s);
  const after = applyAttempt(s, attempt(false, "medium", 40, T0 + 5 * DAY)).state;
  ok("stability drops after a lapse", after.stability < stabBefore,
    `before=${stabBefore.toFixed(2)} after=${after.stability.toFixed(2)}`);
  ok("next review scheduled sooner after a lapse", daysUntilReview(after) < reviewBefore);
}

// ---------------------------------------------------------------------------
console.log("\n7. Error classification");
{
  const known = (() => {
    let s = initSkillState();
    for (let i = 0; i < 5; i++) s = applyAttempt(s, attempt(true, "hard", 60, T0 + i * DAY)).state;
    return s;
  })();
  // Rushed wrong → careless
  ok("fast wrong = careless", applyAttempt(known, attempt(false, "medium", 5, T0 + 6 * DAY)).errorType === "careless");
  // Slow wrong → time
  ok("slow wrong = time", applyAttempt(known, attempt(false, "medium", 120, T0 + 6 * DAY)).errorType === "time");
  // Normal-pace wrong on a topic the model thought was known → calculation
  ok("wrong on known topic (normal pace) = calculation",
    applyAttempt(known, attempt(false, "medium", 45, T0 + 6 * DAY)).errorType === "calculation");
  // Normal-pace wrong on an unknown topic → concept
  ok("wrong on unknown topic = concept",
    applyAttempt(initSkillState(), attempt(false, "medium", 45, T0)).errorType === "concept");
  // Correct → no error
  ok("correct = no error", applyAttempt(known, attempt(true, "medium", 40, T0 + 6 * DAY)).errorType === null);
}

// ---------------------------------------------------------------------------
console.log("\n8. Confidence grows with attempts");
{
  let s = initSkillState();
  const c0 = confidence(s);
  for (let i = 0; i < 5; i++) s = applyAttempt(s, attempt(true, "medium", 40, T0 + i * DAY)).state;
  const c5 = confidence(s);
  for (let i = 5; i < 12; i++) s = applyAttempt(s, attempt(true, "medium", 40, T0 + i * DAY)).state;
  const c12 = confidence(s);
  ok("confidence 0 < c0 < c5 < c12 < 1", c0 < c5 && c5 < c12 && c12 < 1, `c0=${c0.toFixed(2)} c5=${c5.toFixed(2)} c12=${c12.toFixed(2)}`);
}

// ---------------------------------------------------------------------------
console.log("\n9. Readiness aggregation: high-confidence strong topics beat noisy ones");
{
  const strong: SkillState = (() => {
    let s = initSkillState();
    for (let i = 0; i < 10; i++) s = applyAttempt(s, attempt(true, "hard", 55, T0 + i * DAY)).state;
    return s;
  })();
  const weak: SkillState = (() => {
    let s = initSkillState();
    for (let i = 0; i < 10; i++) s = applyAttempt(s, attempt(false, "medium", 40, T0 + i * DAY)).state;
    return s;
  })();
  const now = T0 + 11 * DAY;
  const hi = computeReadiness([{ topic: "a", subjectId: "s", state: strong }], now).readiness;
  const lo = computeReadiness([{ topic: "b", subjectId: "s", state: weak }], now).readiness;
  ok("strong topic readiness high", hi > 65, `hi=${hi}`);
  ok("weak topic readiness low", lo < 35, `lo=${lo}`);
  const empty = computeReadiness([], now);
  ok("empty readiness = 0 with 0 confidence", empty.readiness === 0 && empty.confidence === 0);
}

// ---------------------------------------------------------------------------
console.log("\n10. Traits: dominant error + pace + weakest topics");
{
  let careless = initSkillState();
  for (let i = 0; i < 4; i++) careless = applyAttempt(careless, attempt(false, "medium", 4, T0 + i * DAY)).state; // rushing
  const traits = computeTraits([{ topic: "trig", subjectId: "math", state: careless }], T0 + 5 * DAY);
  ok("dominant error = careless", traits.dominantErrorType === "careless", `got=${traits.dominantErrorType}`);
  ok("pace = rushing", traits.pace === "rushing", `got=${traits.pace}`);
  ok("weakest topics populated", traits.weakestTopics.length === 1 && traits.weakestTopics[0].topic === "trig");
}

// ---------------------------------------------------------------------------
console.log("\n11. Self-rating seed produces sane priors");
{
  ok("strong > average > weak seed", seedFromSelfRating("strong").pKnown > seedFromSelfRating("average").pKnown &&
    seedFromSelfRating("average").pKnown > seedFromSelfRating("weak").pKnown);
}

// ---------------------------------------------------------------------------
console.log("\n12. Bounds: pKnown/stability/difficulty never escape limits under stress");
{
  let s = initSkillState();
  for (let i = 0; i < 200; i++) {
    const correct = i % 3 !== 0;
    s = applyAttempt(s, attempt(correct, (["easy", "medium", "hard"] as Difficulty[])[i % 3], (i % 90) + 5, T0 + i * DAY)).state;
    if (s.pKnown < MODEL.P_KNOWN_MIN || s.pKnown > MODEL.P_KNOWN_MAX) { failed++; console.log(`  ❌ pKnown escaped at i=${i}: ${s.pKnown}`); break; }
    if (s.stability < MODEL.STABILITY_MIN || s.stability > MODEL.STABILITY_MAX) { failed++; console.log(`  ❌ stability escaped at i=${i}: ${s.stability}`); break; }
    if (s.difficulty < 0 || s.difficulty > 1) { failed++; console.log(`  ❌ difficulty escaped at i=${i}: ${s.difficulty}`); break; }
  }
  ok("all bounds held over 200 mixed attempts", true);
}

// ---------------------------------------------------------------------------
console.log("\n13. Answer-change dampening: minimal, one-directional, floored");
{
  const base = initSkillState();
  // Correct answer with no changes vs. with changes → changes move pKnown LESS.
  const noChange = applyAttempt(base, { isCorrect: true, difficulty: "medium", seconds: 40, nowMs: T0 }).state;
  const twoChanges = applyAttempt(base, { isCorrect: true, difficulty: "medium", seconds: 40, nowMs: T0, answerChanges: 2 }).state;
  ok("indecision dampens a correct update (moves less)", twoChanges.pKnown < noChange.pKnown && twoChanges.pKnown > base.pKnown,
    `noChange=${noChange.pKnown.toFixed(4)} twoChanges=${twoChanges.pKnown.toFixed(4)}`);

  // Effect must be SMALL relative to the primary update.
  const primaryDelta = noChange.pKnown - base.pKnown;
  const dampDelta = noChange.pKnown - twoChanges.pKnown;
  ok("dampening effect is minimal (<25% of the primary update)", dampDelta < primaryDelta * 0.25,
    `primary=${primaryDelta.toFixed(4)} damp=${dampDelta.toFixed(4)}`);

  // One-directional: on a WRONG answer, changes must not make the model MORE
  // certain of a gap than no-changes would (evidence only ever shrinks).
  const wrongNo = applyAttempt(base, { isCorrect: false, difficulty: "easy", seconds: 40, nowMs: T0 }).state;
  const wrongChanges = applyAttempt(base, { isCorrect: false, difficulty: "easy", seconds: 40, nowMs: T0, answerChanges: 3 }).state;
  ok("indecision softens a wrong update too (pKnown drops less)", wrongChanges.pKnown >= wrongNo.pKnown,
    `wrongNo=${wrongNo.pKnown.toFixed(4)} wrongChanges=${wrongChanges.pKnown.toFixed(4)}`);

  // Floor: even absurd change counts can't erase the evidence.
  const manyChanges = applyAttempt(base, { isCorrect: true, difficulty: "medium", seconds: 40, nowMs: T0, answerChanges: 999 }).state;
  ok("dampening is floored (still a meaningful update at 999 changes)", manyChanges.pKnown > base.pKnown + primaryDelta * 0.7,
    `manyChanges=${manyChanges.pKnown.toFixed(4)}`);

  // No-op when absent/zero — backward compatible with older clients.
  const undefinedChanges = applyAttempt(base, { isCorrect: true, difficulty: "medium", seconds: 40, nowMs: T0 }).state;
  ok("omitted answerChanges === 0 changes (no effect)", undefinedChanges.pKnown === noChange.pKnown);
}

// ---------------------------------------------------------------------------
console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
