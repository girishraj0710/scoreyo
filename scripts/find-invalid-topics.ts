#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
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

async function findInvalidTopics() {
  console.log("\n🔍 Finding Invalid Topics...\n");
  console.log("=" .repeat(80));

  // Find topics with suspicious names (single letters, numbers, etc.)
  const result = await db.execute(`
    SELECT id, topic_name, category, scope, 
           (SELECT COUNT(*) FROM fact_exam_questions WHERE topic_id = dim_topics.id) as question_count,
           (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = dim_topics.id) as bridge_count
    FROM dim_topics
    WHERE LENGTH(topic_name) <= 3
       OR topic_name IN ('1', '2', '3', 'E', 'E1', 'E2', 'A', 'B', 'C', 'D')
       OR topic_name GLOB '[0-9]'
       OR topic_name GLOB '[0-9][0-9]'
       OR topic_name GLOB '[A-Z]'
       OR topic_name GLOB '[A-Z][0-9]'
    ORDER BY LENGTH(topic_name), topic_name
  `);

  console.log(`\n❌ Found ${result.rows.length} suspicious topics:\n`);

  const invalidTopics: Array<{id: number, name: string, questions: number, bridges: number}> = [];

  for (const row of result.rows) {
    const id = Number(row.id);
    const name = String(row.topic_name);
    const category = String(row.category);
    const scope = String(row.scope);
    const questionCount = Number(row.question_count);
    const bridgeCount = Number(row.bridge_count);

    console.log(`  ID ${id}: "${name}" (${category}, ${scope})`);
    console.log(`     Questions: ${questionCount}, Bridge mappings: ${bridgeCount}`);

    // Find which exams use this topic
    if (bridgeCount > 0) {
      const examsResult = await db.execute({
        sql: `SELECT DISTINCT e.exam_name, s.subject_name
              FROM bridge_exam_subject_topic b
              JOIN dim_exams e ON b.exam_id = e.id
              JOIN dim_subjects s ON b.subject_id = s.id
              WHERE b.topic_id = ?`,
        args: [id]
      });

      console.log(`     Used in:`);
      for (const exam of examsResult.rows) {
        console.log(`       - ${exam.exam_name} / ${exam.subject_name}`);
      }
    }

    invalidTopics.push({
      id,
      name,
      questions: questionCount,
      bridges: bridgeCount
    });

    console.log();
  }

  console.log("=" .repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`  Total invalid topics: ${invalidTopics.length}`);
  console.log(`  With questions: ${invalidTopics.filter(t => t.questions > 0).length}`);
  console.log(`  With bridge mappings: ${invalidTopics.filter(t => t.bridges > 0).length}`);
  console.log(`  Safe to delete: ${invalidTopics.filter(t => t.questions === 0 && t.bridges === 0).length}`);
  console.log();

  return invalidTopics;
}

findInvalidTopics().then(() => process.exit(0)).catch(console.error);
