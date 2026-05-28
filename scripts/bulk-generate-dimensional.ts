#!/usr/bin/env tsx
/**
 * BULK GENERATOR - Dimensional Model Version
 *
 * Generates questions and inserts into fact_exam_questions (dimensional model)
 * Prerequisites: Run setup-dimensional-model.ts first
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateQuiz } from "../src/lib/quiz-generator";
import { getAllExams } from "../src/lib/exams";

// Load environment variables
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

// Configuration
const TARGET_QUESTIONS_PER_TOPIC = 30;
const BATCH_SIZE = 10;
const MAX_TOPICS_PER_RUN = 40;
const DELAY_BETWEEN_BATCHES = 2000;

interface TopicToGenerate {
  examCode: string;
  examName: string;
  subjectCode: string;
  subjectName: string;
  topicName: string;
  topicId: number;
  currentCount: number;
}

async function bulkGenerate() {
  console.log("\n🚀 BULK GENERATION - Dimensional Model\n");
  console.log("=".repeat(80));

  // Get topics with low question counts
  const lowTopics = await db.execute({
    sql: `
      SELECT
        b.topic_id,
        e.exam_code,
        e.exam_name,
        s.subject_code,
        s.subject_name,
        t.topic_name,
        COUNT(q.id) as question_count
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      LEFT JOIN fact_exam_questions q ON q.topic_id = b.topic_id
      GROUP BY b.topic_id, e.exam_code, e.exam_name, s.subject_code, s.subject_name, t.topic_name
      HAVING question_count < ?
      ORDER BY question_count ASC, e.exam_code
      LIMIT ?
    `,
    args: [TARGET_QUESTIONS_PER_TOPIC, MAX_TOPICS_PER_RUN]
  });

  console.log(`\n📊 Found ${lowTopics.rows.length} topics needing questions`);

  const topics: TopicToGenerate[] = lowTopics.rows.map(row => ({
    examCode: row.exam_code as string,
    examName: row.exam_name as string,
    subjectCode: row.subject_code as string,
    subjectName: row.subject_name as string,
    topicName: row.topic_name as string,
    topicId: row.topic_id as number,
    currentCount: Number(row.question_count) || 0,
  }));

  console.log(`\n📋 Generation Plan:`);
  console.log(`   Topics: ${topics.length}`);
  console.log(`   Target per topic: ${TARGET_QUESTIONS_PER_TOPIC}Q`);
  console.log(`   Batch size: ${BATCH_SIZE}Q\n`);

  let totalGenerated = 0;
  let totalFailed = 0;

  for (let i = 0; i < topics.length; i++) {
    const item = topics[i];
    const needed = TARGET_QUESTIONS_PER_TOPIC - item.currentCount;

    console.log(`\n[${i + 1}/${topics.length}] ${item.examCode} → ${item.subjectName} → ${item.topicName}`);
    console.log(`   Current: ${item.currentCount}Q | Need: ${needed}Q`);

    let generated = 0;
    const batches = Math.ceil(needed / BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const questionsThisBatch = Math.min(BATCH_SIZE, needed - generated);

      try {
        console.log(`   Generating batch ${batch + 1}/${batches} (${questionsThisBatch}Q)...`);

        const questions = await generateQuiz(
          item.examName,
          item.subjectName,
          item.topicName,
          questionsThisBatch,
          "mixed"
        );

        const validQuestions = questions.filter(
          q => !q.question.includes("[Service Unavailable]")
        );

        if (validQuestions.length === 0) {
          console.log(`   ⚠️  No valid questions generated`);
          totalFailed++;
          break;
        }

        // Insert into fact_exam_questions with topic_id
        const statements = validQuestions.map(q => ({
          sql: `INSERT INTO fact_exam_questions
                (topic_id, question, options, correct_answer, explanation,
                 difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, 'ai-cached')`,
          args: [
            item.topicId,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            typeof q.explanation === 'string' ? q.explanation : JSON.stringify(q.explanation),
            q.difficulty,
          ],
        }));

        await db.batch(statements, "write");

        generated += validQuestions.length;
        totalGenerated += validQuestions.length;

        console.log(`   ✅ Added ${validQuestions.length} questions (${item.currentCount + generated}/${TARGET_QUESTIONS_PER_TOPIC} total)`);

        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }

      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        totalFailed++;
        break;
      }
    }

    if (i < topics.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 GENERATION SUMMARY\n");
  console.log(`   Topics processed: ${topics.length}`);
  console.log(`   Questions generated: ${totalGenerated}`);
  console.log(`   Failed batches: ${totalFailed}`);
  console.log(`   Success rate: ${Math.round((1 - totalFailed / topics.length) * 100)}%`);
  console.log("=".repeat(80) + "\n");
}

bulkGenerate().catch(console.error);
