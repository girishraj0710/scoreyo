#!/usr/bin/env node
// Integration test: exercise topic_skill_state upsert + read against the real DB
// with a throwaway user, then clean up. Verifies the storage layer round-trips
// the engine's state correctly. Run: node scripts/test-learner-model-integration.mjs

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const U = '__test_learner_model__';
const EXAM = 'jee', SUBJ = 'physics', TOPIC = 'thermodynamics';

async function run() {
  const c = await pool.connect();
  let pass = 0, fail = 0;
  const ok = (n, cond) => cond ? (pass++, console.log(`  ✅ ${n}`)) : (fail++, console.log(`  ❌ ${n}`));
  try {
    await c.query('DELETE FROM topic_skill_state WHERE user_id = $1', [U]);

    // Insert
    await c.query(
      `INSERT INTO topic_skill_state
        (user_id, exam_id, subject_id, topic, p_known, stability, difficulty, attempts, correct, streak,
         ewma_accuracy, ewma_speed_ratio, err_calculation, err_concept, err_time, err_careless, last_seen, next_review)
       VALUES ($1,$2,$3,$4, 0.62, 3.4, 0.45, 5, 4, 2, 0.8, 1.1, 1, 0, 0, 1, NOW(), NOW() + interval '3 days')`,
      [U, EXAM, SUBJ, TOPIC]
    );
    let r = await c.query('SELECT * FROM topic_skill_state WHERE user_id=$1', [U]);
    ok('row inserted', r.rows.length === 1);
    ok('p_known stored', Math.abs(r.rows[0].p_known - 0.62) < 1e-4);
    ok('next_review in future', new Date(r.rows[0].next_review) > new Date());

    // Upsert conflict → update
    await c.query(
      `INSERT INTO topic_skill_state
        (user_id, exam_id, subject_id, topic, p_known, stability, difficulty, attempts, correct, streak,
         ewma_accuracy, ewma_speed_ratio, err_calculation, err_concept, err_time, err_careless, last_seen, next_review)
       VALUES ($1,$2,$3,$4, 0.81, 6.0, 0.4, 8, 7, 3, 0.9, 1.0, 1, 0, 0, 1, NOW(), NOW() + interval '5 days')
       ON CONFLICT (user_id, exam_id, subject_id, topic) DO UPDATE SET
         p_known = EXCLUDED.p_known, attempts = EXCLUDED.attempts`,
      [U, EXAM, SUBJ, TOPIC]
    );
    r = await c.query('SELECT * FROM topic_skill_state WHERE user_id=$1', [U]);
    ok('no duplicate rows after upsert', r.rows.length === 1);
    ok('p_known updated to 0.81', Math.abs(r.rows[0].p_known - 0.81) < 1e-4);
    ok('attempts updated to 8', r.rows[0].attempts === 8);

    await c.query('DELETE FROM topic_skill_state WHERE user_id = $1', [U]);
    console.log(`\n${fail === 0 ? '✅ ALL PASSED' : '❌ FAILURES'}: ${pass} passed, ${fail} failed`);
    process.exitCode = fail === 0 ? 0 : 1;
  } finally {
    c.release();
    await pool.end();
  }
}
run().catch((e) => { console.error(e); process.exit(1); });
