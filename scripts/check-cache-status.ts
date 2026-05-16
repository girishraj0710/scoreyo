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

async function checkStatus() {
  console.log("\n📊 QUESTION CACHE STATUS\n");
  console.log("=".repeat(60));

  // Count questions in both tables
  const examQ = await db.execute("SELECT COUNT(*) as count FROM exam_questions");
  const cachedQ = await db.execute("SELECT COUNT(*) as count FROM cached_questions");

  console.log(`\n✅ Verified (exam_questions):  ${examQ.rows[0].count}`);
  console.log(`💾 Cached (cached_questions):   ${cachedQ.rows[0].count}`);
  console.log(`📦 Total:                       ${Number(examQ.rows[0].count) + Number(cachedQ.rows[0].count)}`);

  // Get distribution by exam
  const examDist = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM exam_questions
    GROUP BY exam_id
    ORDER BY count DESC
    LIMIT 10
  `);

  const cachedDist = await db.execute(`
    SELECT exam_id, COUNT(*) as count
    FROM cached_questions
    GROUP BY exam_id
    ORDER BY count DESC
    LIMIT 10
  `);

  console.log("\n📈 Top 10 Exams (Verified Questions):");
  console.log("-".repeat(60));
  examDist.rows.forEach((r, i) => {
    console.log(`${i + 1}. ${String(r.exam_id).padEnd(25)} ${r.count}`);
  });

  console.log("\n💾 Top 10 Exams (Cached Questions):");
  console.log("-".repeat(60));
  if (cachedDist.rows.length === 0) {
    console.log("   (No cached questions yet)");
  } else {
    cachedDist.rows.forEach((r, i) => {
      console.log(`${i + 1}. ${String(r.exam_id).padEnd(25)} ${r.count}`);
    });
  }

  // Get sample of recent cached questions
  const recentCached = await db.execute(`
    SELECT exam_id, topic, created_at
    FROM cached_questions
    ORDER BY id DESC
    LIMIT 5
  `);

  console.log("\n🆕 Recent Cached Questions (Last 5):");
  console.log("-".repeat(60));
  if (recentCached.rows.length === 0) {
    console.log("   (No cached questions yet)");
  } else {
    recentCached.rows.forEach((r, i) => {
      console.log(`${i + 1}. ${String(r.exam_id).padEnd(20)} ${String(r.topic).substring(0, 30)}`);
    });
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

checkStatus()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
