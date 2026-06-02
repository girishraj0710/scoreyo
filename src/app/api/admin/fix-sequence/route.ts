import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/fix-sequence
 * Fix PostgreSQL auto-increment sequences for all tables
 */
export async function POST(request: NextRequest) {
  try {
    // Check for admin secret
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');

    if (secretParam !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const results: Record<string, any> = {};

      // Fix all known sequences
      const sequences = [
        { table: 'fact_exam_questions', column: 'id', sequence: 'fact_exam_questions_id_seq' },
        { table: 'dim_topics', column: 'id', sequence: 'dim_topics_id_seq' },
        { table: 'dim_exams', column: 'id', sequence: 'dim_exams_id_seq' },
        { table: 'dim_subjects', column: 'id', sequence: 'dim_subjects_id_seq' },
        { table: 'bridge_exam_subject_topic', column: 'id', sequence: 'bridge_exam_subject_topic_id_seq' },
      ];

      for (const seq of sequences) {
        try {
          // Get the current max ID
          const maxIdResult = await client.query(
            `SELECT COALESCE(MAX(${seq.column}), 0) as max_id FROM ${seq.table}`
          );
          const maxId = maxIdResult.rows[0]?.max_id || 0;

          // Reset the sequence
          await client.query(
            `SELECT setval('${seq.sequence}', $1, true)`,
            [maxId]
          );

          results[seq.table] = {
            success: true,
            maxId,
            nextIdWillBe: maxId + 1,
          };

          console.log(`[Fix Sequence] ${seq.table}: max=${maxId}, next=${maxId + 1}`);
        } catch (seqError: any) {
          // Sequence might not exist for this table
          results[seq.table] = {
            success: false,
            error: seqError.message,
          };
          console.warn(`[Fix Sequence] ${seq.table} skipped:`, seqError.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: "All sequences fixed",
        results,
      });

    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('[Fix Sequence] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}
