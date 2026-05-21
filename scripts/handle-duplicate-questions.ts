#!/usr/bin/env tsx
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

async function handleDuplicates() {
  console.log("\n🔄 Handling Duplicate Questions...\n");
  console.log("=" .repeat(80));

  const problematicTopics = [
    { id: 1157, name: "CFT", target: "Coordination Compounds" },
    { id: 2098, name: "An", target: "Grammar - Articles & Determiners" },
    { id: 2905, name: "2D", target: "Coordinate Geometry" }
  ];

  for (const topic of problematicTopics) {
    console.log(`\n📚 Processing "${topic.name}" (ID ${topic.id})`);

    const questionsResult = await db.execute({
      sql: "SELECT COUNT(*) as cnt FROM fact_exam_questions WHERE topic_id = ?",
      args: [topic.id]
    });

    const count = Number(questionsResult.rows[0].cnt);
    console.log(`  Questions remaining: ${count}`);

    if (count === 0) {
      console.log(`  ℹ️  No questions left. Safe to delete.`);
      
      try {
        await db.execute({
          sql: "DELETE FROM dim_topics WHERE id = ?",
          args: [topic.id]
        });
        console.log(`  ✅ Deleted topic`);
      } catch (error: any) {
        console.log(`  ⚠️  Could not delete: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️  Has ${count} questions - likely duplicates. Deleting duplicates...`);
      
      // Just delete the duplicate questions (they exist elsewhere)
      try {
        await db.execute({
          sql: "DELETE FROM fact_exam_questions WHERE topic_id = ?",
          args: [topic.id]
        });
        console.log(`  ✅ Deleted ${count} duplicate questions`);
        
        // Now delete the topic
        await db.execute({
          sql: "DELETE FROM dim_topics WHERE id = ?",
          args: [topic.id]
        });
        console.log(`  ✅ Deleted topic`);
      } catch (error: any) {
        console.log(`  ⚠️  Error: ${error.message}`);
      }
    }
  }

  console.log("\n" + "=".repeat(80));

  const finalTopics = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  const finalQuestions = await db.execute("SELECT COUNT(*) as cnt FROM fact_exam_questions");

  console.log(`\n📊 Final Counts:`);
  console.log(`  Topics: ${finalTopics.rows[0].cnt}`);
  console.log(`  Questions: ${finalQuestions.rows[0].cnt}\n`);
}

handleDuplicates().then(() => process.exit(0)).catch(console.error);
