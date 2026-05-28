#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkProgress() {
  // Total questions
  const total = await db.execute("SELECT COUNT(*) as count FROM fact_exam_questions");
  console.log(`📊 Total questions in database: ${total.rows[0].count}`);

  // Questions by difficulty
  const byDifficulty = await db.execute(`
    SELECT difficulty, COUNT(*) as count
    FROM fact_exam_questions
    GROUP BY difficulty
  `);
  console.log(`\n📈 By difficulty:`);
  byDifficulty.rows.forEach((row: any) => {
    console.log(`   ${row.difficulty}: ${row.count}`);
  });

  // Topics with < 25 questions
  const lowTopics = await db.execute(`
    SELECT t.topic_name, COUNT(q.id) as count
    FROM dim_topics t
    LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
    GROUP BY t.topic_name
    HAVING count < 25
    ORDER BY count ASC
    LIMIT 10
  `);

  console.log(`\n⚠️  Topics needing questions (< 25):`);
  lowTopics.rows.forEach((row: any) => {
    console.log(`   ${row.topic_name}: ${row.count} questions`);
  });
}

checkProgress().catch(console.error);
