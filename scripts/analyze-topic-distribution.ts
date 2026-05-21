#!/usr/bin/env tsx
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  console.log('Analyzing topic distribution...\n');

  // Get distribution by question count ranges
  const distribution = await db.execute(`
    SELECT
      CASE
        WHEN cnt = 0 THEN '0'
        WHEN cnt = 1 THEN '1'
        WHEN cnt BETWEEN 2 AND 5 THEN '2-5'
        WHEN cnt BETWEEN 6 AND 10 THEN '6-10'
        WHEN cnt BETWEEN 11 AND 20 THEN '11-20'
        WHEN cnt BETWEEN 21 AND 50 THEN '21-50'
        ELSE '50+'
      END as range,
      COUNT(*) as topic_count
    FROM (
      SELECT exam_id, subject_id, topic, COUNT(*) as cnt
      FROM exam_questions
      GROUP BY exam_id, subject_id, topic
    )
    GROUP BY range
    ORDER BY
      CASE range
        WHEN '0' THEN 1
        WHEN '1' THEN 2
        WHEN '2-5' THEN 3
        WHEN '6-10' THEN 4
        WHEN '11-20' THEN 5
        WHEN '21-50' THEN 6
        ELSE 7
      END
  `);

  console.log('Topics by question count:');
  console.log('='.repeat(50));
  distribution.rows.forEach(row => {
    console.log(`  ${String(row.range).padEnd(10)} questions: ${row.topic_count} topics`);
  });

  // Get sample topics with only 1 question
  const singleQuestionTopics = await db.execute(`
    SELECT exam_id, subject_id, topic, COUNT(*) as cnt
    FROM exam_questions
    GROUP BY exam_id, subject_id, topic
    HAVING cnt = 1
    ORDER BY exam_id, subject_id, topic
    LIMIT 20
  `);

  console.log('\n\nSample topics with only 1 question:');
  console.log('='.repeat(50));
  singleQuestionTopics.rows.forEach(row => {
    console.log(`  ${row.exam_id} → ${row.subject_id} → ${row.topic}`);
  });

  // Get topics with 2-5 questions
  const lowCountTopics = await db.execute(`
    SELECT exam_id, subject_id, topic, COUNT(*) as cnt
    FROM exam_questions
    GROUP BY exam_id, subject_id, topic
    HAVING cnt BETWEEN 2 AND 5
    ORDER BY cnt ASC, exam_id, subject_id, topic
    LIMIT 20
  `);

  console.log('\n\nSample topics with 2-5 questions:');
  console.log('='.repeat(50));
  lowCountTopics.rows.forEach(row => {
    console.log(`  ${row.exam_id} → ${row.subject_id} → ${row.topic} (${row.cnt} questions)`);
  });
}

main().catch(console.error);
