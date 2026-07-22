#!/usr/bin/env node

/**
 * Create english_study_content — a dedicated table for Learn English study
 * (lesson) content, separated from exam content which stays in
 * topic_study_content.
 *
 * English and exam are distinct domains and must not mix; they relate only by
 * user_id. This mirrors how questions/progress are already separated
 * (english_questions/english_progress vs fact_exam_questions/question_attempts).
 *
 * Strategy (no blank period): CREATE the new table, COPY the existing 116
 * english rows from topic_study_content into it, and add the unique constraint
 * + lookup indexes. A SEPARATE script (delete-english-from-topic-study-content)
 * removes the english rows from topic_study_content AFTER the app is repointed.
 *
 * Idempotent: safe to re-run. Copy uses ON CONFLICT DO NOTHING so re-running
 * won't duplicate or clobber rows already in the new table.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const client = await pool.connect();
  try {
    console.log('🚀 Creating english_study_content table...\n');
    await client.query('BEGIN');

    // Mirror of topic_study_content, scoped to English study content.
    await client.query(`
      CREATE TABLE IF NOT EXISTS english_study_content (
        id SERIAL PRIMARY KEY,
        subject_id TEXT NOT NULL DEFAULT 'english',
        path_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        overview TEXT,
        content JSONB NOT NULL,
        difficulty_level TEXT,
        estimated_time_minutes INTEGER,
        prerequisites TEXT[],
        diagrams JSONB,
        videos JSONB,
        curriculum_standard TEXT,
        textbook_references TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created: english_study_content');

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS english_study_content_path_topic_key
      ON english_study_content (path_id, topic_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_english_study_content_lookup
      ON english_study_content (path_id, topic_id)
    `);
    console.log('✅ Indexes ensured');

    // Copy existing english rows so the site keeps working during the gap.
    const copy = await client.query(`
      INSERT INTO english_study_content
        (subject_id, path_id, topic_id, title, subtitle, overview, content,
         difficulty_level, estimated_time_minutes, prerequisites, diagrams,
         videos, curriculum_standard, textbook_references, created_at, updated_at)
      SELECT
         'english', path_id, topic_id, title, subtitle, overview, content,
         difficulty_level, estimated_time_minutes, prerequisites, diagrams,
         videos, curriculum_standard, textbook_references, created_at, updated_at
      FROM topic_study_content
      WHERE subject_id = 'english'
      ON CONFLICT (path_id, topic_id) DO NOTHING
    `);
    console.log(`✅ Copied ${copy.rowCount} english rows into english_study_content`);

    // Verify counts line up.
    const src = await client.query(
      `SELECT COUNT(*)::int AS n FROM topic_study_content WHERE subject_id = 'english'`
    );
    const dst = await client.query(`SELECT COUNT(*)::int AS n FROM english_study_content`);
    console.log(`   source english rows: ${src.rows[0].n}, new table rows: ${dst.rows[0].n}`);
    if (dst.rows[0].n < src.rows[0].n) {
      throw new Error('Row count mismatch after copy — aborting.');
    }

    await client.query('COMMIT');
    console.log('\n✅ Success! english_study_content ready (topic_study_content untouched).');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating english_study_content:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
