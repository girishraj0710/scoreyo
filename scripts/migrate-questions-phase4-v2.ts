#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 4 v2: Migrate questions with TOPIC-ONLY linking (NO exam_id!)
 *
 * Strategy:
 * - Questions are linked ONLY to normalized topics
 * - Multiple exams can pull from the same question pool
 * - Deduplication happens at topic level
 * - Universal topics (5+ exams): Aggressive deduplication
 * - Specific topics (<5 exams): Minimal deduplication
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { normalizeTopics, parseTopic, getAtomicTopics } from "./normalize-topics";
import { examCategories } from "../src/lib/exams";

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
  if (s1.length >= 100 && s2.length >= 100) {
    if (s1.substring(0, 100) === s2.substring(0, 100)) return 0.95;
  }

  // For shorter strings, use simple comparison
  if (s1.length < 50 && s2.length < 50) {
    const maxLen = Math.max(s1.length, s2.length);
    const minLen = Math.min(s1.length, s2.length);
    if (s1 === s2) return 1.0;
    if (maxLen > 0 && minLen / maxLen > 0.8) {
      return minLen / maxLen;
    }
  }

  return 0;
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
  console.log("🚀 PHASE 4 v2: QUESTION MIGRATION WITH TOPIC-ONLY LINKING");
  console.log("=".repeat(80));
  console.log("\nThis will migrate questions to shared topic pools.");
  console.log("Questions will be linked ONLY to topics, not exams.");
  console.log("Estimated time: 30-60 minutes\n");

  try {
    // Get normalized topics
    console.log("1️⃣  Loading normalized topic mappings...");
    const normalizedTopics = normalizeTopics(examCategories);

    // Get topic ID mappings from database
    const topicIdMap = new Map<string, number>();
    const topicsResult = await db.execute(`SELECT id, topic_name FROM dim_topics`);
    for (const row of topicsResult.rows) {
      topicIdMap.set(String(row.topic_name), Number(row.id));
    }
    console.log(`   ✅ Loaded ${topicIdMap.size} normalized topics\n`);

    // Analyze topic sharing levels
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

    // Map old topics to normalized topics
    console.log("3️⃣  Building old-to-new topic mapping...");
    const oldToNewTopicMap = new Map<string, string[]>();

    // For each old question, we need to know which normalized topics it maps to
    for (const category of examCategories) {
      for (const exam of category.exams) {
        for (const subject of exam.subjects) {
          for (const topicStr of subject.topics) {
            // Get the atomic topics this maps to
            const atomicTopics = getAtomicTopics(topicStr, normalizedTopics);

            // The old topic string might be in the database
            const { parent } = parseTopic(topicStr);
            oldToNewTopicMap.set(topicStr, atomicTopics);
            oldToNewTopicMap.set(parent, atomicTopics); // Also map the parent name
          }
        }
      }
    }

    console.log(`   ✅ Created mappings for ${oldToNewTopicMap.size} old topic variations\n`);

    // Migrate questions topic by topic
    console.log("4️⃣  Migrating questions...");
    console.log("   This will process questions by normalized topic with deduplication.\n");

    let totalProcessed = 0;
    let totalInserted = 0;
    let totalDuplicatesSkipped = 0;
    let totalErrors = 0;
    let totalMappingErrors = 0;

    const topicList = Array.from(topicIdMap.entries());
    let processedTopics = 0;

    for (const [normalizedTopicName, normalizedTopicId] of topicList) {
      processedTopics++;

      // Find all old questions that map to this normalized topic
      const questionsForThisTopic: any[] = [];

      // Search by exact topic name match
      const exactMatch = await db.execute({
        sql: `SELECT * FROM exam_questions WHERE topic = ?`,
        args: [normalizedTopicName],
      });
      questionsForThisTopic.push(...exactMatch.rows);

      // Also search for questions where this topic is part of a parent topic
      for (const [oldTopic, mappedTopics] of oldToNewTopicMap) {
        if (mappedTopics.includes(normalizedTopicName)) {
          const matches = await db.execute({
            sql: `SELECT * FROM exam_questions WHERE topic = ?`,
            args: [oldTopic],
          });
          questionsForThisTopic.push(...matches.rows);
        }
      }

      if (questionsForThisTopic.length === 0) continue;

      totalProcessed += questionsForThisTopic.length;

      // Determine deduplication strategy
      const isUniversal = universalTopics.has(normalizedTopicId);
      const isMedium = mediumTopics.has(normalizedTopicId);
      const dedupeThreshold = isUniversal ? 0.85 : (isMedium ? 0.92 : 0.97);

      // Group questions by similarity for deduplication
      const uniqueQuestions: any[] = [];
      const seenQuestions = new Map<string, any>();

      for (const q of questionsForThisTopic) {
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

      // Insert unique questions (linked ONLY to topic, not exam!)
      for (const q of uniqueQuestions) {
        try {
          await db.execute({
            sql: `INSERT INTO fact_exam_questions
                  (topic_id, question, options, correct_answer,
                   explanation, difficulty, source, valid_from, valid_until, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              normalizedTopicId,
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
            if (totalErrors <= 5) {
              console.error(`   ⚠️  Error inserting question:`, err.message);
            }
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
    console.log("5️⃣  Migration Statistics:");
    console.log("=".repeat(80));
    console.log(`   Questions processed: ${totalProcessed}`);
    console.log(`   Questions inserted: ${totalInserted}`);
    console.log(`   Duplicates skipped: ${totalDuplicatesSkipped} (${((totalDuplicatesSkipped/totalProcessed)*100).toFixed(1)}%)`);
    console.log(`   Errors: ${totalErrors}`);
    console.log(`   Mapping errors: ${totalMappingErrors}`);
    console.log(`   Reduction: ${totalProcessed} → ${totalInserted} (${((1 - totalInserted/totalProcessed)*100).toFixed(1)}% saved)`);

    // Verify migration
    console.log("\n6️⃣  Verification:");
    const oldCount = await db.execute(`SELECT COUNT(*) as cnt FROM exam_questions`);
    const newCount = await db.execute(`SELECT COUNT(*) as cnt FROM fact_exam_questions`);
    const topicCount = await db.execute(`SELECT COUNT(DISTINCT topic_id) as cnt FROM fact_exam_questions`);
    const avgPerTopic = await db.execute(`
      SELECT AVG(cnt) as avg FROM (
        SELECT COUNT(*) as cnt FROM fact_exam_questions GROUP BY topic_id
      )
    `);

    console.log(`   Old table (exam_questions): ${oldCount.rows[0].cnt} questions`);
    console.log(`   New table (fact_exam_questions): ${newCount.rows[0].cnt} questions`);
    console.log(`   Unique topics with questions: ${topicCount.rows[0].cnt}`);
    console.log(`   Average questions per topic: ${Math.round(Number(avgPerTopic.rows[0].avg))}`);

    // Show example of shared topics
    console.log("\n7️⃣  Example of topic sharing:");
    const examples = await db.execute(`
      SELECT t.topic_name, t.scope,
             COUNT(q.id) as question_count,
             COUNT(DISTINCT b.exam_id) as exam_count
      FROM dim_topics t
      JOIN fact_exam_questions q ON t.id = q.topic_id
      JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
      WHERE t.scope = 'universal'
      GROUP BY t.id
      ORDER BY exam_count DESC, question_count DESC
      LIMIT 10
    `);

    console.log("\n   Top shared topics:");
    for (const row of examples.rows) {
      console.log(`   ${row.topic_name}: ${row.question_count} questions → shared by ${row.exam_count} exams`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ PHASE 4 COMPLETE: Questions migrated with topic-only linking!");
    console.log("=".repeat(80));
    console.log("\n🎯 Key Achievement:");
    console.log("   Questions are now SHARED across exams via topics!");
    console.log("   Example: All 'Kinematics' questions can be used by JEE, NEET, KCET, etc.");
    console.log("   Result: Much larger question pools for quiz generation!\n");
    console.log("Next steps:");
    console.log("  - Phase 5: Update application code to query via bridge table");
    console.log("  - Phase 6: Test and gradual cutover");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
