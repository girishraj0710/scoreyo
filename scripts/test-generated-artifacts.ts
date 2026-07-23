// Integration test: generated-artifact db helpers against the real DB with a
// throwaway user, then clean up. Verifies create → owner-scoped get → public
// slug get → list → unique slug → cascade delete for quizzes, games, mocks.
// Run: npx tsx scripts/test-generated-artifacts.ts

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
if (process.env.POSTGRES_URL && !process.env.NODE_ENV) {
  process.env.NODE_ENV = "production"; // force SSL for the Supabase pooler
}

import { randomUUID } from "crypto";
import {
  getPool,
  createGeneratedQuiz,
  createGeneratedGame,
  createGeneratedMockTest,
  getGeneratedQuiz,
  getGeneratedGame,
  getGeneratedMockTest,
  getGeneratedQuizBySlug,
  getGeneratedGameBySlug,
  getGeneratedMockTestBySlug,
  getUserGeneratedQuizzes,
  getUserGeneratedGames,
  getUserGeneratedMockTests,
} from "../src/lib/db";

let passed = 0;
let failed = 0;
function ok(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`); }
}

const USER_ID = `__test_artifacts_${randomUUID()}`;
const OTHER_ID = `__test_artifacts_other_${randomUUID()}`;

const MCQS = [
  { question: "2+2?", options: ["3", "4", "5", "6"], correctAnswer: 1, explanation: "arith" },
  { question: "Cap of France?", options: ["Rome", "Paris", "Bonn", "Bern"], correctAnswer: 1, explanation: "geo" },
];
const PAIRS = [
  { term: "Mitochondria", definition: "Powerhouse of the cell" },
  { term: "Ribosome", definition: "Protein synthesis site" },
];

async function seedUser(pool: any, id: string) {
  await pool.query(
    `INSERT INTO users (id, name, email, avatar_color) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [id, "Artifact Tester", `${id}@example.test`, "#6366f1"]
  );
}

async function run() {
  const pool = getPool();
  try {
    await seedUser(pool, USER_ID);
    await seedUser(pool, OTHER_ID);

    // --- Quiz ---------------------------------------------------------------
    console.log("\n1. createGeneratedQuiz");
    const quiz = await createGeneratedQuiz({
      userId: USER_ID, title: "Test Quiz", mode: "quiz",
      questions: MCQS, difficulty: "medium", sourceType: "text",
    });
    ok("quiz row returned with id", !!quiz.id);
    ok("question_count persisted", quiz.question_count === 2, `got ${quiz.question_count}`);
    ok("questions stored as JSON", Array.isArray(quiz.questions) && quiz.questions.length === 2);
    ok("share_slug generated (10 chars)", typeof quiz.share_slug === "string" && quiz.share_slug.length === 10);
    ok("source_type persisted", quiz.source_type === "text");

    console.log("\n2. getGeneratedQuiz is owner-scoped");
    ok("owner can fetch", !!(await getGeneratedQuiz(quiz.id, USER_ID)));
    ok("non-owner cannot fetch", (await getGeneratedQuiz(quiz.id, OTHER_ID)) === undefined);

    console.log("\n3. getGeneratedQuizBySlug is public (no owner check)");
    const bySlug = await getGeneratedQuizBySlug(quiz.share_slug);
    ok("slug resolves to same quiz", bySlug?.id === quiz.id);
    ok("unknown slug → undefined", (await getGeneratedQuizBySlug("zzzzzzzzzz")) === undefined);

    // --- Game ---------------------------------------------------------------
    console.log("\n4. createGeneratedGame");
    const game = await createGeneratedGame({
      userId: USER_ID, title: "Bio Match", gameType: "match",
      pairs: PAIRS, sourceType: "deck", sourceRef: "42",
    });
    ok("game row returned", !!game.id);
    ok("pair_count persisted", game.pair_count === 2, `got ${game.pair_count}`);
    ok("game_type persisted", game.game_type === "match");
    ok("source_ref persisted", game.source_ref === "42");
    ok("game slug distinct from quiz slug", game.share_slug !== quiz.share_slug);
    ok("game fetch by slug works", (await getGeneratedGameBySlug(game.share_slug))?.id === game.id);

    // --- Mock ---------------------------------------------------------------
    console.log("\n5. createGeneratedMockTest");
    const mock = await createGeneratedMockTest({
      userId: USER_ID, title: "Full Mock", questions: MCQS,
      durationMinutes: 45, difficulty: "hard", sourceType: "upload",
    });
    ok("mock row returned", !!mock.id);
    ok("duration persisted", mock.duration_minutes === 45, `got ${mock.duration_minutes}`);
    ok("mock fetch by slug works", (await getGeneratedMockTestBySlug(mock.share_slug))?.id === mock.id);
    ok("mock owner-scoped get", !!(await getGeneratedMockTest(mock.id, USER_ID)));

    // --- Listing ------------------------------------------------------------
    console.log("\n6. Per-user listings");
    const quizzes = await getUserGeneratedQuizzes(USER_ID);
    const games = await getUserGeneratedGames(USER_ID);
    const mocks = await getUserGeneratedMockTests(USER_ID);
    ok("user has 1 quiz", quizzes.length === 1, `got ${quizzes.length}`);
    ok("user has 1 game", games.length === 1, `got ${games.length}`);
    ok("user has 1 mock", mocks.length === 1, `got ${mocks.length}`);
    ok("other user has none", (await getUserGeneratedQuizzes(OTHER_ID)).length === 0);

    // --- Cascade delete -----------------------------------------------------
    console.log("\n7. Cascade delete on user removal");
    await pool.query("DELETE FROM users WHERE id = $1", [USER_ID]);
    ok("quizzes gone after user delete", (await getUserGeneratedQuizzes(USER_ID)).length === 0);
    ok("games gone after user delete", (await getUserGeneratedGames(USER_ID)).length === 0);
    ok("mocks gone after user delete", (await getUserGeneratedMockTests(USER_ID)).length === 0);
  } finally {
    // Teardown — remove any rows we created (users cascade to artifacts).
    const pool = getPool();
    await pool.query("DELETE FROM generated_quizzes WHERE user_id = ANY($1)", [[USER_ID, OTHER_ID]]);
    await pool.query("DELETE FROM generated_games WHERE user_id = ANY($1)", [[USER_ID, OTHER_ID]]);
    await pool.query("DELETE FROM generated_mock_tests WHERE user_id = ANY($1)", [[USER_ID, OTHER_ID]]);
    await pool.query("DELETE FROM users WHERE id = ANY($1)", [[USER_ID, OTHER_ID]]);
  }

  console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => { console.error("FATAL:", err); process.exit(1); });
