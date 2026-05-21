#!/usr/bin/env tsx
/**
 * Reassign Questions from Invalid Topics to Valid Topics
 *
 * Mapping strategy based on question analysis:
 * - "" (empty) → Physics topics (based on question content)
 * - "250" → "Reading Comprehension" or "Essay Writing"
 * - "2D" → "Coordinate Geometry" or "Mensuration - 2D"
 * - "3" → "Venn Diagrams" or "Set Theory"
 * - "3D" → "Three Dimensional Geometry" or "Vectors"
 * - "A" / "An" → "Grammar - Articles & Determiners"
 * - "AGP" → "Sequences & Series" (AP, GP, HP, AGP)
 * - "AI" → "Information Technology" or "Science & Technology Updates"
 * - "AP" → "Sequences & Series"
 * - "Art" → "Art & Culture"
 * - "Bar" → "Data Interpretation - Bar Graphs"
 * - "Bio" → "Biotechnology & Genetic Engineering" or "Renewable Energy"
 * - "Box" → "Puzzles & Seating Arrangement"
 * - "CAG" / "CIC" → "Constitutional Bodies"
 * - "CFT" → "Coordination Compounds" (CFT = Crystal Field Theory)
 * - "CT" → "Radiology" or "Medical Technology"
 * - "Chi" → "Probability" (Chi-square test)
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

// Mapping of invalid topic ID → correct topic name
const topicMappings: Record<number, string> = {
  64: "Physics", // empty string → general Physics
  1992: "Reading Comprehension", // "250" → RC
  2905: "Coordinate Geometry", // "2D" → Coordinate Geometry
  2244: "Venn Diagrams", // "3" → Venn Diagrams
  1236: "Three Dimensional Geometry", // "3D" → 3D Geometry
  2097: "Grammar - Articles & Determiners", // "A" → Articles
  2098: "Grammar - Articles & Determiners", // "An" → Articles
  1194: "Sequences & Series", // "AGP" → Sequences
  1739: "Information Technology", // "AI" → IT
  2274: "Sequences & Series", // "AP" → Sequences
  2685: "Art & Culture", // "Art" → Art & Culture
  1818: "Data Interpretation - Bar Graphs", // "Bar" → Bar Graphs
  1758: "Biotechnology & Genetic Engineering", // "Bio" → Biotech
  1832: "Puzzles & Seating Arrangement", // "Box" → Puzzles
  1599: "Constitutional Bodies", // "CAG" → Constitutional Bodies
  1604: "Constitutional Bodies", // "CIC" → Constitutional Bodies
  1157: "Coordination Compounds", // "CFT" → Coordination Compounds
  1557: "Radiology", // "CT" → Radiology
  3007: "Probability", // "Chi" → Probability
};

async function reassignQuestions() {
  console.log("\n🔄 Reassigning Questions from Invalid Topics...\n");
  console.log("=" .repeat(80));

  let totalReassigned = 0;
  let totalErrors = 0;

  for (const [invalidTopicId, correctTopicName] of Object.entries(topicMappings)) {
    const topicId = Number(invalidTopicId);

    console.log(`\n📚 Processing topic ID ${topicId} → "${correctTopicName}"`);

    // Find the correct topic ID
    const targetTopicResult = await db.execute({
      sql: "SELECT id FROM dim_topics WHERE topic_name = ?",
      args: [correctTopicName]
    });

    if (targetTopicResult.rows.length === 0) {
      console.log(`  ⚠️  Target topic "${correctTopicName}" not found in database. Skipping.`);
      continue;
    }

    const targetTopicId = Number(targetTopicResult.rows[0].id);

    // Count questions to reassign
    const countResult = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM fact_exam_questions WHERE topic_id = ?",
      args: [topicId]
    });

    const questionCount = Number(countResult.rows[0].cnt);

    if (questionCount === 0) {
      console.log(`  ℹ️  No questions to reassign.`);
      continue;
    }

    // Reassign questions
    try {
      await db.execute({
        sql: "UPDATE fact_exam_questions SET topic_id = ? WHERE topic_id = ?",
        args: [targetTopicId, topicId]
      });

      console.log(`  ✅ Reassigned ${questionCount} questions to "${correctTopicName}"`);
      totalReassigned += questionCount;
    } catch (error: any) {
      console.error(`  ❌ Error reassigning: ${error.message}`);
      totalErrors++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`\n📊 Reassignment Summary:`);
  console.log(`  Total questions reassigned: ${totalReassigned}`);
  console.log(`  Errors: ${totalErrors}\n`);

  // Now delete the invalid topics (should be safe now)
  console.log("🗑️  Deleting invalid topics (now empty)...\n");

  let deletedCount = 0;
  for (const topicId of Object.keys(topicMappings).map(Number)) {
    try {
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [topicId]
      });
      deletedCount++;
    } catch (error: any) {
      console.error(`  ⚠️  Could not delete topic ID ${topicId}: ${error.message}`);
    }
  }

  console.log(`  ✅ Deleted ${deletedCount}/${Object.keys(topicMappings).length} invalid topics\n`);

  // Final verification
  const finalTopicCount = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const finalQuestionCount = await db.execute("SELECT COUNT(*) as cnt FROM fact_exam_questions");

  console.log("=" .repeat(80));
  console.log("\n✅ Reassignment Complete!");
  console.log(`\n📊 Final Statistics:`);
  console.log(`  Topics in database: ${finalTopicCount.rows[0].cnt}`);
  console.log(`  Questions in database: ${finalQuestionCount.rows[0].cnt}`);
  console.log();
}

reassignQuestions().catch((error) => {
  console.error("\n❌ Reassignment failed:", error);
  process.exit(1);
});
