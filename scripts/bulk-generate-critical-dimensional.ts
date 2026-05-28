#!/usr/bin/env tsx
/**
 * BULK GENERATOR - Fill topics with 0 questions ONLY
 * Uses dimensional model properly
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { generateQuiz } from "../src/lib/quiz-generator";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const INITIAL_QUESTIONS = 20; // Start with 20Q per zero-question topic
const BATCH_SIZE = 10;
const MAX_TOPICS = 40;
const DELAY = 2000;

async function generate() {
  console.log("\n🚀 BULK GENERATION - Zero Question Topics (Dimensional Model)\n");
  console.log("=".repeat(80));

  const zeroTopics = await db.execute({
    sql: `
      SELECT
        b.topic_id,
        e.exam_code,
        e.exam_name,
        s.subject_name,
        t.topic_name,
        COUNT(q.id) as q_count
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      LEFT JOIN fact_exam_questions q ON q.topic_id = b.topic_id
      GROUP BY b.topic_id, e.exam_code, e.exam_name, s.subject_name, t.topic_name
      HAVING q_count = 0
      ORDER BY e.exam_code
      LIMIT ?
    `,
    args: [MAX_TOPICS]
  });

  console.log(`\n📊 Found ${zeroTopics.rows.length} topics with 0 questions`);
  console.log(`📋 Target: ${INITIAL_QUESTIONS}Q per topic\n`);

  let totalGenerated = 0;
  let totalFailed = 0;

  for (let i = 0; i < zeroTopics.rows.length; i++) {
    const row = zeroTopics.rows[i];
    console.log(`\n[${i + 1}/${zeroTopics.rows.length}] ${row.exam_code} > ${row.subject_name} > ${row.topic_name}`);

    let generated = 0;
    const batches = Math.ceil(INITIAL_QUESTIONS / BATCH_SIZE);

    for (let b = 0; b < batches; b++) {
      const qNeeded = Math.min(BATCH_SIZE, INITIAL_QUESTIONS - generated);

      try {
        console.log(`   Batch ${b + 1}/${batches} (${qNeeded}Q)...`);

        const questions = await generateQuiz(
          row.exam_name as string,
          row.subject_name as string,
          row.topic_name as string,
          qNeeded,
          "mixed"
        );

        const valid = questions.filter(q => !q.question.includes("[Service Unavailable]"));
        if (valid.length === 0) {
          console.log(`   ⚠️  No valid questions`);
          totalFailed++;
          break;
        }

        const statements = valid.map(q => ({
          sql: `INSERT INTO fact_exam_questions
                (topic_id, question, options, correct_answer, explanation, difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, 'ai-cached')`,
          args: [
            row.topic_id,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            typeof q.explanation === 'string' ? q.explanation : JSON.stringify(q.explanation),
            q.difficulty,
          ],
        }));

        await db.batch(statements, "write");
        generated += valid.length;
        totalGenerated += valid.length;

        console.log(`   ✅ Added ${valid.length}Q (${generated}/${INITIAL_QUESTIONS})`);

        if (b < batches - 1) await new Promise(r => setTimeout(r, DELAY));

      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        totalFailed++;
        break;
      }
    }

    if (i < zeroTopics.rows.length - 1) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 SUMMARY\n");
  console.log(`   Topics processed: ${zeroTopics.rows.length}`);
  console.log(`   Questions generated: ${totalGenerated}`);
  console.log(`   Failed batches: ${totalFailed}`);
  console.log(`   Cost estimate: $${(totalGenerated * 0.00015).toFixed(2)}`);
  console.log("=".repeat(80) + "\n");
}

generate().catch(console.error);
