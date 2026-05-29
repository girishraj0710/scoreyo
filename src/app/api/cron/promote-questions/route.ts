import { NextRequest, NextResponse } from "next/server";
import { queryAll, execute } from "@/lib/db";

// Promote AI-generated questions to validated status within fact_exam_questions.
// Questions start with source='ai' or source='ai-cached' when first generated.
// This endpoint promotes them to source='ai-validated' after MIN_AGE_DAYS
// and no pending reports.
//
// Idempotent and safe to re-run on any cadence (recommended: weekly).
//
// Called by .github/workflows/promote-questions.yml:
//   GET /api/cron/promote-questions?secret=$CRON_SECRET

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-token-here";
const MAX_PROMOTIONS = 5000;
const MIN_AGE_DAYS = 7;
const PAGE_SIZE = 1000;

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MIN_AGE_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    // 1) Find AI-generated questions old enough to promote with no pending reports
    const candidates: number[] = [];
    let offset = 0;

    outer: while (true) {
      const res = await queryAll(
        `SELECT feq.id
         FROM fact_exam_questions feq
         LEFT JOIN question_reports qr ON feq.id = qr.question_id AND qr.status = 'pending'
         WHERE feq.source IN ('ai', 'ai-cached')
           AND feq.created_at < ?
           AND qr.id IS NULL
         ORDER BY feq.created_at ASC
         LIMIT ? OFFSET ?`,
        [cutoffISO, PAGE_SIZE, offset]
      );

      if (res.length === 0) break;

      for (const r of res) {
        candidates.push(Number(r.id));
        if (candidates.length >= MAX_PROMOTIONS) break outer;
      }

      if (res.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    // 2) Update source in batches
    const BATCH = 200;
    let promoted = 0;
    for (let i = 0; i < candidates.length; i += BATCH) {
      const slice = candidates.slice(i, i + BATCH);
      if (slice.length === 0) continue;
      const placeholders = slice.map(() => "?").join(",");
      await execute(
        `UPDATE fact_exam_questions SET source = 'ai-validated' WHERE id IN (${placeholders})`,
        slice
      );
      promoted += slice.length;
    }

    // 3) Final counts by source
    const stats = await queryAll(
      `SELECT source, COUNT(*) as count
       FROM fact_exam_questions
       GROUP BY source`
    );
    const countsBySource: Record<string, number> = {};
    for (const row of stats) {
      countsBySource[String(row.source)] = Number(row.count);
    }

    return NextResponse.json({
      success: true,
      durationMs: Date.now() - startedAt,
      promoted,
      countsBySource,
      capped: candidates.length >= MAX_PROMOTIONS,
      message: `Promoted ${promoted} questions to ai-validated in fact_exam_questions`,
    });
  } catch (error: any) {
    console.error("[promote-questions] failed:", error);
    return NextResponse.json(
      { error: "promotion failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
