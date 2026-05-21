#!/usr/bin/env tsx
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

async function postDeploymentCheck() {
  console.log("\n🚀 POST-DEPLOYMENT VERIFICATION\n");
  console.log("=".repeat(70));

  let allChecks = true;

  // Check 1: Verify source field exists
  console.log("\n1️⃣  Checking exam_questions schema...");
  try {
    const schema = await db.execute(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='exam_questions'"
    );
    const schemaSql = String(schema.rows[0]?.sql || '');
    const hasSource = schemaSql.includes('source');

    if (hasSource) {
      console.log("   ✅ exam_questions has 'source' field");
    } else {
      console.log("   ❌ MISSING 'source' field!");
      allChecks = false;
    }
  } catch (e) {
    console.log("   ❌ Error checking schema:", e);
    allChecks = false;
  }

  // Check 2: Count questions by source
  console.log("\n2️⃣  Checking question distribution by source...");
  try {
    const bySource = await db.execute(`
      SELECT source, COUNT(*) as count
      FROM exam_questions
      GROUP BY source
      ORDER BY count DESC
    `);

    let hasVerified = false;
    let hasAiCached = false;

    for (const row of bySource.rows) {
      const source = String(row.source || 'NULL');
      const count = Number(row.count || 0);
      console.log(`   ${source.padEnd(25)} ${count.toLocaleString()}`);

      if (source === 'verified') hasVerified = true;
      if (source === 'ai-cached') hasAiCached = true;
    }

    if (hasVerified) {
      console.log("   ✅ Has verified questions");
    } else {
      console.log("   ⚠️  No verified questions found");
    }

    console.log(`   ${hasAiCached ? '✅' : 'ℹ️ '} ${hasAiCached ? 'Has' : 'No'} ai-cached questions yet (normal if just deployed)`);
  } catch (e) {
    console.log("   ❌ Error checking sources:", e);
    allChecks = false;
  }

  // Check 3: Verify cached_questions backup still exists
  console.log("\n3️⃣  Checking legacy table backup...");
  try {
    const cached = await db.execute("SELECT COUNT(*) as count FROM cached_questions");
    const count = Number(cached.rows[0]?.count || 0);
    console.log(`   ✅ cached_questions table exists (${count.toLocaleString()} rows)`);
    console.log(`   ℹ️  This is the backup - will be dropped in 1 week`);
  } catch (e) {
    console.log("   ⚠️  cached_questions table not found (may have been dropped early)");
  }

  // Check 4: Test query performance
  console.log("\n4️⃣  Testing query performance...");
  try {
    const start = Date.now();
    const result = await db.execute(`
      SELECT * FROM exam_questions
      WHERE exam_id = 'jee-main' AND subject_id = 'jee-physics'
      LIMIT 10
    `);
    const duration = Date.now() - start;

    console.log(`   ✅ Query completed in ${duration}ms`);
    console.log(`   ℹ️  Retrieved ${result.rows.length} questions`);

    if (duration > 1000) {
      console.log(`   ⚠️  Slow query (>1s) - may need index optimization`);
    }
  } catch (e) {
    console.log("   ❌ Error testing query:", e);
    allChecks = false;
  }

  // Check 5: Verify no recent writes to cached_questions
  console.log("\n5️⃣  Checking for unwanted writes to legacy table...");
  try {
    const recentWrites = await db.execute(`
      SELECT COUNT(*) as count
      FROM cached_questions
      WHERE created_at > datetime('now', '-1 hour')
    `);
    const count = Number(recentWrites.rows[0]?.count || 0);

    if (count === 0) {
      console.log(`   ✅ No recent writes to cached_questions (correct)`);
    } else {
      console.log(`   ⚠️  WARNING: ${count} writes to cached_questions in last hour!`);
      console.log(`   📝 Old code may still be running somewhere`);
      allChecks = false;
    }
  } catch (e) {
    console.log(`   ℹ️  Could not check (table may be dropped)`);
  }

  // Check 6: Sample a question with source field
  console.log("\n6️⃣  Sampling questions to verify source field...");
  try {
    const sample = await db.execute(`
      SELECT id, exam_id, question, source, created_at
      FROM exam_questions
      ORDER BY created_at DESC
      LIMIT 3
    `);

    for (const row of sample.rows) {
      const source = row.source || 'NULL';
      const question = String(row.question).substring(0, 50);
      console.log(`   ${source.padEnd(15)} ${question}...`);
    }

    if (sample.rows.length > 0) {
      console.log(`   ✅ Questions have source field`);
    }
  } catch (e) {
    console.log("   ❌ Error sampling questions:", e);
    allChecks = false;
  }

  // Final summary
  console.log("\n" + "=".repeat(70));
  if (allChecks) {
    console.log("✅ POST-DEPLOYMENT CHECK PASSED");
    console.log("\nAll systems operational! Refactoring deployed successfully.");
    console.log("\n📝 Next steps:");
    console.log("   1. Test quiz generation manually at https://prepgenie.co.in");
    console.log("   2. Monitor Vercel logs for any errors");
    console.log("   3. Check back tomorrow to verify cron jobs ran");
    console.log("   4. After 1 week of stability, drop cached_questions table");
  } else {
    console.log("⚠️  POST-DEPLOYMENT CHECK FAILED");
    console.log("\nSome checks did not pass. Review the output above.");
  }
  console.log("=".repeat(70) + "\n");

  return allChecks;
}

postDeploymentCheck()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((err) => {
    console.error("\n❌ Post-deployment check failed:", err);
    process.exit(1);
  });
