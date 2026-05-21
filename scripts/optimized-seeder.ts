#!/usr/bin/env tsx
/**
 * Optimized Seeder - Maximum Coverage, Minimum Cost
 *
 * Strategy:
 * 1. Prioritize EMPTY topics first (0 questions)
 * 2. Then topics with <20 questions (critical)
 * 3. Then topics with <50 questions
 * 4. Skip topics with 50+ questions (daily cron will handle)
 *
 * Cost Optimization:
 * - 20 questions per topic (4 API calls instead of 10)
 * - Smaller chunks (5 questions per call)
 * - Process empty topics in parallel (10 at a time)
 *
 * Target: Fill ALL empty topics + boost critical ones
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

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

// Optimized configuration
const QUESTIONS_PER_EMPTY_TOPIC = 30; // Empty topics get 30
const QUESTIONS_PER_LOW_TOPIC = 20;   // Low-stock (<20) get 20
const QUESTIONS_PER_MID_TOPIC = 10;   // Medium-stock (20-50) get 10
const CHUNK_SIZE = 5;                  // 5 questions per API call
const BATCH_SIZE = 10;                 // 10 topics in parallel

interface TopicInfo {
  examId: string;
  subjectId: string;
  examName: string;
  subjectName: string;
  topic: string;
  currentCount: number;
  priority: number; // 1=empty, 2=critical(<20), 3=low(<50)
}

async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function identifyPriorityTopics(): Promise<TopicInfo[]> {
  console.log("🔍 Scanning topics by priority...\n");

  const topics: TopicInfo[] = [];

  for (const category of examCategories) {
    for (const exam of category.exams) {
      console.log(`  📚 Scanning ${exam.name}...`);

      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          const result = await dbExecuteWithRetry({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          let priority = 0;
          if (count === 0) priority = 1;        // Empty - highest priority
          else if (count < 20) priority = 2;    // Critical
          else if (count < 50) priority = 3;    // Low

          if (priority > 0) {
            topics.push({
              examId: exam.id,
              subjectId: subject.id,
              examName: exam.name,
              subjectName: subject.name,
              topic,
              currentCount: count,
              priority,
            });
          }
        }
      }
    }
  }

  // Sort by priority (empty first, then critical, then low)
  topics.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.currentCount - b.currentCount; // Within same priority, lowest count first
  });

  return topics;
}

async function generateQuestionChunk(
  examName: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<any[]> {
  const prompt = `Generate exactly ${count} multiple-choice questions for ${examName} - ${subjectName} on topic: "${topic}".

CRITICAL: Questions must be exam-relevant and curriculum-aligned.

Return ONLY valid JSON array (no markdown):
[
  {
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed 50+ word explanation with reasoning",
    "difficulty": "easy|medium|hard"
  }
]`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
        "X-Title": "PrepGenie Optimized Seeder",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          { role: "system", content: "Return only valid JSON arrays." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content || "";

    // Clean markdown
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const questions = JSON.parse(content);

    // Validate
    return questions.filter((q: any) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3 &&
      q.explanation &&
      q.explanation.length >= 30 &&
      ['easy', 'medium', 'hard'].includes(q.difficulty)
    );
  } catch (error: any) {
    console.log(`  ⚠️  Generation failed: ${error.message.substring(0, 100)}`);
    return [];
  }
}

async function generateQuestions(
  examName: string,
  subjectName: string,
  topic: string,
  count: number
): Promise<any[]> {
  const chunks = Math.ceil(count / CHUNK_SIZE);
  const allQuestions: any[] = [];

  for (let i = 0; i < chunks; i++) {
    const chunkCount = Math.min(CHUNK_SIZE, count - (i * CHUNK_SIZE));
    const questions = await generateQuestionChunk(examName, subjectName, topic, chunkCount);
    allQuestions.push(...questions);

    if (i < chunks - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return allQuestions;
}

async function insertQuestions(topicInfo: TopicInfo, questions: any[]): Promise<number> {
  let inserted = 0;
  const validFrom = getCurrentSyllabusYear(topicInfo.examId);

  for (const q of questions) {
    try {
      const existing = await dbExecuteWithRetry({
        sql: `SELECT id FROM exam_questions
              WHERE exam_id = ? AND subject_id = ? AND LOWER(TRIM(question)) = LOWER(TRIM(?))`,
        args: [topicInfo.examId, topicInfo.subjectId, q.question],
      });

      if (existing.rows.length > 0) continue;

      await dbExecuteWithRetry({
        sql: `INSERT INTO exam_questions
              (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          topicInfo.examId,
          topicInfo.subjectId,
          topicInfo.topic,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          'expert-curated',
          validFrom,
          null,
        ],
      });

      inserted++;
    } catch (err) {
      // Skip duplicates
    }
  }

  return inserted;
}

async function seedTopic(topicInfo: TopicInfo): Promise<{ success: boolean; generated: number; inserted: number }> {
  const targetCount =
    topicInfo.priority === 1 ? QUESTIONS_PER_EMPTY_TOPIC :
    topicInfo.priority === 2 ? QUESTIONS_PER_LOW_TOPIC :
    QUESTIONS_PER_MID_TOPIC;

  try {
    console.log(`   🌱 ${topicInfo.examName} → ${topicInfo.topic} (${topicInfo.currentCount}Q)`);
    console.log(`   🎯 Target: +${targetCount} questions`);

    const questions = await generateQuestions(
      topicInfo.examName,
      topicInfo.subjectName,
      topicInfo.topic,
      targetCount
    );

    if (questions.length === 0) {
      console.log(`   ❌ Generation failed`);
      return { success: false, generated: 0, inserted: 0 };
    }

    console.log(`   ✅ Generated ${questions.length} questions`);
    const inserted = await insertQuestions(topicInfo, questions);
    console.log(`   💾 Inserted ${inserted} questions`);

    return { success: true, generated: questions.length, inserted };
  } catch (err: any) {
    console.log(`   ❌ Error: ${err.message}`);
    return { success: false, generated: 0, inserted: 0 };
  }
}

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 OPTIMIZED SEEDER - Maximum Coverage, Minimum Cost");
  console.log("=".repeat(80));
  console.log("");

  const topics = await identifyPriorityTopics();

  const emptyTopics = topics.filter(t => t.priority === 1);
  const criticalTopics = topics.filter(t => t.priority === 2);
  const lowTopics = topics.filter(t => t.priority === 3);

  console.log("\n📊 Priority Analysis:");
  console.log(`   Empty (0 Q):      ${emptyTopics.length} topics × 30 Q = ${emptyTopics.length * 30} questions`);
  console.log(`   Critical (<20 Q): ${criticalTopics.length} topics × 20 Q = ${criticalTopics.length * 20} questions`);
  console.log(`   Low (20-50 Q):    ${lowTopics.length} topics × 10 Q = ${lowTopics.length * 10} questions`);
  console.log(`   Total Target:     ${emptyTopics.length * 30 + criticalTopics.length * 20 + lowTopics.length * 10} questions`);

  const totalAPICalls =
    emptyTopics.length * (30 / 5) +
    criticalTopics.length * (20 / 5) +
    lowTopics.length * (10 / 5);

  console.log(`   Estimated API calls: ${totalAPICalls}`);
  console.log(`   Estimated cost: $${(totalAPICalls * 0.003).toFixed(2)}`);
  console.log("=".repeat(80));

  let totalGenerated = 0;
  let totalInserted = 0;

  // Process in batches
  const batches = [];
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    batches.push(topics.slice(i, i + BATCH_SIZE));
  }

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(`\n📦 BATCH ${batchIdx + 1}/${batches.length} (${batch.length} topics)`);

    const results = await Promise.all(batch.map(t => seedTopic(t)));

    results.forEach(r => {
      totalGenerated += r.generated;
      totalInserted += r.inserted;
    });

    console.log(`   Progress: ${totalInserted} questions inserted so far`);

    if (batchIdx < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ OPTIMIZED SEEDING COMPLETE");
  console.log("=".repeat(80));
  console.log(`Generated: ${totalGenerated} questions`);
  console.log(`Inserted: ${totalInserted} questions`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
