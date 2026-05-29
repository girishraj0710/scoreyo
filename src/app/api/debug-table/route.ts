import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    // Check table structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'quiz_sessions'
      ORDER BY ordinal_position
    `);

    // Try a test insert (will rollback)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const testInsert = await client.query(`
        INSERT INTO quiz_sessions (
          id, user_id, exam_id, subject_id, topic,
          total_questions, correct_answers, time_taken_seconds
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, ['test-id', 'test-user', 'test-exam', 'test-subject', 'test-topic', 5, 3, 60]);

      await client.query('ROLLBACK');

      return NextResponse.json({
        success: true,
        columns: result.rows,
        testInsertWorks: true,
        testInsertResult: testInsert.rows[0],
      });
    } catch (insertError: any) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        columns: result.rows,
        testInsertWorks: false,
        insertError: insertError.message,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
