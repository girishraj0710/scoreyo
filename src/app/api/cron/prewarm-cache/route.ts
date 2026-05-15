import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { generateQuiz } from "@/lib/quiz-generator";
import { getAllExams } from "@/lib/exams";

// Scheduled cache prewarmer. Walks the exam catalog, finds the (exam,
// subject, topic) cells with the LOWEST combined question count across
// `exam_questions` + `cached_questions`, and runs generateQuiz on them.
// Successful AI generations are written to `cached_questions`, which
// (via the parallel promote-questions cron) eventually flow into the
// verified `exam_questions` pool.
//
// Bounded per run by MAX_TOPICS so a single invocation fits inside the
// serverless maxDuration. The schedule runs every few hours; over a day
// the entire long tail gets warmed.
//
// Called by .github/workflows/prewarm-cache.yml:
//   GET /api/cron/prewarm-cache?secret=$CRON_SECRET

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-token-here";
// Hard caps keep one invocation bounded.
//
// Tuning notes (learned the hard way after the first production run):
//   - BATCH=4 hammered the one healthy free OpenRouter model with 4
//     concurrent generateQuiz calls (each racing 4 models = 16
//     simultaneous requests). The free tier concurrency-throttles and
//     every cell fell through to the [Service Unavailable] fallback.
//     BATCH=2 keeps concurrency manageable while still running 2 cells
//     in parallel — measured: 8 cells in ~12-15s end to end.
//   - QUESTIONS_PER_TOPIC=10 made each model emit ~2000 output tokens,
//     which inflated latency past the 12s per-model timeout. Dropping
//     to 5 matches the value scripts/test-openrouter.mjs uses (the
//     one config we know works against the live OpenRouter catalog)
//     and roughly halves per-call latency. We still chip the long
//     tail effectively: 8 cells × 5 qs × 6 runs/day = ~240 new
//     questions/day cached.
const MAX_TOPICS = 8;
const BATCH = 2;
const QUESTIONS_PER_TOPIC = 5;
// Topics already at this floor are skipped — keeps the prewarmer
// focused on the long tail instead of repeatedly topping up the same
// hot topics every run.
const TARGET_PER_TOPIC = 30;

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

    // 1) Bulk-load per-(exam, subject, topic) counts from both tables in one
    //    pass so we don't issue one query per catalog cell (~3000 cells).
    type CountMap = Map<string, number>;
    const keyOf = (e: string, s: string, t: string) =>
      `${e}|${s}|${t.toLowerCase().trim()}`;

    async function loadCounts(table: string): Promise<CountMap> {
      const m: CountMap = new Map();
      const r = await db.execute(
        `SELECT exam_id, subject_id, topic, COUNT(*) AS n FROM ${table} GROUP BY exam_id, subject_id, topic`
      );
      for (const row of r.rows) {
        m.set(
          keyOf(String(row.exam_id), String(row.subject_id), String(row.topic)),
          Number(row.n)
        );
      }
      return m;
    }

    const [examCounts, cachedCounts] = await Promise.all([
      loadCounts("exam_questions"),
      loadCounts("cached_questions"),
    ]);

    // 2) Walk the catalog and score every cell by total existing coverage.
    //    The lowest-coverage cells are the prewarm targets.
    type Cell = {
      examId: string;
      examFullName: string;
      subjectId: string;
      subjectName: string;
      topic: string;
      current: number;
    };
    const cells: Cell[] = [];
    for (const exam of getAllExams()) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          const k = keyOf(exam.id, subject.id, topic);
          const current = (examCounts.get(k) || 0) + (cachedCounts.get(k) || 0);
          if (current >= TARGET_PER_TOPIC) continue;
          cells.push({
            examId: exam.id,
            examFullName: exam.fullName,
            subjectId: subject.id,
            subjectName: subject.name,
            topic,
            current,
          });
        }
      }
    }

    // Coldest first so any single run makes the biggest dent in the long
    // tail. Ties broken by exam id for deterministic ordering.
    cells.sort((a, b) => a.current - b.current || a.examId.localeCompare(b.examId));
    const targets = cells.slice(0, MAX_TOPICS);

    if (targets.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No cold topics — every cell already at floor",
        durationMs: Date.now() - startedAt,
        target: TARGET_PER_TOPIC,
      });
    }

    // 3) Warm targets in parallel batches. Each call: generateQuiz (race of
    //    free OpenRouter models) → saveCachedQuestions if valid.
    const warmed: Array<{ examId: string; topic: string; added: number }> = [];
    const failed: Array<{ examId: string; topic: string; reason: string }> = [];

    async function warmOne(cell: Cell) {
      try {
        const questions = await generateQuiz(
          cell.examFullName,
          cell.subjectName,
          cell.topic,
          QUESTIONS_PER_TOPIC,
          "mixed"
        );
        if (
          questions.length === 0 ||
          questions[0].question.includes("[Service Unavailable]")
        ) {
          failed.push({
            examId: cell.examId,
            topic: cell.topic,
            reason: "AI returned fallback",
          });
          return;
        }

        // Inline dedupe against existing cached rows for this cell so a
        // hot rerun doesn't keep adding the same questions.
        const existing = await db.execute({
          sql:
            "SELECT question_json FROM cached_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
          args: [cell.examId, cell.subjectId, cell.topic],
        });
        const seen = new Set<string>();
        for (const r of existing.rows) {
          try {
            const q = JSON.parse(String(r.question_json));
            const k = (q?.question || "").toLowerCase().trim();
            if (k) seen.add(k);
          } catch {}
        }

        const fresh = questions.filter(
          (q) => !seen.has((q.question || "").toLowerCase().trim())
        );
        if (fresh.length === 0) {
          warmed.push({ examId: cell.examId, topic: cell.topic, added: 0 });
          return;
        }

        await db.batch(
          fresh.map((q) => ({
            sql:
              "INSERT INTO cached_questions (exam_id, subject_id, topic, difficulty, question_json) VALUES (?, ?, ?, ?, ?)",
            args: [
              cell.examId,
              cell.subjectId,
              cell.topic,
              q.difficulty || "medium",
              JSON.stringify(q),
            ],
          })),
          "write"
        );
        warmed.push({ examId: cell.examId, topic: cell.topic, added: fresh.length });
      } catch (err: any) {
        failed.push({
          examId: cell.examId,
          topic: cell.topic,
          reason: err?.message || "unknown",
        });
      }
    }

    for (let i = 0; i < targets.length; i += BATCH) {
      const slice = targets.slice(i, i + BATCH);
      await Promise.all(slice.map(warmOne));
    }

    return NextResponse.json({
      success: true,
      durationMs: Date.now() - startedAt,
      coldCellsRemaining: cells.length - warmed.length - failed.length,
      processed: targets.length,
      warmed: warmed.length,
      failed: failed.length,
      totalQuestionsAdded: warmed.reduce((s, w) => s + w.added, 0),
      details: { warmed, failed },
    });
  } catch (error: any) {
    console.error("[prewarm-cache] failed:", error);
    return NextResponse.json(
      { error: "prewarm failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
