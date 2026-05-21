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

async function cleanup() {
  console.log("\n🔧 Cleaning Remaining Orphans...\n");

  // Find orphans
  const orphans = await db.execute(`
    SELECT id, topic_name FROM dim_topics t
    WHERE (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = t.id) = 0
  `);

  console.log(`Found ${orphans.rows.length} remaining orphans\n`);

  for (const row of orphans.rows) {
    const id = Number(row.id);

    try {
      // Clear parent references
      await db.execute({
        sql: "UPDATE dim_topics SET parent_topic_id = NULL WHERE parent_topic_id = ?",
        args: [id]
      });

      // Delete questions if any
      await db.execute({
        sql: "DELETE FROM fact_exam_questions WHERE topic_id = ?",
        args: [id]
      });

      // Delete topic
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [id]
      });

      console.log(`✅ Deleted: "${row.topic_name}"`);
    } catch (error: any) {
      console.log(`❌ Error with "${row.topic_name}": ${error.message}`);
    }
  }

  const final = await db.execute(`
    SELECT COUNT(*) as cnt FROM dim_topics t
    WHERE (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE topic_id = t.id) = 0
  `);

  console.log(`\n📊 Remaining orphans: ${final.rows[0].cnt}\n`);
}

cleanup().then(() => process.exit(0)).catch(console.error);
