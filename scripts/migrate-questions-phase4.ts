#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 4: Migrate questions with deduplication
 *
 * Strategy:
 * - For universal topics (10+ exams): Deduplicate aggressively - keep best version
 * - For medium topics (5-9 exams): Deduplicate moderately - merge similar
 * - For specific topics (1-4 exams): Keep all, minimal deduplication
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

// Fuzzy match questions (detect duplicates)
function similarityScore(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  // Exact match
  if (s1 === s2) return 1.0;

  // First 100 chars match (very likely duplicate)
  if (s1.substring(0, 100) === s2.substring(0, 100)) return 0.95;

  // Simple Levenshtein ratio for short strings
  if (s1.length < 50 && s2.length < 50) {
    const maxLen = Math.max(s1.length, s2.length);
    const distance = levenshteinDistance(s1, s2);
    return 1 - (distance / maxLen);
  }

  return 0;
}

function levenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

// Choose best question from duplicates
function chooseBestQuestion(questions: any[]): any {
  // Prefer questions with longer explanations
  return questions.sort((a, b) => {
    const aLen = String(a.explanation || '').length;
    const bLen = String(b.explanation || '').length;
    return bLen - aLen;
  })[0];
}

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 PHASE 4: QUESTION MIGRATION WITH DEDUPLICATION");
  console.log("=".repeat(80));
  console.log("\nThis will migrate ~44,900 questions to the dimensional model.");
  console.log("Estimated time: 30-60 minutes\n");

  try {
    // Get ID mappings
    console.log("1️⃣  Loading dimension mappings...");
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

    // Get topic sharing levels
    console.log("2️⃣  Analyzing topic sharing levels...");
    const topicSharing = await db.execute(`
      SELECT t.id, t.topic_name, t.scope, COUNT(DISTINCT b.exam_id) as exam_count
      FROM dim_topics t
      LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
      GROUP BY t.id
    `);

    const universalTopics = new Set<number>();
    const mediumTopics = new Set<number>();

    for (const row of topicSharing.rows) {
      const examCount = Number(row.exam_count);
      const topicId = Number(row.id);

      if (examCount >= 10) {
        universalTopics.add(topicId);
      } else if (examCount >= 5) {
        mediumTopics.add(topicId);
      }
    }

    console.log(`   Universal topics (10+ exams): ${universalTopics.size} - will deduplicate aggressively`);
    console.log(`   Medium topics (5-9 exams): ${mediumTopics.size} - will deduplicate moderately`);
    console.log(`   Specific topics (1-4 exams): ${topicSharing.rows.length - universalTopics.size - mediumTopics.size} - minimal deduplication\n`);

    // Migrate questions by topic
    console.log("3️⃣  Migrating questions...");
    console.log("   This will process questions topic by topic with deduplication.\n");

    let totalProcessed = 0;
    let totalInserted = 0;
    let totalDuplicatesSkipped = 0;
    let totalErrors = 0;

    const topicList = Array.from(topicMap.entries());
    let processedTopics = 0;

    for (const [topicName, topicId] of topicList) {
      processedTopics++;

      // Get all questions for this topic
      const questions = await db.execute({
        sql: `SELECT * FROM exam_questions WHERE topic = ?`,
        args: [topicName],
      });

      if (questions.rows.length === 0) continue;

      totalProcessed += questions.rows.length;

      // Determine deduplication strategy
      const isUniversal = universalTopics.has(topicId);
      const isMedium = mediumTopics.has(topicId);
      const dedupeThreshold = isUniversal ? 0.9 : (isMedium ? 0.95 : 0.99);

      // Group questions by similarity for deduplication
      const uniqueQuestions: any[] = [];
      const seenQuestions = new Map<string, any>();

      for (const q of questions.rows) {
        const questionText = String(q.question).substring(0, 100).toLowerCase().trim();

        // Check for duplicates
        let isDuplicate = false;
        for (const [key, existing] of seenQuestions) {
          const similarity = similarityScore(questionText, key);
          if (similarity >= dedupeThreshold) {
            isDuplicate = true;
            totalDuplicatesSkipped++;
            break;
          }
        }

        if (!isDuplicate) {
          seenQuestions.set(questionText, q);
          uniqueQuestions.push(q);
        }
      }

      // Insert unique questions
      for (const q of uniqueQuestions) {
        const examId = examMap.get(String(q.exam_id));
        const subjectId = subjectMap.get(String(q.subject_id));

        if (!examId || !subjectId || !topicId) {
          totalErrors++;
          continue;
        }

        try {
          await db.execute({
            sql: `INSERT INTO fact_exam_questions
                  (exam_id, subject_id, topic_id, question, options, correct_answer,
                   explanation, difficulty, source, valid_from, valid_until, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              examId,
              subjectId,
              topicId,
              q.question,
              q.options,
              q.correct_answer,
              q.explanation,
              q.difficulty,
              q.source,
              q.valid_from,
              q.valid_until,
              q.created_at,
            ],
          });
          totalInserted++;
        } catch (err: any) {
          if (!err.message?.includes('UNIQUE constraint')) {
            totalErrors++;
          }
        }
      }

      // Progress update
      if (processedTopics % 50 === 0) {
        console.log(`   Progress: ${processedTopics}/${topicList.length} topics | ` +
                    `Inserted: ${totalInserted} | Duplicates skipped: ${totalDuplicatesSkipped}`);
      }
    }

    console.log(`\n   ✅ Completed processing all ${topicList.length} topics\n`);

    // Final statistics
    console.log("4️⃣  Migration Statistics:");
    console.log("=".repeat(80));
    console.log(`   Questions processed: ${totalProcessed}`);
    console.log(`   Questions inserted: ${totalInserted}`);
    console.log(`   Duplicates skipped: ${totalDuplicatesSkipped} (${((totalDuplicatesSkipped/totalProcessed)*100).toFixed(1)}%)`);
    console.log(`   Errors: ${totalErrors}`);
    console.log(`   Reduction: ${totalProcessed} → ${totalInserted} (${((1 - totalInserted/totalProcessed)*100).toFixed(1)}% saved)`);

    // Verify migration
    console.log("\n5️⃣  Verification:");
    const oldCount = await db.execute(`SELECT COUNT(*) as cnt FROM exam_questions`);
    const newCount = await db.execute(`SELECT COUNT(*) as cnt FROM fact_exam_questions`);
    const topicCount = await db.execute(`SELECT COUNT(DISTINCT topic_id) as cnt FROM fact_exam_questions`);
    const examCount = await db.execute(`SELECT COUNT(DISTINCT exam_id) as cnt FROM fact_exam_questions`);

    console.log(`   Old table (exam_questions): ${oldCount.rows[0].cnt} questions`);
    console.log(`   New table (fact_exam_questions): ${newCount.rows[0].cnt} questions`);
    console.log(`   Unique topics with questions: ${topicCount.rows[0].cnt}`);
    console.log(`   Exams with questions: ${examCount.rows[0].cnt}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ PHASE 4 COMPLETE: Question Migration Done!");
    console.log("=".repeat(80));
    console.log("\nNext steps:");
    console.log("  - Phase 5: Update application code to use dimensional model");
    console.log("  - Phase 6: Test queries and performance");
    console.log("  - Phase 7: Gradual cutover");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
