import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

async function analyze() {
  console.log("\n" + "=".repeat(70));
  console.log(" 📊 DETAILED QUESTION BANK ANALYSIS");
  console.log("=".repeat(70));

  // 1. By Source
  const bySource = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
  `);

  console.log("\n📦 By Source:\n");
  bySource.rows.forEach(r => console.log(`  ${String(r.source).padEnd(15)} ${r.count}`));

  // 2. By Difficulty
  const byDiff = await db.execute(`
    SELECT difficulty, COUNT(*) as count
    FROM exam_questions
    GROUP BY difficulty
    ORDER BY
      CASE difficulty
        WHEN 'easy' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'hard' THEN 3
        ELSE 4
      END
  `);

  console.log("\n📈 By Difficulty:\n");
  byDiff.rows.forEach(r => console.log(`  ${String(r.difficulty).padEnd(15)} ${r.count}`));

  // 3. Top 20 Exams
  const topExams = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count DESC
    LIMIT 20
  `);

  console.log("\n🏆 Top 20 Exams by Question Count:\n");
  topExams.rows.forEach((r, i) =>
    console.log(`${String(i + 1).padStart(2)}. ${String(r.exam_id).padEnd(20)} ${r.count}`)
  );

  // 4. Bottom 20 Exams (need attention)
  const bottomExams = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count ASC
    LIMIT 20
  `);

  console.log("\n⚠️  Bottom 20 Exams (Need More Questions):\n");
  bottomExams.rows.forEach((r, i) =>
    console.log(`${String(i + 1).padStart(2)}. ${String(r.exam_id).padEnd(20)} ${r.count}`)
  );

  // 5. Source breakdown by exam (top 10)
  console.log("\n🔍 Source Breakdown (Top 10 Exams):\n");
  console.log("Exam".padEnd(20), "Verified", "Cached", "Total");
  console.log("-".repeat(60));

  for (const examRow of topExams.rows.slice(0, 10)) {
    const examId = String(examRow.exam_id);
    const breakdown = await db.execute({
      sql: `
        SELECT source, COUNT(*) as count
        FROM exam_questions
        WHERE exam_id = ?
        GROUP BY source
      `,
      args: [examId],
    });

    const verified = breakdown.rows.find(r => r.source === 'verified')?.count || 0;
    const cached = breakdown.rows.find(r => r.source === 'cached')?.count || 0;
    const total = Number(verified) + Number(cached);

    console.log(
      examId.padEnd(20),
      String(verified).padStart(8),
      String(cached).padStart(7),
      String(total).padStart(6)
    );
  }

  // 6. Total stats
  const total = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  const exams = await db.execute("SELECT COUNT(DISTINCT exam_id) as count FROM exam_questions");
  const topics = await db.execute("SELECT COUNT(DISTINCT topic) as count FROM exam_questions");

  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY STATISTICS");
  console.log("=".repeat(70));
  console.log(`Total Questions:     ${total.rows[0].count}`);
  console.log(`Unique Exams:        ${exams.rows[0].count}`);
  console.log(`Unique Topics:       ${topics.rows[0].count}`);
  console.log(`Avg Questions/Exam:  ${Math.round(Number(total.rows[0].count) / Number(exams.rows[0].count))}`);
  console.log("=".repeat(70) + "\n");
}

analyze()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
