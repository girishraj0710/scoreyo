#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
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
const TARGET_QUESTIONS_PER_TOPIC = 50;
const BATCH_SIZE = 10; // Generate 10 questions at a time
const MAX_TOPICS_PER_RUN = 20; // Limit to prevent timeout
const DELAY_BETWEEN_BATCHES = 2000; // 2 second delay to avoid rate limits

interface TopicToFill {
  exam_id: string;
  exam_name: string;
  subject_id: string;
  subject_name: string;
  topic: string;
  current_count: number;
  needed: number;
}

async function bulkGenerateQuestions() {
  console.log("\n🚀 BULK QUESTION GENERATION\n");
  console.log("=".repeat(80));

  // Load analysis data
  let analysisData: any;
  try {
    const data = readFileSync('low-coverage-analysis.json', 'utf-8');
    analysisData = JSON.parse(data);
  } catch (e) {
    console.log("❌ Please run analyze-low-coverage-topics.ts first!");
    process.exit(1);
  }

  // Get exam metadata
  const allExams = getAllExams();
  const examMap = new Map(allExams.map(e => [e.id, e]));

  // Prepare topics to fill
  const topicsToFill: TopicToFill[] = [];

  for (const topic of [...analysisData.critical_topics, ...analysisData.low_topics]) {
    const exam = examMap.get(topic.exam_id);
    if (!exam) continue;

    const subject = exam.subjects.find(s => s.id === topic.subject_id);
    if (!subject) continue;

    const needed = TARGET_QUESTIONS_PER_TOPIC - topic.total;
    if (needed > 0) {
      topicsToFill.push({
        exam_id: topic.exam_id,
        exam_name: exam.name,
        subject_id: topic.subject_id,
        subject_name: subject.name,
        topic: topic.topic,
        current_count: topic.total,
        needed: Math.min(needed, TARGET_QUESTIONS_PER_TOPIC),
      });
    }
  }

  // Sort by priority (lowest count first)
  topicsToFill.sort((a, b) => a.current_count - b.current_count);

  // Limit to max topics per run
  const topicsThisRun = topicsToFill.slice(0, MAX_TOPICS_PER_RUN);

  console.log(`\n📋 Generation Plan:`);
  console.log(`   Topics to process: ${topicsThisRun.length}`);
  console.log(`   Target per topic: ${TARGET_QUESTIONS_PER_TOPIC} questions`);
  console.log(`   Batch size: ${BATCH_SIZE} questions\n`);

  let totalGenerated = 0;
  let totalFailed = 0;
  let processed = 0;

  for (const item of topicsThisRun) {
    processed++;
    console.log(`\n[${processed}/${topicsThisRun.length}] Processing: ${item.exam_name} → ${item.subject_name} → ${item.topic}`);
    console.log(`   Current: ${item.current_count}Q | Need: ${item.needed}Q`);

    let generated = 0;
    const batches = Math.ceil(item.needed / BATCH_SIZE);

    for (let batch = 0; batch < batches; batch++) {
      const questionsThisBatch = Math.min(BATCH_SIZE, item.needed - generated);

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
          break; // Skip to next topic
        }

        // Check for duplicates
        const existingQuestions = await db.execute({
          sql: `SELECT question FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
          args: [item.exam_id, item.subject_id, item.topic],
        });

        const existingTexts = new Set(
          existingQuestions.rows.map(r => String(r.question).toLowerCase().trim())
        );

        const newQuestions = validQuestions.filter(
          q => !existingTexts.has(q.question.toLowerCase().trim())
        );

        if (newQuestions.length === 0) {
          console.log(`   ℹ️  All questions were duplicates, skipping...`);
          continue;
        }

        // Insert into database
        const statements = newQuestions.map(q => ({
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

        generated += newQuestions.length;
        totalGenerated += newQuestions.length;

        console.log(`   ✅ Added ${newQuestions.length} questions (${generated}/${item.needed} done)`);

        // Delay between batches to avoid rate limits
        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }

      } catch (error) {
        console.log(`   ❌ Error generating batch: ${error}`);
        totalFailed++;
        break; // Skip to next topic
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
  console.log("\n💡 Next steps:");
  console.log("   1. Run analyze-low-coverage-topics.ts again to see progress");
  console.log("   2. Run this script again to continue filling topics");
  console.log("   3. After a week, promote good questions: promote-questions cron");
  console.log("=".repeat(80) + "\n");
}

bulkGenerateQuestions().catch(console.error);
