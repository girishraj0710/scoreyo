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

async function fix() {
  console.log("\n🔧 Fixing Parent References...\n");

  const ids = [2958, 1542];

  for (const id of ids) {
    // Set parent_topic_id to NULL for all children
    const result = await db.execute({
      sql: "UPDATE dim_topics SET parent_topic_id = NULL WHERE parent_topic_id = ?",
      args: [id]
    });
    console.log(`✅ Unlinked ${result.rowsAffected} child topics from parent ${id}`);

    // Now delete the parent
    try {
      await db.execute({
        sql: "DELETE FROM dim_topics WHERE id = ?",
        args: [id]
      });
      console.log(`✅ Deleted topic ${id}`);
    } catch (error: any) {
      console.error(`❌ Error deleting ${id}: ${error.message}`);
    }
  }

  const final = await db.execute("SELECT COUNT(*) as cnt FROM dim_topics");
  console.log(`\n📊 Final topic count: ${final.rows[0].cnt}\n`);
}

fix().then(() => process.exit(0)).catch(console.error);
