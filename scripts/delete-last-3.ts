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

async function deleteLast3() {
  const ids = [2958, 1542, 1882];

  for (const id of ids) {
    try {
      // First check bridge mappings
      const bridgeResult = await db.execute({
        sql: "SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic WHERE topic_id = ?",
        args: [id]
      });

      if (Number(bridgeResult.rows[0].cnt) > 0) {
        // Delete bridge mappings first
        await db.execute({
          sql: "DELETE FROM bridge_exam_subject_topic WHERE topic_id = ?",
          args: [id]
        });
        console.log(`Deleted bridge mappings for topic ${id}`);
      }

      // Now delete topic
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [id]
      });
      console.log(`✅ Deleted topic ${id}`);
    } catch (error: any) {
      console.error(`❌ Error deleting ${id}: ${error.message}`);
    }
  }

  const finalCount = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  console.log(`\n📊 Final topic count: ${finalCount.rows[0].cnt}`);
}

deleteLast3().then(() => process.exit(0)).catch(console.error);
