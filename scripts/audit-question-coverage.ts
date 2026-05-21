#!/usr/bin/env tsx
/**
 * Comprehensive Question Bank Coverage Audit
 *
 * Analyzes:
 * 1. All exam/subject/topic combinations from exams.ts
 * 2. Question count in database for each topic
 * 3. Identifies gaps (0 questions = will fail like Semiconductors)
 * 4. Cache coverage analysis
 * 5. Performance recommendations
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

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

interface TopicCoverage {
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  verifiedCount: number;
  cachedCount: number;
  status: "✅ Good" | "⚠️ Low" | "❌ Empty";
}

interface ExamStats {
  examId: string;
  examName: string;
  totalTopics: number;
  coveredTopics: number;
  emptyTopics: number;
  lowTopics: number;
  totalQuestions: number;
}

async function auditCoverage() {
  console.log("\n" + "=".repeat(80));
  console.log("📊 QUESTION BANK COVERAGE AUDIT");
  console.log("=".repeat(80));
  console.log(`Date: ${new Date().toISOString()}`);
  console.log("=".repeat(80));

  const allTopics: TopicCoverage[] = [];
  const examStats: ExamStats[] = [];

  // Iterate through all exams from exams.ts
  for (const category of examCategories) {
    for (const exam of category.exams) {
      console.log(`\n📚 Analyzing: ${exam.name} (${exam.id})`);

      let examTotalTopics = 0;
      let examCoveredTopics = 0;
      let examEmptyTopics = 0;
      let examLowTopics = 0;
      let examTotalQuestions = 0;

      for (const subject of exam.subjects) {
        console.log(`  📖 Subject: ${subject.name} (${subject.id})`);

        for (const topic of subject.topics) {
          examTotalTopics++;

          // Check verified questions (exam_questions table)
          const verifiedResult = await db.execute({
            sql: `SELECT COUNT(*) as count FROM exam_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });
          const verifiedCount = Number(verifiedResult.rows[0].count);

          // Check cached questions
          const cachedResult = await db.execute({
            sql: `SELECT COUNT(*) as count FROM cached_questions
                  WHERE exam_id = ? AND subject_id = ? AND topic = ?`,
            args: [exam.id, subject.id, topic],
          });
          const cachedCount = Number(cachedResult.rows[0].count);

          const totalCount = verifiedCount + cachedCount;
          examTotalQuestions += totalCount;

          let status: "✅ Good" | "⚠️ Low" | "❌ Empty";
          if (totalCount === 0) {
            status = "❌ Empty";
            examEmptyTopics++;
          } else if (totalCount < 10) {
            status = "⚠️ Low";
            examLowTopics++;
          } else {
            status = "✅ Good";
            examCoveredTopics++;
          }

          allTopics.push({
            examId: exam.id,
            examName: exam.name,
            subjectId: subject.id,
            subjectName: subject.name,
            topic,
            verifiedCount,
            cachedCount,
            status,
          });

          // Log each topic
          const statusIcon = status === "✅ Good" ? "✅" : status === "⚠️ Low" ? "⚠️" : "❌";
          console.log(`    ${statusIcon} ${topic.substring(0, 60).padEnd(60)} V:${verifiedCount.toString().padStart(4)} C:${cachedCount.toString().padStart(4)}`);
        }
      }

      examStats.push({
        examId: exam.id,
        examName: exam.name,
        totalTopics: examTotalTopics,
        coveredTopics: examCoveredTopics,
        emptyTopics: examEmptyTopics,
        lowTopics: examLowTopics,
        totalQuestions: examTotalQuestions,
      });
    }
  }

  // Summary Report
  console.log("\n\n" + "=".repeat(80));
  console.log("📈 EXAM COVERAGE SUMMARY");
  console.log("=".repeat(80));

  examStats.forEach((stat) => {
    const coveragePercent = ((stat.coveredTopics / stat.totalTopics) * 100).toFixed(1);
    const healthIcon =
      stat.emptyTopics === 0 && stat.lowTopics === 0 ? "✅" :
      stat.emptyTopics === 0 && stat.lowTopics <= 3 ? "⚠️" : "❌";

    console.log(`\n${healthIcon} ${stat.examName} (${stat.examId})`);
    console.log(`   Total Topics:    ${stat.totalTopics}`);
    console.log(`   Covered (≥10Q):  ${stat.coveredTopics} (${coveragePercent}%)`);
    console.log(`   Low (<10Q):      ${stat.lowTopics}`);
    console.log(`   Empty (0Q):      ${stat.emptyTopics} ❌`);
    console.log(`   Total Questions: ${stat.totalQuestions}`);
  });

  // Critical Issues
  console.log("\n\n" + "=".repeat(80));
  console.log("🚨 CRITICAL ISSUES - Topics with 0 Questions (WILL FAIL)");
  console.log("=".repeat(80));

  const emptyTopics = allTopics.filter((t) => t.verifiedCount + t.cachedCount === 0);
  if (emptyTopics.length === 0) {
    console.log("\n✅ No empty topics found! All topics have at least some questions.");
  } else {
    console.log(`\n❌ Found ${emptyTopics.length} topics with 0 questions:\n`);
    emptyTopics.forEach((t) => {
      console.log(`   ${t.examName} → ${t.subjectName}`);
      console.log(`     Topic: ${t.topic}`);
      console.log(`     IDs: exam_id="${t.examId}", subject_id="${t.subjectId}"`);
      console.log(``);
    });
  }

  // Low Coverage Topics
  console.log("\n" + "=".repeat(80));
  console.log("⚠️  LOW COVERAGE - Topics with <10 Questions");
  console.log("=".repeat(80));

  const lowTopics = allTopics.filter((t) => {
    const total = t.verifiedCount + t.cachedCount;
    return total > 0 && total < 10;
  });

  if (lowTopics.length === 0) {
    console.log("\n✅ No low-coverage topics found!");
  } else {
    console.log(`\n⚠️  Found ${lowTopics.length} topics with <10 questions:\n`);
    lowTopics.slice(0, 20).forEach((t) => {
      const total = t.verifiedCount + t.cachedCount;
      console.log(`   ${t.examName} → ${t.subjectName} → ${t.topic.substring(0, 50)}`);
      console.log(`     Questions: ${total} (V:${t.verifiedCount}, C:${t.cachedCount})`);
      console.log(``);
    });
    if (lowTopics.length > 20) {
      console.log(`   ... and ${lowTopics.length - 20} more\n`);
    }
  }

  // Database Statistics
  console.log("\n" + "=".repeat(80));
  console.log("💾 DATABASE STATISTICS");
  console.log("=".repeat(80));

  const totalVerified = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  const totalCached = await db.execute("SELECT COUNT(*) as count FROM cached_questions");

  const bySource = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  const byExam = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count DESC
    LIMIT 10
  `);

  console.log(`\nTotal Questions:`);
  console.log(`  Verified (exam_questions):  ${totalVerified.rows[0].count}`);
  console.log(`  Cached (cached_questions):  ${totalCached.rows[0].count}`);
  console.log(`  Grand Total:                ${Number(totalVerified.rows[0].count) + Number(totalCached.rows[0].count)}`);

  console.log(`\nQuestions by Source:`);
  bySource.rows.forEach((row: any) => {
    console.log(`  ${String(row.source || 'null').padEnd(15)} ${row.count}`);
  });

  console.log(`\nTop 10 Exams by Question Count:`);
  byExam.rows.forEach((row: any) => {
    console.log(`  ${String(row.exam_id).padEnd(20)} ${row.count}`);
  });

  // Recommendations
  console.log("\n\n" + "=".repeat(80));
  console.log("💡 RECOMMENDATIONS");
  console.log("=".repeat(80));

  const totalTopics = allTopics.length;
  const emptyCount = emptyTopics.length;
  const lowCount = lowTopics.length;
  const healthyCount = totalTopics - emptyCount - lowCount;
  const healthPercent = ((healthyCount / totalTopics) * 100).toFixed(1);

  console.log(`\n📊 Overall Health: ${healthPercent}% of topics have ≥10 questions\n`);

  if (emptyTopics.length > 0) {
    console.log(`🚨 URGENT (Priority 1): Seed questions for ${emptyTopics.length} empty topics`);
    console.log(`   These will show "AI warming up" error to users`);
    console.log(`   Action: Run seed scripts for each empty topic`);
    console.log(``);
  }

  if (lowTopics.length > 0) {
    console.log(`⚠️  HIGH (Priority 2): Add more questions for ${lowTopics.length} low-coverage topics`);
    console.log(`   These may hit AI generation frequently (slower UX)`);
    console.log(`   Action: Seed at least 20 questions per topic`);
    console.log(``);
  }

  console.log(`✅ GOOD: ${healthyCount} topics have healthy coverage (≥10 questions)`);
  console.log(``);

  console.log(`📝 Next Steps:`);
  console.log(`   1. Review empty topics list above`);
  console.log(`   2. Create seed scripts for critical exams (JEE, NEET, GATE, UPSC)`);
  console.log(`   3. Target: 20-50 questions per topic`);
  console.log(`   4. Enable auto-cache warming for popular topics`);
  console.log(`   5. Monitor quiz generation errors in production logs`);

  console.log("\n" + "=".repeat(80));
  console.log("📄 Full report saved to: audit-coverage-report.json");
  console.log("=".repeat(80) + "\n");

  // Save detailed report to JSON
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTopics,
      healthyTopics: healthyCount,
      lowCoverageTopics: lowCount,
      emptyTopics: emptyCount,
      healthPercentage: parseFloat(healthPercent),
    },
    examStats,
    criticalIssues: emptyTopics,
    lowCoverage: lowTopics,
    allTopics,
  };

  await require('fs').promises.writeFile("audit-coverage-report.json", JSON.stringify(report, null, 2), 'utf-8');
}

auditCoverage()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Audit failed:", err);
    process.exit(1);
  });
