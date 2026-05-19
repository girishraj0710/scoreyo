#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 2: Populate dimension tables with NORMALIZED topics
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { normalizeTopics, getAtomicTopics, parseTopic } from "./normalize-topics";

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

async function main() {
  console.log("=".repeat(80));
  console.log("🔄 MIGRATION TO DIMENSIONAL MODEL - Phase 2 (NORMALIZED TOPICS)");
  console.log("=".repeat(80));
  console.log("\nPopulating dimension tables with normalized, shared topics...\n");

  try {
    // 1. Populate dim_exams
    console.log("1️⃣  Populating dim_exams...");
    let examCount = 0;
    const examIdMap = new Map<string, number>();

    for (const category of examCategories) {
      for (const exam of category.exams) {
        try {
          await db.execute({
            sql: `INSERT OR IGNORE INTO dim_exams (exam_code, exam_name, category, conducting_body)
                  VALUES (?, ?, ?, ?)`,
            args: [exam.id, exam.fullName, exam.category, exam.category],
          });

          // Get the ID
          const result = await db.execute({
            sql: `SELECT id FROM dim_exams WHERE exam_code = ?`,
            args: [exam.id],
          });
          if (result.rows[0]) {
            examIdMap.set(exam.id, Number(result.rows[0].id));
          }

          examCount++;
        } catch (err: any) {
          console.error(`   ⚠️  Failed to insert exam ${exam.id}:`, err.message);
        }
      }
    }
    console.log(`   ✅ Inserted ${examCount} exams\n`);

    // 2. Populate dim_subjects
    console.log("2️⃣  Populating dim_subjects...");
    let subjectCount = 0;
    const subjectIdMap = new Map<string, number>();

    for (const category of examCategories) {
      for (const exam of category.exams) {
        for (const subject of exam.subjects) {
          try {
            await db.execute({
              sql: `INSERT OR IGNORE INTO dim_subjects (subject_code, subject_name, category)
                    VALUES (?, ?, ?)`,
              args: [subject.id, subject.name, getSubjectCategory(subject.name)],
            });

            // Get the ID
            const result = await db.execute({
              sql: `SELECT id FROM dim_subjects WHERE subject_code = ?`,
              args: [subject.id],
            });
            if (result.rows[0]) {
              subjectIdMap.set(subject.id, Number(result.rows[0].id));
            }

            subjectCount++;
          } catch (err: any) {
            if (!err.message?.includes('UNIQUE constraint')) {
              console.error(`   ⚠️  Failed to insert subject ${subject.id}:`, err.message);
            }
          }
        }
      }
    }
    console.log(`   ✅ Inserted ${subjectCount} subjects\n`);

    // 3. Normalize topics from exam definitions
    console.log("3️⃣  Normalizing topics...");
    const normalizedTopics = normalizeTopics(examCategories);
    console.log(`   📊 Found ${normalizedTopics.size} unique normalized topics`);

    // Categorize by scope
    const universal = Array.from(normalizedTopics.values()).filter(t => t.scope === 'universal');
    const stateSpecific = Array.from(normalizedTopics.values()).filter(t => t.scope === 'state-specific');
    const examSpecific = Array.from(normalizedTopics.values()).filter(t => t.scope === 'exam-specific');

    console.log(`      - Universal: ${universal.length} (used in 5+ exams)`);
    console.log(`      - State-specific: ${stateSpecific.length}`);
    console.log(`      - Exam-specific: ${examSpecific.length} (used in <5 exams)\n`);

    // 4. Populate dim_topics
    console.log("4️⃣  Populating dim_topics...");
    const topicIdMap = new Map<string, number>();

    // First pass: Insert all topics (without parent references)
    for (const [name, topic] of normalizedTopics) {
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO dim_topics (topic_name, category, scope, description, keywords)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            name,
            topic.category,
            topic.scope,
            `Used in ${topic.usedInExams.size} exams: ${Array.from(topic.usedInExams).slice(0, 3).join(", ")}`,
            Array.from(topic.usedInExams).join(","),
          ],
        });

        // Get the ID
        const result = await db.execute({
          sql: `SELECT id FROM dim_topics WHERE topic_name = ?`,
          args: [name],
        });
        if (result.rows[0]) {
          topicIdMap.set(name, Number(result.rows[0].id));
        }
      } catch (err: any) {
        if (!err.message?.includes('UNIQUE constraint')) {
          console.error(`   ⚠️  Failed to insert topic ${name}:`, err.message);
        }
      }
    }

    // Second pass: Update parent relationships
    for (const [name, topic] of normalizedTopics) {
      if (topic.parent && topicIdMap.has(topic.parent)) {
        const parentId = topicIdMap.get(topic.parent)!;
        const childId = topicIdMap.get(name)!;

        await db.execute({
          sql: `UPDATE dim_topics SET parent_topic_id = ? WHERE id = ?`,
          args: [parentId, childId],
        });
      }
    }

    console.log(`   ✅ Inserted ${normalizedTopics.size} normalized topics with hierarchies\n`);

    // 5. Create bridge mappings
    console.log("5️⃣  Creating bridge mappings (exam-subject-topic relationships)...");
    let bridgeCount = 0;

    for (const category of examCategories) {
      for (const exam of category.exams) {
        const examDbId = examIdMap.get(exam.id);
        if (!examDbId) continue;

        for (const subject of exam.subjects) {
          const subjectDbId = subjectIdMap.get(subject.id);
          if (!subjectDbId) continue;

          for (const topicStr of subject.topics) {
            // Get atomic (leaf) topics
            const atomicTopics = getAtomicTopics(topicStr, normalizedTopics);

            for (const atomicTopic of atomicTopics) {
              const topicDbId = topicIdMap.get(atomicTopic);
              if (!topicDbId) {
                console.warn(`   ⚠️  Topic not found in map: "${atomicTopic}" (from "${topicStr}")`);
                continue;
              }

              try {
                await db.execute({
                  sql: `INSERT OR IGNORE INTO bridge_exam_subject_topic
                        (exam_id, subject_id, topic_id, is_mandatory, weightage)
                        VALUES (?, ?, ?, ?, ?)`,
                  args: [examDbId, subjectDbId, topicDbId, true, 5],
                });
                bridgeCount++;
              } catch (err: any) {
                if (!err.message?.includes('UNIQUE constraint')) {
                  console.error(`   ⚠️  Failed to create bridge mapping:`, err.message);
                }
              }
            }
          }
        }
      }
    }

    console.log(`   ✅ Created ${bridgeCount} bridge mappings\n`);

    // Verification
    console.log("6️⃣  Verification:");
    const examsResult = await db.execute(`SELECT COUNT(*) as cnt FROM dim_exams`);
    const subjectsResult = await db.execute(`SELECT COUNT(*) as cnt FROM dim_subjects`);
    const topicsResult = await db.execute(`SELECT COUNT(*) as cnt FROM dim_topics`);
    const bridgeResult = await db.execute(`SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic`);

    console.log(`   Exams: ${examsResult.rows[0].cnt}`);
    console.log(`   Subjects: ${subjectsResult.rows[0].cnt}`);
    console.log(`   Topics: ${topicsResult.rows[0].cnt} (normalized, deduplicated)`);
    console.log(`   Bridge mappings: ${bridgeResult.rows[0].cnt}\n`);

    // Show examples
    console.log("7️⃣  Example topics with their relationships:");
    const examples = await db.execute(`
      SELECT t1.id, t1.topic_name, t1.scope, t2.topic_name as parent_name,
             (SELECT COUNT(DISTINCT exam_id) FROM bridge_exam_subject_topic WHERE topic_id = t1.id) as exam_count
      FROM dim_topics t1
      LEFT JOIN dim_topics t2 ON t1.parent_topic_id = t2.id
      WHERE t1.scope = 'universal'
      ORDER BY exam_count DESC
      LIMIT 10
    `);

    for (const row of examples.rows) {
      const parent = row.parent_name ? ` (child of ${row.parent_name})` : '';
      console.log(`   ${row.topic_name}${parent}: used in ${row.exam_count} exams`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ Phase 2 Complete: Dimensions populated with normalized topics!");
    console.log("=".repeat(80));
    console.log("\n🎯 Key Achievement:");
    console.log("   Topics like 'Kinematics' are now SHARED across all exams.");
    console.log("   Questions will be stored ONCE and pulled by multiple exams!\n");
    console.log("Next steps:");
    console.log("  - Run Phase 4: Migrate questions (they'll be linked to normalized topics)");
    console.log("  - Questions will be SHARED across exams that use the same topic");
    console.log("");

  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function getSubjectCategory(subjectName: string): string {
  const lower = subjectName.toLowerCase();

  if (lower.includes('physics')) return 'science';
  if (lower.includes('chemistry')) return 'science';
  if (lower.includes('biology') || lower.includes('botany') || lower.includes('zoology')) return 'science';
  if (lower.includes('math')) return 'mathematics';
  if (lower.includes('quantitative') || lower.includes('arithmetic')) return 'mathematics';
  if (lower.includes('reasoning') || lower.includes('logical')) return 'reasoning';
  if (lower.includes('english') || lower.includes('verbal')) return 'language';
  if (lower.includes('history') || lower.includes('geography') || lower.includes('polity') || lower.includes('economics')) return 'social-science';
  if (lower.includes('current affairs') || lower.includes('gk') || lower.includes('general knowledge')) return 'general-knowledge';

  return 'general-knowledge';
}

main().catch(console.error);
