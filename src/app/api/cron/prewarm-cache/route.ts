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
// Tuning notes (learned the hard way across three production runs):
//
//   Run 1 (BATCH=4, QUESTIONS=10): 0/8 warmed. 16 concurrent OpenRouter
//   requests per batch saturated the free tier and every race timed out.
//
//   Run 2 (BATCH=2, QUESTIONS=5): 1/8 warmed. Still 10 concurrent
//   requests per batch, plus orphan losing-race requests from the
//   previous batch still in flight when the next one fired.
//
//   Run 3 (same + round-robin exams): 2/8 warmed. Confirmed it's
//   concurrency, not prompt quality — short topics like "Indian History"
//   and "Thermodynamics" failed alongside verbose ones.
//
// So this iteration goes fully serial (BATCH=1). With ~5 concurrent
// model requests per cell (only inside the race, no cross-cell overlap),
// OpenRouter free tier behaves. Trade-off: a single all-timeout run can
// take up to 8 × 12s = 96s which exceeds the 60s maxDuration ceiling.
// We guard against that with TIME_BUDGET_MS — if elapsed time crosses
// the budget, we stop processing further cells and return whatever was
// warmed. Partial success is fine: the next scheduled run picks up the
// rest, and the response JSON tells us exactly where we stopped.
const MAX_TOPICS = 8;
const BATCH = 1;
const QUESTIONS_PER_TOPIC = 5;
const TIME_BUDGET_MS = 50_000; // stop launching new cells after this; 10s margin under maxDuration=60
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

    // Round-robin selection across exams. Naive "coldest first" sort would
    // pull every target from the same exam (the one with the most zero-count
    // cells — e.g. AFCAT with 1801 unseeded topics), which means a single
    // exam's quirks (niche terminology, verbose topic names, model
    // unfamiliarity) can lock the whole prewarmer to zero progress until that
    // exam is fully warmed. Round-robin guarantees every run touches a
    // diverse spread of exams, so a single bad exam can't monopolize.
    //
    // Within each exam, still prefer the coldest cell first.
    const byExam = new Map<string, Cell[]>();
    for (const c of cells) {
      const list = byExam.get(c.examId) || [];
      list.push(c);
      byExam.set(c.examId, list);
    }
    for (const list of byExam.values()) {
      list.sort((a, b) => a.current - b.current);
    }
    const examIds = [...byExam.keys()].sort(); // deterministic order
    const targets: Cell[] = [];
    let rrIndex = 0;
    while (targets.length < MAX_TOPICS && byExam.size > 0) {
      const examId = examIds[rrIndex % examIds.length];
      const list = byExam.get(examId);
      if (list && list.length > 0) {
        targets.push(list.shift()!);
        if (list.length === 0) {
          byExam.delete(examId);
          examIds.splice(examIds.indexOf(examId), 1);
          if (examIds.length === 0) break;
          rrIndex %= examIds.length;
          continue;
        }
      }
      rrIndex = (rrIndex + 1) % examIds.length;
    }

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

    // Strip verbose parenthetical clutter from topic names before sending
    // them to the LLM. The catalog often stores things like
    //   "Defense (Indian Air Force - History, Aircraft, Ranks, Organization; Indian Armed Forces)"
    // The parenthetical adds prompt noise and confused the smaller free
    // models in the first run. We still use the ORIGINAL `cell.topic` for
    // DB queries and inserts so cached rows stay keyed to the catalog
    // value the rest of the app expects.
    function promptTopic(t: string): string {
      const stripped = t.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
      return stripped || t;
    }

    async function warmOne(cell: Cell) {
      try {
        const questions = await generateQuiz(
          cell.examFullName,
          cell.subjectName,
          promptTopic(cell.topic),
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

    let stoppedEarly = false;
    for (let i = 0; i < targets.length; i += BATCH) {
      // Hard guard against the 60s maxDuration. If we're already past
      // TIME_BUDGET_MS, abort the loop and return what we have. The
      // remaining cells will get picked up by the next scheduled run.
      if (Date.now() - startedAt > TIME_BUDGET_MS) {
        stoppedEarly = true;
        break;
      }
      const slice = targets.slice(i, i + BATCH);
      await Promise.all(slice.map(warmOne));
    }

    return NextResponse.json({
      success: true,
      durationMs: Date.now() - startedAt,
      coldCellsRemaining: cells.length - warmed.length - failed.length,
      planned: targets.length,
      processed: warmed.length + failed.length,
      warmed: warmed.length,
      failed: failed.length,
      stoppedEarly,
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
