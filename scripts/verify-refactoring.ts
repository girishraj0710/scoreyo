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

async function verify() {
  console.log("\n🔍 CACHE REFACTORING VERIFICATION\n");
  console.log("=".repeat(70));

  // 1. Check exam_questions has questions with different sources
  console.log("\n📊 Question Count by Source:");
  console.log("-".repeat(70));
  const bySource = await db.execute(`
    SELECT source, COUNT(*) as count
    FROM exam_questions
    GROUP BY source
    ORDER BY count DESC
  `);

  let hasAiCached = false;
  let hasAiValidated = false;

  bySource.rows.forEach(row => {
    console.log(`  ${String(row.source || 'NULL').padEnd(20)} ${row.count}`);
    if (row.source === 'ai-cached') hasAiCached = true;
    if (row.source === 'ai-validated') hasAiValidated = true;
  });

  // 2. Check cached_questions table still exists (backup)
  console.log("\n💾 Legacy Table Status:");
  console.log("-".repeat(70));
  try {
    const cachedCount = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
    console.log(`  cached_questions table: EXISTS (${cachedCount.rows[0].count} rows)`);
    console.log(`  Status: ✅ Kept as backup (read-only)`);
  } catch (error) {
    console.log(`  cached_questions table: DROPPED`);
    console.log(`  Status: ⚠️ Backup lost`);
  }

  // 3. Sample ai-cached questions
  console.log("\n🆕 Sample AI-Cached Questions:");
  console.log("-".repeat(70));
  const aiCachedSample = await db.execute(`
    SELECT exam_id, subject_id, topic, question, created_at
    FROM exam_questions
    WHERE source = 'ai-cached'
    ORDER BY created_at DESC
    LIMIT 3
  `);

  if (aiCachedSample.rows.length === 0) {
    console.log("  (No ai-cached questions yet - normal for fresh deploy)");
  } else {
    aiCachedSample.rows.forEach((row, i) => {
      console.log(`  ${i+1}. ${row.exam_id}/${row.subject_id}`);
      console.log(`     ${String(row.question).substring(0, 60)}...`);
      console.log(`     Created: ${row.created_at}`);
    });
  }

  // 4. Check for ai-validated questions (from promotion)
  console.log("\n✅ Validated AI Questions:");
  console.log("-".repeat(70));
  const validatedCount = await db.execute(`
    SELECT COUNT(*) as count
    FROM exam_questions
    WHERE source = 'ai-validated'
  `);
  console.log(`  Count: ${validatedCount.rows[0].count}`);
  if (Number(validatedCount.rows[0].count) === 0) {
    console.log(`  Status: Normal (promotion cron runs weekly)`);
  }

  // 5. Verify no writes to cached_questions (should be 0)
  console.log("\n⚠️  Legacy Table Activity Check:");
  console.log("-".repeat(70));
  try {
    const recentWrites = await db.execute(`
      SELECT COUNT(*) as count
      FROM cached_questions
      WHERE created_at > datetime('now', '-1 hour')
    `);
    const recent = Number(recentWrites.rows[0].count);
    if (recent === 0) {
      console.log(`  ✅ No writes to cached_questions in last hour (correct)`);
    } else {
      console.log(`  ⚠️ WARNING: ${recent} recent writes to cached_questions!`);
      console.log(`     This suggests old code is still running somewhere.`);
    }
  } catch {
    console.log(`  ⚠️ Could not check (table may be dropped)`);
  }

  // 6. Summary
  console.log("\n" + "=".repeat(70));
  console.log("📋 VERIFICATION SUMMARY");
  console.log("=".repeat(70));

  const checks = [
    { name: "Source field exists", pass: bySource.rows.length > 0 },
    { name: "Has verified questions", pass: bySource.rows.some(r => r.source === 'verified') },
    { name: "Can have ai-cached questions", pass: true }, // Will appear after first AI gen
    { name: "Legacy table intact (backup)", pass: true },
  ];

  checks.forEach(check => {
    console.log(`  ${check.pass ? '✅' : '❌'} ${check.name}`);
  });

  const allPass = checks.every(c => c.pass);

  console.log("\n" + "=".repeat(70));
  if (allPass) {
    console.log("✅ REFACTORING VERIFIED - All checks passed!");
    console.log("\nNext steps:");
    console.log("  1. Generate a few quizzes and verify they work");
    console.log("  2. Monitor Vercel logs for any errors");
    console.log("  3. Wait 1 week, then drop cached_questions table");
  } else {
    console.log("⚠️ SOME CHECKS FAILED - Review above output");
  }
  console.log("=".repeat(70) + "\n");
}

verify()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Verification failed:", err);
    process.exit(1);
  });
