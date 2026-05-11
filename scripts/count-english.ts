import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf-8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

const client = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

async function check() {
  const result = await client.execute("SELECT COUNT(*) as count FROM english_questions");
  console.log(`Total English questions: ${result.rows[0].count}`);
  
  const breakdown = await client.execute(`
    SELECT path_id, topic_id, level, COUNT(*) as count
    FROM english_questions
    GROUP BY path_id, topic_id, level
    ORDER BY count DESC
  `);
  
  console.log("\nBreakdown:");
  breakdown.rows.forEach(row => {
    console.log(`  ${row.path_id} > ${row.topic_id} (${row.level}): ${row.count}`);
  });
}

check().then(() => process.exit(0));
