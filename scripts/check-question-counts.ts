#!/usr/bin/env tsx
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkQuestions() {
  console.log("📊 Question Count Analysis\n");

  // Count in legacy table
  const legacyCount = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  console.log(`Legacy table (exam_questions): ${legacyCount.rows[0].count}`);

  // Count in dimensional table
  const dimensionalCount = await db.execute("SELECT COUNT(*) as count FROM fact_exam_questions");
  console.log(`Dimensional table (fact_exam_questions): ${dimensionalCount.rows[0].count}`);

  // Count in cached_questions
  const cachedCount = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
  console.log(`Cached questions: ${cachedCount.rows[0].count}`);

  console.log(`\nTotal across all tables: ${Number(legacyCount.rows[0].count) + Number(dimensionalCount.rows[0].count) + Number(cachedCount.rows[0].count)}`);

  // Check for duplicate removal history
  console.log("\n🔍 Checking for recent deletions...");

  // Sample of topics with most questions
  const topTopics = await db.execute(`
    SELECT topic, COUNT(*) as count
    FROM exam_questions
    GROUP BY topic
    ORDER BY count DESC
    LIMIT 10
  `);

  console.log("\n🔥 Top 10 topics by question count (legacy):");
  for (const row of topTopics.rows) {
    console.log(`  ${row.topic}: ${row.count}`);
  }

  // Check topics with invalid names
  const invalidTopics = await db.execute(`
    SELECT topic, COUNT(*) as count
    FROM exam_questions
    WHERE topic IN ('', '1', '2', 'E', 'E1', 'E2')
    GROUP BY topic
  `);

  if (invalidTopics.rows.length > 0) {
    console.log("\n⚠️  Invalid topic names found:");
    for (const row of invalidTopics.rows) {
      console.log(`  "${row.topic}": ${row.count} questions`);
    }
  } else {
    console.log("\n✅ No invalid topic names found");
  }

  // Check exam_questions validity
  const examQuestionsWithoutTopics = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE topic IS NULL OR topic = ''
  `);
  console.log(`\nQuestions with NULL/empty topic: ${examQuestionsWithoutTopics.rows[0].count}`);
}

checkQuestions().catch(console.error);
