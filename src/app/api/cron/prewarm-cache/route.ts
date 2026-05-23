import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/quiz-generator";
import { saveVerifiedQuestions } from "@/lib/db";
import { getAllExams } from "@/lib/exams";
import { createClient } from "@libsql/client";

// Scheduled cache prewarmer. Walks the exam catalog, finds the (exam,
// subject, topic) cells with the LOWEST question count in fact_exam_questions,
// and runs generateQuiz on them. Saves results directly to fact_exam_questions
// via saveVerifiedQuestions() (dimensional model).
//
// Called by .github/workflows/prewarm-cache.yml:
//   GET /api/cron/prewarm-cache?secret=$CRON_SECRET

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-token-here";
const MAX_TOPICS = 8;
const BATCH = 1;
const QUESTIONS_PER_TOPIC = 10;
const TIME_BUDGET_MS = 30_000;
const CELL_TIMEOUT_MS = 18_000;
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

    // 1) Load per-(exam, subject, topic) counts from dimensional model
    type CountMap = Map<string, number>;
    const keyOf = (e: string, s: string, t: string) =>
      `${e}|${s}|${t.toLowerCase().trim()}`;

    async function loadCounts(): Promise<CountMap> {
      const m: CountMap = new Map();
      const r = await db.execute(`
        SELECT
          e.exam_code as exam_id,
          s.subject_code as subject_id,
          t.topic_name as topic,
          COUNT(q.id) AS n
        FROM dim_topics t
        JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
        JOIN dim_exams e ON b.exam_id = e.id
        JOIN dim_subjects s ON b.subject_id = s.id
        LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
        GROUP BY e.exam_code, s.subject_code, t.topic_name
      `);
      for (const row of r.rows) {
        m.set(
          keyOf(String(row.exam_id), String(row.subject_id), String(row.topic)),
          Number(row.n)
        );
      }
      return m;
    }

    const examCounts = await loadCounts();

    // 2) Walk the catalog and find lowest-coverage cells
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
          const current = examCounts.get(k) || 0;
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

    // Round-robin across exams so no single exam monopolizes a run
    const byExam = new Map<string, Cell[]>();
    for (const c of cells) {
      const list = byExam.get(c.examId) || [];
      list.push(c);
      byExam.set(c.examId, list);
    }
    for (const list of byExam.values()) {
      list.sort((a, b) => a.current - b.current);
    }
    const examIds = [...byExam.keys()].sort();
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

    // 3) Warm targets serially with timeout guard
    const warmed: Array<{ examId: string; topic: string; added: number }> = [];
    const failed: Array<{ examId: string; topic: string; reason: string }> = [];

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
          failed.push({ examId: cell.examId, topic: cell.topic, reason: "AI returned fallback" });
          return;
        }

        // Save to dimensional model (fact_exam_questions)
        const added = await saveVerifiedQuestions(
          cell.examId,
          cell.subjectId,
          cell.topic,
          questions
        );
        warmed.push({ examId: cell.examId, topic: cell.topic, added: questions.length });
      } catch (err: any) {
        failed.push({ examId: cell.examId, topic: cell.topic, reason: err?.message || "unknown" });
      }
    }

    let stoppedEarly = false;
    for (let i = 0; i < targets.length; i += BATCH) {
      if (Date.now() - startedAt > TIME_BUDGET_MS) {
        stoppedEarly = true;
        break;
      }
      const slice = targets.slice(i, i + BATCH);
      await Promise.all(
        slice.map(
          (cell) =>
            new Promise<void>((resolve) => {
              let settled = false;
              const tid = setTimeout(() => {
                if (settled) return;
                settled = true;
                failed.push({ examId: cell.examId, topic: cell.topic, reason: `outer timeout ${CELL_TIMEOUT_MS}ms` });
                resolve();
              }, CELL_TIMEOUT_MS);
              warmOne(cell).finally(() => {
                if (settled) return;
                settled = true;
                clearTimeout(tid);
                resolve();
              });
            })
        )
      );
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
