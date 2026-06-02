import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/fix-sequence
 * Fix PostgreSQL auto-increment sequence for fact_exam_questions
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
      console.log('[Fix Sequence] Getting max ID from fact_exam_questions...');

      // Get the current max ID
      const maxIdResult = await client.query(
        `SELECT MAX(id) as max_id FROM fact_exam_questions`
      );
      const maxId = maxIdResult.rows[0]?.max_id || 0;

      console.log('[Fix Sequence] Current max ID:', maxId);

      // Reset the sequence to max_id + 1
      const setvalResult = await client.query(
        `SELECT setval('fact_exam_questions_id_seq', $1, true)`,
        [maxId]
      );

      console.log('[Fix Sequence] Sequence reset to:', maxId + 1);

      // Verify the sequence is now correct
      const nextvalResult = await client.query(
        `SELECT nextval('fact_exam_questions_id_seq') as next_id`
      );
      const nextId = nextvalResult.rows[0]?.next_id;

      console.log('[Fix Sequence] Next ID will be:', nextId);

      return NextResponse.json({
        success: true,
        message: "Sequence fixed successfully",
        details: {
          previousMaxId: maxId,
          nextIdWillBe: nextId,
        },
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
