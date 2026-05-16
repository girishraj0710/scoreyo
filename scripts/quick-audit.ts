#!/usr/bin/env tsx
/**
 * Quick Question Coverage Audit - Focus on Critical Issues
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
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function quickAudit() {
  console.log("=".repeat(80));
  console.log("🚀 QUICK QUESTION COVERAGE AUDIT");
  console.log("=".repeat(80));

  let totalTopics = 0;
  let emptyTopics = 0;
  let lowTopics = 0;
  let goodTopics = 0;

  const criticalGaps: Array<{exam: string, subject: string, topic: string, examId: string, subjectId: string}> = [];

  // Focus on high-priority exams first
  const priorityExams = ["jee-main", "jee-advanced", "neet-ug", "gate-cs", "upsc-prelims", "ssc-cgl"];

  for (const category of examCategories) {
    for (const exam of category.exams) {
      const isPriority = priorityExams.includes(exam.id);
      if (!isPriority) continue; // Skip non-priority for speed

      console.log(`\n📚 ${exam.name}`);

      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          totalTopics++;

          const result = await db.execute({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });

          const count = Number(result.rows[0].count);

          if (count === 0) {
            emptyTopics++;
            criticalGaps.push({
              exam: exam.name,
              subject: subject.name,
              topic,
              examId: exam.id,
              subjectId: subject.id,
            });
            console.log(`  ❌ ${topic.substring(0, 60)} (0 questions)`);
          } else if (count < 10) {
            lowTopics++;
            console.log(`  ⚠️  ${topic.substring(0, 60)} (${count} questions)`);
          } else {
            goodTopics++;
          }
        }
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total Topics Checked:  ${totalTopics}`);
  console.log(`✅ Good (≥10 Q):       ${goodTopics} (${((goodTopics/totalTopics)*100).toFixed(1)}%)`);
  console.log(`⚠️  Low (<10 Q):        ${lowTopics} (${((lowTopics/totalTopics)*100).toFixed(1)}%)`);
  console.log(`❌ Empty (0 Q):        ${emptyTopics} (${((emptyTopics/totalTopics)*100).toFixed(1)}%)`);

  console.log("\n" + "=".repeat(80));
  console.log(`🚨 CRITICAL: ${emptyTopics} Empty Topics (Will Show "AI Warming" Error)`);
  console.log("=".repeat(80));

  if (criticalGaps.length > 0) {
    criticalGaps.forEach((gap, i) => {
      console.log(`\n${i+1}. ${gap.exam} → ${gap.subject}`);
      console.log(`   Topic: ${gap.topic}`);
      console.log(`   IDs: exam_id="${gap.examId}", subject_id="${gap.subjectId}"`);
    });
  }

  // Database stats
  console.log("\n" + "=".repeat(80));
  console.log("💾 DATABASE STATS");
  console.log("=".repeat(80));

  const totalQ = await db.execute("SELECT COUNT(*) as c FROM exam_questions");
  const byExam = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count DESC
  `);

  console.log(`\nTotal Verified Questions: ${totalQ.rows[0].c}`);
  console.log(`\nQuestions by Exam:`);
  byExam.rows.forEach((r: any) => {
    console.log(`  ${r.exam_id.padEnd(20)} ${r.count}`);
  });

  console.log("\n" + "=".repeat(80));
}

quickAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Audit failed:", err);
    process.exit(1);
  });
