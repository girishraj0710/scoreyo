import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    // Check multiple table structures
    const quizSessionsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'quiz_sessions'
      ORDER BY ordinal_position
    `);

    // Check if weakness_profiles table exists
    const weaknessTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'weakness_profiles'
      )
    `);

    let weaknessColumns = [];
    if (weaknessTableExists.rows[0].exists) {
      const weaknessResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'weakness_profiles'
        ORDER BY ordinal_position
      `);
      weaknessColumns = weaknessResult.rows;
    }

    const result = quizSessionsResult;

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
        quizSessionsColumns: result.rows,
        weaknessTableExists: weaknessTableExists.rows[0].exists,
        weaknessColumns,
        testInsertWorks: true,
        testInsertResult: testInsert.rows[0],
      });
    } catch (insertError: any) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        quizSessionsColumns: result.rows,
        weaknessTableExists: weaknessTableExists.rows[0].exists,
        weaknessColumns,
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
