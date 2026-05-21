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

async function migrateCacheToMain() {
  console.log("\n🚀 CACHE TABLE MIGRATION TO MAIN TABLE\n");
  console.log("=".repeat(70));

  // Step 1: Count total cached questions
  const countResult = await db.execute(
    "SELECT COUNT(*) as total FROM cached_questions"
  );
  const totalCached = Number(countResult.rows[0].total);
  console.log(`\n📊 Found ${totalCached} cached questions to migrate`);

  if (totalCached === 0) {
    console.log("✅ No questions to migrate. Exiting.");
    return;
  }

  // Step 2: Get current exam_questions count
  const examCountResult = await db.execute(
    "SELECT COUNT(*) as total FROM exam_questions"
  );
  const currentExamCount = Number(examCountResult.rows[0].total);
  console.log(`📋 Current exam_questions count: ${currentExamCount}`);

  console.log("\n⚠️  MIGRATION PLAN:");
  console.log("   1. Page through cached_questions in batches of 100");
  console.log("   2. For each question, check if duplicate exists");
  console.log("   3. Insert non-duplicates into exam_questions with source='ai-cached'");
  console.log("   4. Track migrated vs skipped counts");
  console.log("   5. Keep cached_questions table intact (drop manually after verification)");

  // Confirm before proceeding
  console.log("\n" + "-".repeat(70));
  console.log("⏳ Starting migration in 3 seconds...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  const BATCH_SIZE = 100;
  let offset = 0;
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  const startTime = Date.now();

  while (offset < totalCached) {
    // Fetch batch
    const batch = await db.execute({
      sql: `SELECT id, exam_id, subject_id, topic, difficulty, question_json
            FROM cached_questions
            ORDER BY id
            LIMIT ? OFFSET ?`,
      args: [BATCH_SIZE, offset],
    });

    if (batch.rows.length === 0) break;

    console.log(`\n📦 Processing batch: ${offset + 1} to ${offset + batch.rows.length}`);

    for (const row of batch.rows) {
      try {
        const questionData = JSON.parse(row.question_json as string);

        // Check for duplicate (same question text in same exam/subject/topic)
        const existing = await db.execute({
          sql: `SELECT id FROM exam_questions
                WHERE exam_id = ? AND subject_id = ? AND topic = ?
                AND question = ?
                LIMIT 1`,
          args: [
            row.exam_id,
            row.subject_id,
            row.topic,
            questionData.question,
          ],
        });

        if (existing.rows.length > 0) {
          skipped++;
          continue; // Skip duplicate
        }

        // Serialize explanation (handle both string and object formats)
        let explanationStr: string;
        if (typeof questionData.explanation === 'string') {
          explanationStr = questionData.explanation;
        } else if (questionData.explanation && typeof questionData.explanation === 'object') {
          explanationStr = JSON.stringify(questionData.explanation);
        } else {
          explanationStr = "Explanation not available";
        }

        // Insert into exam_questions with source = 'ai-cached'
        await db.execute({
          sql: `INSERT INTO exam_questions
                (exam_id, subject_id, topic, question, options, correct_answer,
                 explanation, difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ai-cached')`,
          args: [
            row.exam_id,
            row.subject_id,
            row.topic,
            questionData.question,
            JSON.stringify(questionData.options),
            questionData.correctAnswer,
            explanationStr,
            questionData.difficulty || 'medium',
          ],
        });

        migrated++;

      } catch (error) {
        console.error(`   ❌ Error processing question ${row.id}:`, error);
        errors++;
      }
    }

    offset += BATCH_SIZE;

    // Progress report
    const progress = Math.min(100, Math.round((offset / totalCached) * 100));
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`   ✅ Progress: ${progress}% | Migrated: ${migrated} | Skipped: ${skipped} | Errors: ${errors} | Time: ${elapsed}s`);
  }

  // Final stats
  const finalExamCount = await db.execute(
    "SELECT COUNT(*) as total FROM exam_questions"
  );
  const newExamCount = Number(finalExamCount.rows[0].total);

  console.log("\n" + "=".repeat(70));
  console.log("✅ MIGRATION COMPLETE!\n");
  console.log(`📊 Statistics:`);
  console.log(`   • Total cached questions:     ${totalCached}`);
  console.log(`   • Successfully migrated:      ${migrated}`);
  console.log(`   • Skipped (duplicates):       ${skipped}`);
  console.log(`   • Errors:                     ${errors}`);
  console.log(`   • Migration rate:             ${Math.round((migrated / totalCached) * 100)}%`);
  console.log(`\n📈 Database Growth:`);
  console.log(`   • Before: ${currentExamCount} exam_questions`);
  console.log(`   • After:  ${newExamCount} exam_questions`);
  console.log(`   • Added:  ${newExamCount - currentExamCount} questions (+${Math.round(((newExamCount - currentExamCount) / currentExamCount) * 100)}%)`);

  console.log(`\n⏱️  Total time: ${Math.round((Date.now() - startTime) / 1000)}s`);

  console.log("\n⚠️  NEXT STEPS:");
  console.log("   1. Verify quiz generation still works");
  console.log("   2. Check a few quizzes use ai-cached questions");
  console.log("   3. Monitor for any errors in production");
  console.log("   4. After 1 week of stability, drop cached_questions table");
  console.log("\n" + "=".repeat(70) + "\n");
}

migrateCacheToMain()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ MIGRATION FAILED:", err);
    process.exit(1);
  });
