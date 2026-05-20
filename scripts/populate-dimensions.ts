#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 2: Populate dimension tables from existing data
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

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

// Topic categorization rules
const TOPIC_CATEGORIES: Record<string, string> = {
  'current affairs': 'general-knowledge',
  'history': 'general-knowledge',
  'geography': 'general-knowledge',
  'polity': 'general-knowledge',
  'economy': 'general-knowledge',
  'science': 'general-knowledge',
  'arithmetic': 'mathematics',
  'algebra': 'mathematics',
  'geometry': 'mathematics',
  'trigonometry': 'mathematics',
  'calculus': 'mathematics',
  'probability': 'mathematics',
  'statistics': 'mathematics',
  'mechanics': 'science',
  'thermodynamics': 'science',
  'optics': 'science',
  'electricity': 'science',
  'chemistry': 'science',
  'biology': 'science',
  'physics': 'science',
  'grammar': 'language',
  'vocabulary': 'language',
  'comprehension': 'language',
  'reasoning': 'aptitude',
  'logical': 'aptitude',
  'analytical': 'aptitude',
  'data interpretation': 'aptitude',
};

function categorizeTopic(topicName: string): string {
  const lower = topicName.toLowerCase();
  for (const [keyword, category] of Object.entries(TOPIC_CATEGORIES)) {
    if (lower.includes(keyword)) return category;
  }
  return 'general-knowledge';
}

function determineScope(topicName: string, examCount: number): string {
  const lower = topicName.toLowerCase();

  // State-specific patterns
  if (lower.includes('karnataka') || lower.includes('maharashtra') ||
      lower.includes('bengal') || lower.includes('tamil nadu') ||
      lower.includes('up ') || lower.includes('uttar pradesh') ||
      lower.includes('state gk')) {
    return 'state-specific';
  }

  // Universal topics (used in many exams)
  if (examCount >= 10) return 'universal';

  // Exam-specific topics (used in few exams)
  if (examCount <= 3) return 'exam-specific';

  return 'universal';
}

async function main() {
  console.log("=".repeat(80));
  console.log("🔄 MIGRATION TO DIMENSIONAL MODEL - Phase 2");
  console.log("=".repeat(80));
  console.log("\nPopulating dimension tables...\n");

  try {
    // 1. Populate dim_exams
    console.log("1️⃣  Populating dim_exams...");
    let examCount = 0;
    for (const category of examCategories) {
      for (const exam of category.exams) {
        try {
          await db.execute({
            sql: `INSERT OR IGNORE INTO dim_exams (exam_code, exam_name, category, conducting_body)
                  VALUES (?, ?, ?, ?)`,
            args: [exam.id, exam.name, category.name, (exam as any).conductingBody || 'N/A'],
          });
          examCount++;
        } catch {}
      }
    }
    console.log(`   ✅ Inserted ${examCount} exams\n`);

    // 2. Populate dim_subjects
    console.log("2️⃣  Populating dim_subjects...");
    const subjectsSet = new Set<string>();
    for (const category of examCategories) {
      for (const exam of category.exams) {
        for (const subject of exam.subjects) {
          subjectsSet.add(`${subject.id}::${subject.name}`);
        }
      }
    }

    let subjectCount = 0;
    for (const subjectStr of subjectsSet) {
      const [id, name] = subjectStr.split('::');
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO dim_subjects (subject_code, subject_name, category)
                VALUES (?, ?, ?)`,
          args: [id, name, 'general'],
        });
        subjectCount++;
      } catch {}
    }
    console.log(`   ✅ Inserted ${subjectCount} subjects\n`);

    // 3. Extract and populate dim_topics from existing questions
    console.log("3️⃣  Extracting unique topics from exam_questions...");

    const topicsResult = await db.execute(`
      SELECT
        topic,
        COUNT(DISTINCT exam_id) as exam_count,
        COUNT(*) as question_count
      FROM exam_questions
      GROUP BY topic
      ORDER BY exam_count DESC, question_count DESC
    `);

    console.log(`   Found ${topicsResult.rows.length} unique topics`);
    console.log("   Categorizing and inserting...\n");

    let topicCount = 0;
    for (const row of topicsResult.rows) {
      const topicName = String(row.topic);
      const examCount = Number(row.exam_count);
      const questionCount = Number(row.question_count);

      const category = categorizeTopic(topicName);
      const scope = determineScope(topicName, examCount);

      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO dim_topics (topic_name, category, scope, description)
                VALUES (?, ?, ?, ?)`,
          args: [
            topicName,
            category,
            scope,
            `Used in ${examCount} exams with ${questionCount} questions`,
          ],
        });
        topicCount++;

        if (topicCount % 100 === 0) {
          console.log(`   Processed ${topicCount}/${topicsResult.rows.length} topics...`);
        }
      } catch {}
    }
    console.log(`   ✅ Inserted ${topicCount} topics\n`);

    // 4. Show statistics
    console.log("📊 Statistics:");
    const universalTopics = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics WHERE scope = 'universal'`);
    const stateTopics = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics WHERE scope = 'state-specific'`);
    const examTopics = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics WHERE scope = 'exam-specific'`);

    console.log(`   Universal topics: ${universalTopics.rows[0].cnt}`);
    console.log(`   State-specific topics: ${stateTopics.rows[0].cnt}`);
    console.log(`   Exam-specific topics: ${examTopics.rows[0].cnt}`);
    console.log("");

    // 5. Show sample universal topics
    const sampleTopics = await db.execute(`
      SELECT topic_name, category, scope
      FROM dim_topics
      WHERE scope = 'universal'
      ORDER BY id
      LIMIT 10
    `);

    console.log("📝 Sample Universal Topics:");
    sampleTopics.rows.forEach(row => {
      console.log(`   - ${row.topic_name} (${row.category})`);
    });
    console.log("");

    console.log("=".repeat(80));
    console.log("✅ Phase 2 Complete: Dimensions populated!");
    console.log("=".repeat(80));
    console.log("\nNext steps:");
    console.log("  - Run Phase 3: Create bridge mappings (link exams to topics)");
    console.log("  - Run Phase 4: Migrate questions with deduplication");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
