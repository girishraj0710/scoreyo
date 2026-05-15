/**
 * Cache pre-warmer: populates `cached_questions` for every exam/subject/topic
 * by hitting the local /api/quiz endpoint. The endpoint already saves AI
 * responses to cache (including background fills to 50 per topic), so a single
 * pass through every topic warms the entire app.
 *
 * Run while local dev server is up:
 *   node --env-file=.env.local scripts/prewarm-cache.mjs
 *
 * Flags:
 *   --exam=jee-main           Only warm a single exam
 *   --concurrency=3           Parallel requests (default 3, keep low to avoid 429s)
 *   --min-cache=10            Skip topics already at this cache size (default 10)
 *   --dry-run                 List topics that would be warmed; do not call API
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load env
const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
});

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? "true"] : [a, "true"];
  })
);

const EXAM_FILTER = args.exam || null;
const CONCURRENCY = parseInt(args.concurrency || "3", 10);
const MIN_CACHE = parseInt(args["min-cache"] || "10", 10);
const DRY_RUN = args["dry-run"] === "true";
const API_URL = process.env.PREWARM_API_URL || "http://localhost:3000/api/quiz";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Load exam catalog by parsing the compiled JS module via tsx-style import.
// Simpler: directly import via dynamic import of the TS file is not possible
// without tsx. Use a runtime fetch of the compiled module via the dev server.
async function loadExams() {
  // The catalog is large (>3000 lines). Easiest reliable way: hit a tiny
  // debug endpoint that returns it. If unavailable, fall back to direct
  // parsing of the TS source.
  try {
    const res = await fetch("http://localhost:3000/api/exams-catalog");
    if (res.ok) return await res.json();
  } catch {}
  // Fallback: read TS file and regex-extract — fragile but works for the
  // simple `id` / `name` / `subjects` / `topics` shape we care about.
  throw new Error(
    "Could not load exam catalog. Make sure dev server is running, or add /api/exams-catalog."
  );
}

async function getCacheCount(examId, subjectId, topic) {
  const r = await db.execute({
    sql: "SELECT COUNT(*) as c FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
    args: [examId, subjectId, topic],
  });
  return Number(r.rows[0]?.c ?? 0);
}

async function warmTopic(examId, subjectId, topic) {
  const started = Date.now();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        subjectId,
        topic,
        numberOfQuestions: 5,
        difficulty: "mixed",
      }),
    });
    const elapsed = Date.now() - started;
    if (!res.ok) {
      return { ok: false, elapsed, status: res.status };
    }
    const data = await res.json();
    return { ok: true, elapsed, count: data.questions?.length ?? 0 };
  } catch (err) {
    return { ok: false, elapsed: Date.now() - started, error: err.message };
  }
}

async function runWithConcurrency(tasks, n) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: n }, worker));
  return results;
}

// ─── Main ────────────────────────────────────────
const exams = await loadExams();
console.log(`Loaded ${exams.length} exams from catalog.`);

const work = [];
for (const exam of exams) {
  if (EXAM_FILTER && exam.id !== EXAM_FILTER) continue;
  for (const subject of exam.subjects ?? []) {
    for (const topic of subject.topics ?? []) {
      work.push({ examId: exam.id, subjectId: subject.id, topic });
    }
  }
}

console.log(`Total topic permutations: ${work.length}`);

// Filter to topics that need warming
const needsWarming = [];
let alreadyWarm = 0;
for (const w of work) {
  const c = await getCacheCount(w.examId, w.subjectId, w.topic);
  if (c < MIN_CACHE) needsWarming.push({ ...w, currentCache: c });
  else alreadyWarm++;
}
console.log(
  `Already warm (>= ${MIN_CACHE}): ${alreadyWarm}. Needs warming: ${needsWarming.length}.`
);

if (DRY_RUN) {
  console.log("\nDry run — first 20 topics that would be warmed:");
  for (const w of needsWarming.slice(0, 20)) {
    console.log(`  ${w.examId} / ${w.subjectId} / ${w.topic} (cache=${w.currentCache})`);
  }
  process.exit(0);
}

console.log(`\nWarming with concurrency=${CONCURRENCY}...\n`);

let done = 0;
let success = 0;
let failed = 0;

const tasks = needsWarming.map((w) => async () => {
  const r = await warmTopic(w.examId, w.subjectId, w.topic);
  done++;
  if (r.ok) {
    success++;
    process.stdout.write(
      `[${done}/${needsWarming.length}] ✓ ${w.examId}/${w.subjectId}/${w.topic} (${r.count}q, ${r.elapsed}ms)\n`
    );
  } else {
    failed++;
    process.stdout.write(
      `[${done}/${needsWarming.length}] ✗ ${w.examId}/${w.subjectId}/${w.topic} (${r.elapsed}ms, ${r.status || r.error})\n`
    );
  }
});

await runWithConcurrency(tasks, CONCURRENCY);

console.log(`\nDone. Success: ${success}, Failed: ${failed}, Total: ${done}.`);
process.exit(0);
