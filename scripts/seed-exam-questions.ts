/**
 * Seeds the `exam_questions` Turso table from two sources:
 *
 *   1) The 277 hand-verified questions in `src/lib/question-bank.ts`
 *      (source = 'verified', the highest-quality tier)
 *   2) Every row in `cached_questions` (~29.5k AI-generated questions
 *      accumulated from prior user traffic; source = 'cached')
 *
 * Why: commit bddfa36 added the table + Tier-1 reader in the quiz route but
 * never built the importer it promised. Until now the table has been empty
 * and Tier 1 of the quiz pipeline was a dead Turso roundtrip. After this
 * seed, the quiz API hits a real verified pool first.
 *
 * Behavior:
 * - Idempotent: dedupes by lowercased trimmed question text against rows
 *   already in `exam_questions`, so re-running is safe and incremental.
 * - Batched inserts (500 per batch) via the libsql batch API for speed.
 * - Reads `cached_questions` in pages of 5,000 to keep memory bounded.
 *
 * Run:
 *   npx tsx scripts/seed-exam-questions.ts
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in `.env.local`.
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { getAllVerifiedEntriesForSeed } from "../src/lib/question-bank";

// ── env loading (matches the pattern other scripts use) ─────────────
const envFile = readFileSync(".env.local", "utf-8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) envVars[key.trim()] = valueParts.join("=").trim();
});

const db = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

// Tuned for Turso's free-tier limits on long-running write sessions. With
// BATCH_SIZE=500 the libsql HTTP client started getting EPIPE / connect-timeout
// errors mid-run. Smaller batches + pacing keeps each request short and gives
// the server breathing room without materially slowing total throughput.
const BATCH_SIZE = 200;
const PAGE_SIZE = 2000;
const INTER_BATCH_DELAY_MS = 150;

type Row = {
  examId: string;
  subjectId: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  source: "verified" | "cached";
};

function normaliseKey(q: string): string {
  return (q || "").toLowerCase().trim();
}

async function loadExistingQuestionKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  let offset = 0;
  while (true) {
    const res = await withRetry(
      () =>
        db.execute({
          sql: "SELECT question FROM exam_questions LIMIT ? OFFSET ?",
          args: [PAGE_SIZE, offset],
        }),
      "loadExisting"
    );
    if (res.rows.length === 0) break;
    for (const r of res.rows) keys.add(normaliseKey(String(r.question)));
    if (res.rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return keys;
}

function fromVerifiedBank(): Row[] {
  return getAllVerifiedEntriesForSeed().map((r) => ({
    examId: r.examId,
    subjectId: r.subjectId,
    topic: r.topic,
    question: r.question,
    options: r.options,
    correctAnswer: r.correctAnswer,
    explanation: r.explanation,
    difficulty: r.difficulty,
    source: "verified" as const,
  }));
}

async function* iterateCachedQuestions(): AsyncGenerator<Row[]> {
  let offset = 0;
  while (true) {
    const res = await withRetry(
      () =>
        db.execute({
          sql:
            "SELECT exam_id, subject_id, topic, difficulty, question_json FROM cached_questions ORDER BY id LIMIT ? OFFSET ?",
          args: [PAGE_SIZE, offset],
        }),
      "iterateCached"
    );
    if (res.rows.length === 0) return;

    const batch: Row[] = [];
    for (const r of res.rows) {
      try {
        const q = JSON.parse(String(r.question_json));
        if (!q?.question || !Array.isArray(q?.options) || q.options.length < 4) continue;
        if (typeof q.correctAnswer !== "number") continue;
        batch.push({
          examId: String(r.exam_id),
          subjectId: String(r.subject_id),
          topic: String(r.topic),
          question: String(q.question),
          options: q.options.slice(0, 4).map((o: any) => String(o)),
          correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
          explanation:
            typeof q.explanation === "string"
              ? q.explanation
              : JSON.stringify(q.explanation ?? ""),
          difficulty: String(r.difficulty || q.difficulty || "medium"),
          source: "cached" as const,
        });
      } catch {
        // skip malformed rows
      }
    }
    yield batch;

    if (res.rows.length < PAGE_SIZE) return;
    offset += PAGE_SIZE;
  }
}

// Turso occasionally drops the TLS socket on large batched writes. Retry
// transient socket errors with exponential backoff so the long-running seed
// completes without manual intervention.
async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = 8): Promise<T> {
  let delay = 1500;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err?.message || String(err);
      const cause = err?.cause?.code || "";
      const transient =
        /fetch failed|socket|ECONN|ETIMEDOUT|EAI_AGAIN|UND_ERR/i.test(msg + " " + cause);
      if (!transient || i === attempts) throw err;
      console.warn(
        `\n  [${label}] attempt ${i}/${attempts} failed (${cause || msg.slice(0, 60)}), retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, 15000);
    }
  }
  throw new Error("unreachable");
}

async function insertBatch(rows: Row[]) {
  if (rows.length === 0) return;
  await withRetry(
    () =>
      db.batch(
        rows.map((r) => ({
          sql:
            "INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [
            r.examId,
            r.subjectId,
            r.topic,
            r.question,
            JSON.stringify(r.options),
            r.correctAnswer,
            r.explanation,
            r.difficulty,
            r.source,
          ],
        })),
        "write"
      ),
    "insertBatch"
  );
}

async function main() {
  console.log("=== Seeding exam_questions ===\n");

  const before = await db.execute("SELECT COUNT(*) AS n FROM exam_questions");
  console.log(`Rows in exam_questions BEFORE seed: ${before.rows[0].n}`);

  console.log("Loading existing question texts for dedupe...");
  const seen = await loadExistingQuestionKeys();
  console.log(`  ${seen.size} existing question texts loaded\n`);

  // ── 1) Verified in-memory bank ───────────────────────────
  console.log("[1/2] Importing verified in-memory bank...");
  const verifiedRows = fromVerifiedBank();
  let verifiedInserted = 0;
  let verifiedSkipped = 0;
  const pendingVerified: Row[] = [];
  for (const r of verifiedRows) {
    const k = normaliseKey(r.question);
    if (seen.has(k)) {
      verifiedSkipped++;
      continue;
    }
    seen.add(k);
    pendingVerified.push(r);
    if (pendingVerified.length >= BATCH_SIZE) {
      await insertBatch(pendingVerified.splice(0, pendingVerified.length));
      verifiedInserted += BATCH_SIZE;
      process.stdout.write(`\r  verified inserted: ${verifiedInserted}`);
    }
  }
  if (pendingVerified.length > 0) {
    const n = pendingVerified.length;
    await insertBatch(pendingVerified);
    verifiedInserted += n;
  }
  console.log(`\r  verified inserted: ${verifiedInserted}, skipped (dup): ${verifiedSkipped}\n`);

  // ── 2) Cached AI questions ───────────────────────────────
  console.log("[2/2] Importing cached_questions...");
  let cachedInserted = 0;
  let cachedSkipped = 0;
  const pending: Row[] = [];
  for await (const page of iterateCachedQuestions()) {
    for (const r of page) {
      const k = normaliseKey(r.question);
      if (seen.has(k)) {
        cachedSkipped++;
        continue;
      }
      seen.add(k);
      pending.push(r);
      if (pending.length >= BATCH_SIZE) {
        await insertBatch(pending.splice(0, pending.length));
        cachedInserted += BATCH_SIZE;
        process.stdout.write(
          `\r  cached inserted: ${cachedInserted}, skipped: ${cachedSkipped}`
        );
        // Pace requests to avoid Turso connection drops on long write sessions.
        await new Promise((r) => setTimeout(r, INTER_BATCH_DELAY_MS));
      }
    }
  }
  if (pending.length > 0) {
    const n = pending.length;
    await insertBatch(pending);
    cachedInserted += n;
  }
  console.log(
    `\r  cached inserted: ${cachedInserted}, skipped (dup or invalid): ${cachedSkipped}\n`
  );

  const after = await db.execute("SELECT COUNT(*) AS n FROM exam_questions");
  console.log(`Rows in exam_questions AFTER seed: ${after.rows[0].n}`);
  console.log(`Net added: ${Number(after.rows[0].n) - Number(before.rows[0].n)}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
