import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

/**
 * Admin-only migration endpoint
 * POST /api/admin/migrate
 * Runs database migrations for pending_questions feature
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // For now, check for a secret key in headers
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      console.log('[Migration] Starting pending_questions migration...');

      // Step 1: Create pending_questions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS pending_questions (
          id TEXT PRIMARY KEY,

          -- Source information
          user_id TEXT NOT NULL,
          source_type TEXT NOT NULL,
          source_file TEXT,
          content_preview TEXT,

          -- AI Classification
          detected_exam_id TEXT,
          detected_subject_id TEXT,
          detected_topics TEXT,
          classification_confidence REAL,

          -- Question data
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          correct_answer INTEGER NOT NULL,
          explanation TEXT,
          trap_alerts TEXT,
          difficulty TEXT,

          -- Review workflow
          status TEXT DEFAULT 'pending',
          reviewed_by TEXT,
          reviewed_at TIMESTAMP,
          review_notes TEXT,

          -- Quality metrics
          quality_score REAL,
          duplicate_check_passed BOOLEAN DEFAULT false,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      console.log('[Migration] ✓ Created pending_questions table');

      // Step 2: Create indexes
      await client.query(`CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_questions(status)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_pending_exam ON pending_questions(detected_exam_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_pending_user ON pending_questions(user_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_pending_created ON pending_questions(created_at DESC)`);
      console.log('[Migration] ✓ Created indexes');

      // Step 3: Add contributor columns to users table
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS questions_contributed INTEGER DEFAULT 0`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS contribution_points INTEGER DEFAULT 0`);
      console.log('[Migration] ✓ Added contributor columns to users');

      // Step 4: Create contributor index
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_contribution ON users(contribution_points DESC)`);
      console.log('[Migration] ✓ Created contributor index');

      // Verify migration
      const tableCheck = await client.query(`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_name = 'pending_questions'
      `);

      const columnCheck = await client.query(`
        SELECT COUNT(*) as count
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name IN ('questions_contributed', 'contribution_points')
      `);

      console.log('[Migration] Verification:', {
        pendingQuestionsTable: tableCheck.rows[0].count === '1' ? 'exists' : 'missing',
        contributorColumns: columnCheck.rows[0].count === '2' ? 'both added' : `${columnCheck.rows[0].count}/2 added`,
      });

      return NextResponse.json({
        success: true,
        message: "Migration completed successfully",
        details: {
          pendingQuestionsTable: tableCheck.rows[0].count === '1',
          contributorColumns: parseInt(columnCheck.rows[0].count),
        },
      });

    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('[Migration] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
