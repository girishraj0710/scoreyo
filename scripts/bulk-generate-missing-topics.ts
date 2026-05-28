#!/usr/bin/env tsx
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

// Configuration - aggressive for missing topics
const INITIAL_QUESTIONS_PER_TOPIC = 20; // Start with 20 questions
const BATCH_SIZE = 10;
const MAX_TOPICS_PER_RUN = 40; // Process many topics per run
const DELAY_BETWEEN_BATCHES = 2000;

interface MissingTopic {
  exam_id: string;
  exam_name: string;
  subject_id: string;
  subject_name: string;
  topic: string;
}

async function bulkGenerateMissingTopics() {
  console.log("\n🚀 BULK GENERATION - MISSING TOPICS (0 Questions)\n");
  console.log("=".repeat(80));

  // Get all defined topics from exams.ts
  const allExams = getAllExams();
  const definedTopics = new Map<string, { exam: any; subject: any; topic: string }>();

  allExams.forEach(exam => {
    exam.subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        const key = `${exam.id}|${subject.id}|${topic}`;
        definedTopics.set(key, { exam, subject, topic });
      });
    });
  });

  console.log(`\n📊 Total defined topics: ${definedTopics.size}`);

  // Get topics that already have questions
  const existingTopics = await db.execute(`
    SELECT DISTINCT exam_id, subject_id, topic
    FROM exam_questions
  `);

  const topicsWithQuestions = new Set(
    existingTopics.rows.map(r => `${r.exam_id}|${r.subject_id}|${r.topic}`)
  );

  console.log(`📊 Topics with questions: ${topicsWithQuestions.size}`);

  // Find missing topics
  const missingTopics: MissingTopic[] = [];

  for (const [key, data] of definedTopics.entries()) {
    if (!topicsWithQuestions.has(key)) {
      missingTopics.push({
        exam_id: data.exam.id,
        exam_name: data.exam.name,
        subject_id: data.subject.id,
        subject_name: data.subject.name,
        topic: data.topic,
      });
    }
  }

  console.log(`📊 Missing topics (0 questions): ${missingTopics.length}\n`);

  if (missingTopics.length === 0) {
    console.log("✅ No missing topics found!");
    return;
  }

  // Prioritize important exams first (JEE, NEET, GATE, etc.)
  const priorityExams = new Set([
    'jee-main', 'jee-advanced', 'neet-ug', 'gate',
    'cat', 'upsc-cse', 'ssc-cgl', 'ibps-po'
  ]);

  missingTopics.sort((a, b) => {
    const aPriority = priorityExams.has(a.exam_id) ? 0 : 1;
    const bPriority = priorityExams.has(b.exam_id) ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.exam_id.localeCompare(b.exam_id);
  });

  // Limit to max topics per run
  const topicsThisRun = missingTopics.slice(0, MAX_TOPICS_PER_RUN);

  console.log(`\n📋 Generation Plan:`);
  console.log(`   Topics to process: ${topicsThisRun.length}`);
  console.log(`   Questions per topic: ${INITIAL_QUESTIONS_PER_TOPIC}`);
  console.log(`   Batch size: ${BATCH_SIZE} questions\n`);

  let totalGenerated = 0;
  let totalFailed = 0;
  let processed = 0;

  for (const item of topicsThisRun) {
    processed++;
    console.log(`\n[${processed}/${topicsThisRun.length}] NEW TOPIC: ${item.exam_name} → ${item.subject_name} → ${item.topic}`);
    console.log(`   Current: 0Q | Need: ${INITIAL_QUESTIONS_PER_TOPIC}Q`);

    let generated = 0;
    const batches = Math.ceil(INITIAL_QUESTIONS_PER_TOPIC / BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const questionsThisBatch = Math.min(BATCH_SIZE, INITIAL_QUESTIONS_PER_TOPIC - generated);

      try {
        console.log(`   Generating batch ${batch + 1}/${batches} (${questionsThisBatch}Q)...`);

        // Generate questions
        const questions = await generateQuiz(
          item.exam_name,
          item.subject_name,
          item.topic,
          questionsThisBatch,
          "mixed"
        );

        // Filter out fallback questions
        const validQuestions = questions.filter(
          q => !q.question.includes("[Service Unavailable]")
        );

        if (validQuestions.length === 0) {
          console.log(`   ⚠️  No valid questions generated (service unavailable)`);
          totalFailed++;
          break;
        }

        // Insert into database
        const statements = validQuestions.map(q => ({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer,
                 explanation, difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ai-cached')`,
          args: [
            item.exam_id,
            item.subject_id,
            item.topic,
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

        console.log(`   ✅ Added ${validQuestions.length} questions (${generated}/${INITIAL_QUESTIONS_PER_TOPIC} done)`);

        // Delay between batches
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }

      } catch (error) {
        console.log(`   ❌ Error generating batch: ${error}`);
        totalFailed++;
        break;
      }
    }

    // Delay between topics
    if (processed < topicsThisRun.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  // Final summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 GENERATION SUMMARY\n");
  console.log(`   Topics processed: ${processed}`);
  console.log(`   Questions generated: ${totalGenerated}`);
  console.log(`   Failed batches: ${totalFailed}`);
  console.log(`   Success rate: ${Math.round((1 - totalFailed / processed) * 100)}%`);
  console.log(`   Remaining missing topics: ${missingTopics.length - processed}`);
  console.log("\n💡 Next steps:");
  console.log("   1. Run this script multiple times to cover all missing topics");
  console.log("   2. Run analyze-low-coverage-topics.ts to see overall progress");
  console.log("=".repeat(80) + "\n");
}

bulkGenerateMissingTopics().catch(console.error);
