#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 3.6: Fix missing exams (gate-cs, karnataka-cet, nimcet, general-knowledge)
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
  console.log("🔧 FIX MISSING EXAMS - Phase 3.6");
  console.log("=".repeat(80));
  console.log("\nFixing exam code mismatches and adding missing exams...\n");

  try {
    let updated = 0;
    let added = 0;

    // Strategy 1: Rename mismatched exam codes in exam_questions
    console.log("1️⃣  Renaming mismatched exam codes...");

    // gate-cs → gate
    const gateCount = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM exam_questions WHERE exam_id = 'gate-cs'`,
    });
    console.log(`   gate-cs: ${gateCount.rows[0].cnt} questions → renaming to 'gate'`);

    await db.execute({
      sql: `UPDATE exam_questions SET exam_id = 'gate' WHERE exam_id = 'gate-cs'`,
    });
    updated += Number(gateCount.rows[0].cnt);
    console.log(`   ✅ Renamed gate-cs → gate\n`);

    // karnataka-cet → kcet
    const kcetCount = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM exam_questions WHERE exam_id = 'karnataka-cet'`,
    });
    console.log(`   karnataka-cet: ${kcetCount.rows[0].cnt} questions → renaming to 'kcet'`);

    await db.execute({
      sql: `UPDATE exam_questions SET exam_id = 'kcet' WHERE exam_id = 'karnataka-cet'`,
    });
    updated += Number(kcetCount.rows[0].cnt);
    console.log(`   ✅ Renamed karnataka-cet → kcet\n`);

    // Strategy 2: Add missing exams
    console.log("2️⃣  Adding missing exams to dim_exams...");

    // Check if they already exist
    const nimcetExists = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM dim_exams WHERE exam_code = 'nimcet'`,
    });

    const gkExists = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM dim_exams WHERE exam_code = 'general-knowledge'`,
    });

    if (Number(nimcetExists.rows[0].cnt) === 0) {
      await db.execute({
        sql: `INSERT INTO dim_exams (exam_code, exam_name, category, conducting_body)
              VALUES ('nimcet', 'NIT MCA Common Entrance Test', 'Engineering', 'NITs')`,
      });
      added++;
      console.log(`   ✅ Added: nimcet → NIT MCA Common Entrance Test`);
    } else {
      console.log(`   ℹ️  nimcet already exists`);
    }

    if (Number(gkExists.rows[0].cnt) === 0) {
      await db.execute({
        sql: `INSERT INTO dim_exams (exam_code, exam_name, category, conducting_body)
              VALUES ('general-knowledge', 'General Knowledge Practice', 'General', 'Practice')`,
      });
      added++;
      console.log(`   ✅ Added: general-knowledge → General Knowledge Practice`);
    } else {
      console.log(`   ℹ️  general-knowledge already exists`);
    }

    console.log("");

    // Strategy 3: Create bridge mappings for all affected combinations
    console.log("3️⃣  Creating bridge mappings...");

    // Get ID mappings
    const examMap = new Map<string, number>();
    const subjectMap = new Map<string, number>();
    const topicMap = new Map<string, number>();

    const exams = await db.execute(`SELECT id, exam_code FROM dim_exams`);
    exams.rows.forEach(r => examMap.set(String(r.exam_code), Number(r.id)));

    const subjects = await db.execute(`SELECT id, subject_code FROM dim_subjects`);
    subjects.rows.forEach(r => subjectMap.set(String(r.subject_code), Number(r.id)));

    const topics = await db.execute(`SELECT id, topic_name FROM dim_topics`);
    topics.rows.forEach(r => topicMap.set(String(r.topic_name), Number(r.id)));

    // Get all unique combinations for the affected exams
    const combinations = await db.execute(`
      SELECT DISTINCT exam_id, subject_id, topic
      FROM exam_questions
      WHERE exam_id IN ('gate', 'kcet', 'nimcet', 'general-knowledge')
      ORDER BY exam_id, subject_id, topic
    `);

    console.log(`   Found ${combinations.rows.length} combinations to map\n`);

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
        if (errors <= 3) {
          console.log(`   ⚠️  Missing ID: exam=${examCode}(${examId}), subject=${subjectCode}(${subjectId}), topic=${topicName}(${topicId})`);
        }
        continue;
      }

      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage)
                VALUES (?, ?, ?, ?, ?)`,
          args: [examId, subjectId, topicId, 1, 5],
        });
        inserted++;

        if (inserted % 20 === 0) {
          console.log(`   Progress: ${inserted}/${combinations.rows.length} mappings...`);
        }
      } catch (err: any) {
        if (err.message?.includes('UNIQUE constraint')) {
          skipped++;
        } else {
          errors++;
        }
      }
    }

    console.log(`\n   ✅ Created ${inserted} bridge mappings`);
    if (skipped > 0) console.log(`   ℹ️  Skipped ${skipped} duplicates`);
    if (errors > 0) console.log(`   ⚠️  ${errors} errors (missing IDs)\n`);

    // Final statistics
    console.log("4️⃣  Final Statistics:");
    const totalExams = await db.execute(`SELECT COUNT(*) as cnt FROM dim_exams`);
    const totalSubjects = await db.execute(`SELECT COUNT(*) as cnt FROM dim_subjects`);
    const totalTopics = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics`);
    const totalBridge = await db.execute(`SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic`);

    console.log(`   Total exams: ${totalExams.rows[0].cnt}`);
    console.log(`   Total subjects: ${totalSubjects.rows[0].cnt}`);
    console.log(`   Total topics: ${totalTopics.rows[0].cnt}`);
    console.log(`   Total bridge mappings: ${totalBridge.rows[0].cnt}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ Phase 3.6 Complete: All exam codes fixed!");
    console.log("=".repeat(80));
    console.log(`\nSummary:`);
    console.log(`  - Updated ${updated} questions (renamed exam codes)`);
    console.log(`  - Added ${added} new exams`);
    console.log(`  - Created ${inserted} new bridge mappings`);
    console.log("\nNext: Phase 4 - Migrate questions with deduplication");
    console.log("");

  } catch (error: any) {
    console.error("❌ Fix failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
