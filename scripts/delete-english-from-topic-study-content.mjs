#!/usr/bin/env node

/**
 * Remove English study content from topic_study_content, leaving that table
 * exam-only. Run ONLY AFTER:
 *   1. english_study_content exists and holds the English rows (copied), and
 *   2. the app has been repointed to /api/english/study-content.
 *
 * Guard: refuses to delete unless english_study_content already contains at
 * least as many english rows as topic_study_content does, so we never delete
 * content that wasn't safely copied.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const src = await client.query(
      `SELECT COUNT(*)::int AS n FROM topic_study_content WHERE subject_id = 'english'`
    );
    const dst = await client.query(`SELECT COUNT(*)::int AS n FROM english_study_content`);
    console.log(`english rows in topic_study_content: ${src.rows[0].n}`);
    console.log(`rows in english_study_content:        ${dst.rows[0].n}`);

    if (dst.rows[0].n < src.rows[0].n) {
      throw new Error(
        'Refusing to delete: english_study_content has fewer rows than the ' +
          'english rows in topic_study_content. Run the create+copy script first.'
      );
    }

    const del = await client.query(
      `DELETE FROM topic_study_content WHERE subject_id = 'english'`
    );
    console.log(`🗑️  Deleted ${del.rowCount} english rows from topic_study_content`);

    const remaining = await client.query(
      `SELECT subject_id, COUNT(*)::int AS n FROM topic_study_content GROUP BY subject_id ORDER BY subject_id`
    );
    console.log('remaining topic_study_content rows by subject:');
    remaining.rows.forEach((r) => console.log(`   ${r.subject_id}: ${r.n}`));

    await client.query('COMMIT');
    console.log('\n✅ topic_study_content is now exam-only.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error);
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
