import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("scoreyo-user-id")?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "No user cookie found"
      });
    }

    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    // Check recent quiz sessions
    const sessionsResult = await pool.query(
      'SELECT id, created_at FROM quiz_sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    return NextResponse.json({
      success: true,
      userId,
      userExists: userResult.rows.length > 0,
      user: userResult.rows[0] || null,
      recentSessions: sessionsResult.rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
