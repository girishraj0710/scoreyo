#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 3: Create bridge mappings (link exams to topics via subjects)
 */

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

async function main() {
  console.log("=".repeat(80));
  console.log("🔄 MIGRATION TO DIMENSIONAL MODEL - Phase 3");
  console.log("=".repeat(80));
  console.log("\nCreating bridge mappings (exam → subject → topic)...\n");

  try {
    // Extract unique exam-subject-topic combinations from existing questions
    console.log("1️⃣  Extracting exam-subject-topic combinations from exam_questions...");
    const combinations = await db.execute(`
      SELECT DISTINCT exam_id, subject_id, topic
      FROM exam_questions
      ORDER BY exam_id, subject_id, topic
    `);

    console.log(`   Found ${combinations.rows.length} unique combinations\n`);

    // Get ID mappings
    console.log("2️⃣  Loading dimension IDs...");
    const examMap = new Map<string, number>();
    const subjectMap = new Map<string, number>();
    const topicMap = new Map<string, number>();

    const exams = await db.execute(`SELECT id, exam_code FROM dim_exams`);
    exams.rows.forEach(r => examMap.set(String(r.exam_code), Number(r.id)));

    const subjects = await db.execute(`SELECT id, subject_code FROM dim_subjects`);
    subjects.rows.forEach(r => subjectMap.set(String(r.subject_code), Number(r.id)));

    const topics = await db.execute(`SELECT id, topic_name FROM dim_topics`);
    topics.rows.forEach(r => topicMap.set(String(r.topic_name), Number(r.id)));

    console.log(`   ✅ Loaded ${examMap.size} exams, ${subjectMap.size} subjects, ${topicMap.size} topics\n`);

    // Create bridge entries
    console.log("3️⃣  Creating bridge entries...");
    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of combinations.rows) {
      const examCode = String(row.exam_id);
      const subjectCode = String(row.subject_id);
      const topicName = String(row.topic);

      const examId = examMap.get(examCode);
      const subjectId = subjectMap.get(subjectCode);
      const topicId = topicMap.get(topicName);

      if (!examId || !subjectId || !topicId) {
        errors++;
        console.log(`   ⚠️  Missing ID: exam=${examCode}(${examId}), subject=${subjectCode}(${subjectId}), topic=${topicName}(${topicId})`);
        continue;
      }

      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage)
                VALUES (?, ?, ?, ?, ?)`,
          args: [examId, subjectId, topicId, 1, 5], // Default: mandatory, weightage 5
        });
        inserted++;

        if (inserted % 100 === 0) {
          console.log(`   Progress: ${inserted}/${combinations.rows.length} mappings created...`);
        }
      } catch (err: any) {
        if (err.message?.includes('UNIQUE constraint')) {
          skipped++;
        } else {
          errors++;
          console.log(`   ❌ Error: ${err.message}`);
        }
      }
    }

    console.log(`   ✅ Created ${inserted} bridge mappings\n`);
    if (skipped > 0) console.log(`   ℹ️  Skipped ${skipped} duplicates\n`);
    if (errors > 0) console.log(`   ⚠️  ${errors} errors (missing IDs)\n`);

    // Show statistics
    console.log("📊 Bridge Statistics:");

    const topicUsage = await db.execute(`
      SELECT t.topic_name, t.scope, COUNT(DISTINCT b.exam_id) as exam_count
      FROM dim_topics t
      LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
      GROUP BY t.id
      ORDER BY exam_count DESC
      LIMIT 10
    `);

    console.log("\n   Top 10 most shared topics:");
    topicUsage.rows.forEach(r => {
      console.log(`   - ${r.topic_name} (${r.scope}): used in ${r.exam_count} exams`);
    });

    const examCoverage = await db.execute(`
      SELECT e.exam_name, COUNT(DISTINCT b.topic_id) as topic_count
      FROM dim_exams e
      LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
      GROUP BY e.id
      ORDER BY topic_count DESC
      LIMIT 10
    `);

    console.log("\n   Top 10 exams by topic coverage:");
    examCoverage.rows.forEach(r => {
      console.log(`   - ${r.exam_name}: ${r.topic_count} topics`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ Phase 3 Complete: Bridge mappings created!");
    console.log("=".repeat(80));
    console.log("\nNext steps:");
    console.log("  - Run Phase 4: Migrate questions with deduplication");
    console.log("  - This is the complex phase - will deduplicate ~44K → ~25K questions");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
