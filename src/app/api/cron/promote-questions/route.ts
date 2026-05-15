import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

// Promote new `cached_questions` rows into the verified `exam_questions`
// table. The seed script `scripts/seed-exam-questions.ts` did the initial
// bulk import; this endpoint keeps the verified pool in sync as new AI
// questions accumulate from user traffic + scheduled prewarms.
//
// Strategy:
//   - Load existing exam_questions question-text keys (lowercased, trimmed).
//   - Page through cached_questions newest-first.
//   - For each row whose text isn't already in exam_questions, insert a row.
//   - Stop after MAX_PROMOTIONS to bound a single run's cost / latency.
//
// Idempotent and safe to re-run on any cadence (recommended: weekly).
//
// Called by .github/workflows/promote-questions.yml:
//   GET /api/cron/promote-questions?secret=$CRON_SECRET

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-token-here";
const MAX_PROMOTIONS = 5000; // hard cap per invocation
const PAGE_SIZE = 1000;

function normaliseKey(q: string): string {
  return (q || "").toLowerCase().trim();
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // 1) Snapshot existing exam_questions text keys so we can dedupe.
    const seen = new Set<string>();
    let offset = 0;
    while (true) {
      const res = await db.execute({
        sql: "SELECT question FROM exam_questions LIMIT ? OFFSET ?",
        args: [PAGE_SIZE, offset],
      });
      if (res.rows.length === 0) break;
      for (const r of res.rows) seen.add(normaliseKey(String(r.question)));
      if (res.rows.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }
    const existingCount = seen.size;

    // 2) Walk cached_questions newest-first, collecting candidates whose
    //    text isn't already in exam_questions. Bounded by MAX_PROMOTIONS.
    type Candidate = {
      examId: string;
      subjectId: string;
      topic: string;
      question: string;
      options: string;
      correctAnswer: number;
      explanation: string;
      difficulty: string;
    };
    const candidates: Candidate[] = [];
    offset = 0;
    outer: while (true) {
      const res = await db.execute({
        sql:
          "SELECT exam_id, subject_id, topic, difficulty, question_json FROM cached_questions ORDER BY id DESC LIMIT ? OFFSET ?",
        args: [PAGE_SIZE, offset],
      });
      if (res.rows.length === 0) break;

      for (const r of res.rows) {
        try {
          const q = JSON.parse(String(r.question_json));
          if (!q?.question || !Array.isArray(q?.options) || q.options.length < 4) continue;
          if (typeof q.correctAnswer !== "number") continue;
          const key = normaliseKey(String(q.question));
          if (!key || seen.has(key)) continue;
          seen.add(key);

          candidates.push({
            examId: String(r.exam_id),
            subjectId: String(r.subject_id),
            topic: String(r.topic),
            question: String(q.question),
            options: JSON.stringify(q.options.slice(0, 4).map((o: any) => String(o))),
            correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
            explanation:
              typeof q.explanation === "string"
                ? q.explanation
                : JSON.stringify(q.explanation ?? ""),
            difficulty: String(r.difficulty || q.difficulty || "medium"),
          });

          if (candidates.length >= MAX_PROMOTIONS) break outer;
        } catch {
          // skip malformed row
        }
      }

      if (res.rows.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    // 3) Insert in batches via libsql.batch (bounded size to keep each
    //    HTTP call short; matches the seed script's tuning).
    const BATCH = 200;
    let inserted = 0;
    for (let i = 0; i < candidates.length; i += BATCH) {
      const slice = candidates.slice(i, i + BATCH);
      await db.batch(
        slice.map((r) => ({
          sql:
            "INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [
            r.examId,
            r.subjectId,
            r.topic,
            r.question,
            r.options,
            r.correctAnswer,
            r.explanation,
            r.difficulty,
            "cached",
          ],
        })),
        "write"
      );
      inserted += slice.length;
    }

    const after = await db.execute("SELECT COUNT(*) AS n FROM exam_questions");
    return NextResponse.json({
      success: true,
      durationMs: Date.now() - startedAt,
      existingBefore: existingCount,
      promoted: inserted,
      totalNow: Number(after.rows[0].n),
      capped: candidates.length >= MAX_PROMOTIONS,
    });
  } catch (error: any) {
    console.error("[promote-questions] failed:", error);
    return NextResponse.json(
      { error: "promotion failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
