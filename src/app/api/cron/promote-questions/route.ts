import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

// Promote AI-cached questions to validated status within exam_questions table.
// Questions start with source='ai-cached' when first generated. This endpoint
// promotes them to source='ai-validated' after they've been in the system for
// at least MIN_AGE_DAYS and meet quality criteria.
//
// Strategy:
//   - Find ai-cached questions older than MIN_AGE_DAYS
//   - Apply quality filters (if any reports, skip)
//   - Update source='ai-cached' → source='ai-validated'
//   - Stop after MAX_PROMOTIONS to bound a single run's cost / latency
//
// Idempotent and safe to re-run on any cadence (recommended: weekly).
//
// Called by .github/workflows/promote-questions.yml:
//   GET /api/cron/promote-questions?secret=$CRON_SECRET

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-token-here";
const MAX_PROMOTIONS = 5000; // hard cap per invocation
const MIN_AGE_DAYS = 7; // questions must be this old to promote
const PAGE_SIZE = 1000;

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

    // Calculate cutoff date (questions must be older than this)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MIN_AGE_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    // 1) Find ai-cached questions that are old enough to promote
    //    and don't have any pending/unresolved reports
    const candidates: number[] = []; // Store question IDs
    let offset = 0;

    outer: while (true) {
      const res = await db.execute({
        sql: `
          SELECT eq.id
          FROM exam_questions eq
          LEFT JOIN question_reports qr ON eq.id = qr.question_id AND qr.status = 'pending'
          WHERE eq.source = 'ai-cached'
            AND eq.created_at < ?
            AND qr.id IS NULL
          ORDER BY eq.created_at ASC
          LIMIT ? OFFSET ?
        `,
        args: [cutoffISO, PAGE_SIZE, offset],
      });

      if (res.rows.length === 0) break;

      for (const r of res.rows) {
        candidates.push(Number(r.id));
        if (candidates.length >= MAX_PROMOTIONS) break outer;
      }

      if (res.rows.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    // 2) Update source field in batches
    const BATCH = 200;
    let promoted = 0;
    for (let i = 0; i < candidates.length; i += BATCH) {
      const slice = candidates.slice(i, i + BATCH);
      const placeholders = slice.map(() => "?").join(",");
      await db.execute({
        sql: `UPDATE exam_questions SET source = 'ai-validated' WHERE id IN (${placeholders})`,
        args: slice,
      });
      promoted += slice.length;
    }

    // Get final counts by source
    const stats = await db.execute(`
      SELECT source, COUNT(*) as count
      FROM exam_questions
      GROUP BY source
    `);
    const countsBySource: Record<string, number> = {};
    for (const row of stats.rows) {
      countsBySource[String(row.source)] = Number(row.count);
    }

    return NextResponse.json({
      success: true,
      durationMs: Date.now() - startedAt,
      promoted,
      countsBySource,
      capped: candidates.length >= MAX_PROMOTIONS,
      message: `Promoted ${promoted} questions from ai-cached to ai-validated`,
    });
  } catch (error: any) {
    console.error("[promote-questions] failed:", error);
    return NextResponse.json(
      { error: "promotion failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
