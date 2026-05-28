#!/usr/bin/env tsx
/**
 * ONE-TIME SETUP: Ensure all topics from exams.ts exist in dimensional model
 *
 * This script:
 * 1. Reads all exams/subjects/topics from exams.ts
 * 2. Ensures each exam exists in dim_exams
 * 3. Ensures each subject exists in dim_subjects
 * 4. Ensures each topic exists in dim_topics
 * 5. Creates bridge entries in bridge_exam_subject_topic
 *
 * Run this ONCE before bulk generation to ensure all mappings exist.
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
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

async function setupDimensionalModel() {
  console.log("\n🔧 DIMENSIONAL MODEL SETUP - Mapping all topics from exams.ts\n");
  console.log("=".repeat(80));

  const allExams = getAllExams();

  console.log(`\n📚 Found ${allExams.length} exams in exams.ts`);

  let examsAdded = 0;
  let examsExisting = 0;
  let subjectsAdded = 0;
  let subjectsExisting = 0;
  let topicsAdded = 0;
  let topicsExisting = 0;
  let bridgeAdded = 0;
  let bridgeExisting = 0;

  for (const exam of allExams) {
    // 1. Ensure exam exists in dim_exams
    const examCheck = await db.execute({
      sql: "SELECT id FROM dim_exams WHERE exam_code = ?",
      args: [exam.id]
    });

    let examId: number;
    if (examCheck.rows.length === 0) {
      const examInsert = await db.execute({
        sql: `INSERT INTO dim_exams (exam_code, exam_name, category)
              VALUES (?, ?, ?)
              RETURNING id`,
        args: [exam.id, exam.name, exam.category || "General"]
      });
      examId = examInsert.rows[0].id as number;
      examsAdded++;
    } else {
      examId = examCheck.rows[0].id as number;
      examsExisting++;
    }

    for (const subject of exam.subjects) {
      // 2. Ensure subject exists in dim_subjects
      const subjectCheck = await db.execute({
        sql: "SELECT id FROM dim_subjects WHERE subject_code = ?",
        args: [subject.id]
      });

      let subjectId: number;
      if (subjectCheck.rows.length === 0) {
        const subjectInsert = await db.execute({
          sql: `INSERT INTO dim_subjects (subject_code, subject_name, category)
                VALUES (?, ?, ?)
                RETURNING id`,
          args: [subject.id, subject.name, "General"]
        });
        subjectId = subjectInsert.rows[0].id as number;
        subjectsAdded++;
      } else {
        subjectId = subjectCheck.rows[0].id as number;
        subjectsExisting++;
      }

      for (const topicName of subject.topics) {
        // 3. Ensure topic exists in dim_topics
        const topicCheck = await db.execute({
          sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
          args: [topicName]
        });

        let topicId: number;
        if (topicCheck.rows.length === 0) {
          // Determine scope based on topic name and exam
          let scope: "universal" | "state-specific" | "exam-specific" = "universal";
          if (topicName.toLowerCase().includes("state") ||
              exam.id.includes("state") ||
              ["ap-eamcet", "ts-eamcet", "kcet", "mht-cet", "wbjee", "bcece", "keam"].includes(exam.id)) {
            scope = "state-specific";
          }

          // Determine category
          let category = "General";
          if (subject.id.includes("math") || subject.id.includes("quant")) {
            category = "Mathematics";
          } else if (subject.id.includes("physics")) {
            category = "Physics";
          } else if (subject.id.includes("chemistry")) {
            category = "Chemistry";
          } else if (subject.id.includes("biology")) {
            category = "Biology";
          } else if (subject.id.includes("reasoning") || subject.id.includes("logical")) {
            category = "Reasoning";
          } else if (subject.id.includes("english") || subject.id.includes("verbal")) {
            category = "English";
          } else if (subject.id.includes("gk") || subject.id.includes("gs")) {
            category = "General Knowledge";
          }

          const topicInsert = await db.execute({
            sql: `INSERT INTO dim_topics (topic_name, category, scope)
                  VALUES (?, ?, ?)
                  RETURNING id`,
            args: [topicName, category, scope]
          });
          topicId = topicInsert.rows[0].id as number;
          topicsAdded++;
        } else {
          topicId = topicCheck.rows[0].id as number;
          topicsExisting++;
        }

        // 4. Ensure bridge entry exists
        const bridgeCheck = await db.execute({
          sql: `SELECT id FROM bridge_exam_subject_topic
                WHERE exam_id = ? AND subject_id = ? AND topic_id = ?`,
          args: [examId, subjectId, topicId]
        });

        if (bridgeCheck.rows.length === 0) {
          await db.execute({
            sql: `INSERT INTO bridge_exam_subject_topic
                  (exam_id, subject_id, topic_id, is_mandatory, weightage)
                  VALUES (?, ?, ?, TRUE, 5)`,
            args: [examId, subjectId, topicId]
          });
          bridgeAdded++;
        } else {
          bridgeExisting++;
        }
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ SETUP COMPLETE\n");
  console.log("📊 Summary:");
  console.log(`  dim_exams:       ${examsAdded} added, ${examsExisting} existing`);
  console.log(`  dim_subjects:    ${subjectsAdded} added, ${subjectsExisting} existing`);
  console.log(`  dim_topics:      ${topicsAdded} added, ${topicsExisting} existing`);
  console.log(`  bridge entries:  ${bridgeAdded} added, ${bridgeExisting} existing`);
  console.log("\n✅ All topics from exams.ts are now mapped in dimensional model!");
  console.log("✅ Bulk generators can now lookup topic_id from bridge table.");
  console.log("=".repeat(80) + "\n");
}

setupDimensionalModel().catch(console.error);
