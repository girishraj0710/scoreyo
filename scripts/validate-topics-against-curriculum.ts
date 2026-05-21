#!/usr/bin/env tsx
/**
 * Comprehensive Topic Validation Against Official Curriculum
 *
 * This script:
 * 1. Gets all official topics from exams.ts (current curriculum)
 * 2. Gets all topics from database (dim_topics)
 * 3. Identifies orphaned topics (no bridge mappings to any exam)
 * 4. Identifies missing topics (in curriculum but not in database)
 * 5. Identifies extra topics (in database but not in curriculum)
 * 6. Generates detailed report with recommendations
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

interface TopicInfo {
  id: number;
  name: string;
  category: string;
  scope: string;
  questionCount: number;
  bridgeCount: number;
  exams: string[];
}

async function validateTopics() {
  console.log("\n📚 COMPREHENSIVE TOPIC VALIDATION AGAINST OFFICIAL CURRICULUM\n");
  console.log("=".repeat(80));

  // Step 1: Get all official topics from exams.ts
  console.log("\n📖 Step 1: Extracting official topics from curriculum (exams.ts)...\n");

  const officialTopics = new Set<string>();
  const topicToExams = new Map<string, Set<string>>();
  let totalExams = 0;
  let totalSubjects = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      totalExams++;
      for (const subject of exam.subjects) {
        totalSubjects++;
        for (const topic of subject.topics) {
          officialTopics.add(topic);

          if (!topicToExams.has(topic)) {
            topicToExams.set(topic, new Set());
          }
          topicToExams.get(topic)!.add(exam.name);
        }
      }
    }
  }

  console.log(`  ✅ Total exams: ${totalExams}`);
  console.log(`  ✅ Total subjects: ${totalSubjects}`);
  console.log(`  ✅ Total unique official topics: ${officialTopics.size}`);

  // Step 2: Get all topics from database with their usage
  console.log("\n📊 Step 2: Analyzing topics in database...\n");

  const dbTopicsResult = await db.execute(`
    SELECT
      t.id,
      t.topic_name,
      t.category,
      t.scope,
      (SELECT COUNT(*) FROM fact_exam_questions WHERE topic_id = t.id) as question_count,
      (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = t.id) as bridge_count
    FROM dim_topics t
    ORDER BY t.topic_name
  `);

  const dbTopics = new Map<string, TopicInfo>();

  for (const row of dbTopicsResult.rows) {
    const topicName = String(row.topic_name);

    // Get exams using this topic
    const examsResult = await db.execute({
      sql: `SELECT DISTINCT e.exam_name
            FROM bridge_exam_subject_topic b
            JOIN dim_exams e ON b.exam_id = e.id
            WHERE b.topic_id = ?`,
      args: [row.id]
    });

    const exams = examsResult.rows.map(r => String(r.exam_name));

    dbTopics.set(topicName, {
      id: Number(row.id),
      name: topicName,
      category: String(row.category),
      scope: String(row.scope),
      questionCount: Number(row.question_count),
      bridgeCount: Number(row.bridge_count),
      exams
    });
  }

  console.log(`  ✅ Total topics in database: ${dbTopics.size}`);

  // Step 3: Identify orphaned topics (no bridge mappings)
  console.log("\n🔍 Step 3: Identifying orphaned topics (no exam associations)...\n");

  const orphanedTopics: TopicInfo[] = [];

  for (const [name, info] of dbTopics.entries()) {
    if (info.bridgeCount === 0) {
      orphanedTopics.push(info);
    }
  }

  console.log(`  ❌ Orphaned topics found: ${orphanedTopics.length}`);

  if (orphanedTopics.length > 0) {
    console.log("\n  Top 20 orphaned topics:\n");
    orphanedTopics.slice(0, 20).forEach(t => {
      console.log(`    - "${t.name}" (${t.category})`);
      console.log(`      Questions: ${t.questionCount}, Bridges: ${t.bridgeCount}`);
    });
    if (orphanedTopics.length > 20) {
      console.log(`    ... and ${orphanedTopics.length - 20} more`);
    }
  }

  // Step 4: Identify missing topics (in curriculum but not in database)
  console.log("\n🔍 Step 4: Identifying missing topics (in curriculum but not in DB)...\n");

  const missingTopics: Array<{name: string, exams: string[]}> = [];

  for (const topicName of officialTopics) {
    if (!dbTopics.has(topicName)) {
      const exams = Array.from(topicToExams.get(topicName) || []);
      missingTopics.push({ name: topicName, exams });
    }
  }

  console.log(`  ❌ Missing topics: ${missingTopics.length}`);

  if (missingTopics.length > 0) {
    console.log("\n  Top 20 missing topics:\n");
    missingTopics.slice(0, 20).forEach(t => {
      console.log(`    - "${t.name}"`);
      console.log(`      Used by: ${t.exams.join(", ")}`);
    });
    if (missingTopics.length > 20) {
      console.log(`    ... and ${missingTopics.length - 20} more`);
    }
  }

  // Step 5: Identify extra topics (in database but not in curriculum)
  console.log("\n🔍 Step 5: Identifying extra topics (in DB but not in curriculum)...\n");

  const extraTopics: TopicInfo[] = [];

  for (const [name, info] of dbTopics.entries()) {
    if (!officialTopics.has(name)) {
      extraTopics.push(info);
    }
  }

  console.log(`  ⚠️  Extra topics: ${extraTopics.length}`);

  if (extraTopics.length > 0) {
    console.log("\n  Categorized by usage:\n");

    const withQuestions = extraTopics.filter(t => t.questionCount > 0);
    const withBridges = extraTopics.filter(t => t.bridgeCount > 0);
    const completelyUnused = extraTopics.filter(t => t.questionCount === 0 && t.bridgeCount === 0);

    console.log(`    With questions: ${withQuestions.length}`);
    console.log(`    With bridge mappings: ${withBridges.length}`);
    console.log(`    Completely unused: ${completelyUnused.length}`);

    if (completelyUnused.length > 0) {
      console.log("\n  Top 20 completely unused topics (safe to delete):\n");
      completelyUnused.slice(0, 20).forEach(t => {
        console.log(`    - ID ${t.id}: "${t.name}" (${t.category})`);
      });
      if (completelyUnused.length > 20) {
        console.log(`    ... and ${completelyUnused.length - 20} more`);
      }
    }

    if (withQuestions.length > 0) {
      console.log("\n  Topics with questions but not in curriculum (need review):\n");
      withQuestions.slice(0, 10).forEach(t => {
        console.log(`    - ID ${t.id}: "${t.name}"`);
        console.log(`      Questions: ${t.questionCount}, Bridges: ${t.bridgeCount}`);
        console.log(`      Used by: ${t.exams.length > 0 ? t.exams.join(", ") : "None"}`);
      });
      if (withQuestions.length > 10) {
        console.log(`    ... and ${withQuestions.length - 10} more`);
      }
    }
  }

  // Step 6: Summary and recommendations
  console.log("\n" + "=".repeat(80));
  console.log("\n📊 SUMMARY\n");

  console.log("Official Curriculum (exams.ts):");
  console.log(`  - Exams: ${totalExams}`);
  console.log(`  - Subjects: ${totalSubjects}`);
  console.log(`  - Unique topics: ${officialTopics.size}\n`);

  console.log("Database (dim_topics):");
  console.log(`  - Total topics: ${dbTopics.size}`);
  console.log(`  - Topics in use (have bridges): ${dbTopics.size - orphanedTopics.length}`);
  console.log(`  - Orphaned topics (no bridges): ${orphanedTopics.length}\n`);

  console.log("Validation Results:");
  console.log(`  ✅ Topics matching curriculum: ${officialTopics.size - missingTopics.length}`);
  console.log(`  ❌ Topics missing from DB: ${missingTopics.length}`);
  console.log(`  ⚠️  Topics extra in DB: ${extraTopics.length}`);
  console.log(`  🗑️  Topics safe to delete: ${orphanedTopics.length + extraTopics.filter(t => t.questionCount === 0 && t.bridgeCount === 0).length}\n`);

  console.log("=".repeat(80));
  console.log("\n💡 RECOMMENDATIONS\n");

  if (orphanedTopics.length > 0) {
    console.log(`1. DELETE ${orphanedTopics.length} orphaned topics (no exam associations)`);
  }

  const unusedExtras = extraTopics.filter(t => t.questionCount === 0 && t.bridgeCount === 0);
  if (unusedExtras.length > 0) {
    console.log(`2. DELETE ${unusedExtras.length} unused extra topics (not in curriculum, no data)`);
  }

  if (missingTopics.length > 0) {
    console.log(`3. ADD ${missingTopics.length} missing topics to database`);
  }

  const usedExtras = extraTopics.filter(t => t.questionCount > 0 || t.bridgeCount > 0);
  if (usedExtras.length > 0) {
    console.log(`4. REVIEW ${usedExtras.length} extra topics with data (consider adding to curriculum)`);
  }

  console.log("\n=".repeat(80));
  console.log();

  return {
    orphanedTopics,
    missingTopics,
    extraTopics,
    unusedExtras,
    usedExtras
  };
}

validateTopics().then(() => process.exit(0)).catch((error) => {
  console.error("\n❌ Validation failed:", error);
  process.exit(1);
});
