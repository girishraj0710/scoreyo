import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

async function check() {
  console.log("\n📋 Checking quiz_sessions table schema...\n");

  const schema = await db.execute("PRAGMA table_info(quiz_sessions)");
  console.log("Current columns:");
  schema.rows.forEach((r: any) => {
    console.log(`  - ${r.name} (${r.type})`);
  });

  const hasSourceStats = schema.rows.some((r: any) => r.name === 'source_stats');
  const hasSprintId = schema.rows.some((r: any) => r.name === 'sprint_id');

  console.log(`\n✅ Column Check:`);
  console.log(`  source_stats: ${hasSourceStats ? 'EXISTS ✅' : 'MISSING ❌'}`);
  console.log(`  sprint_id:    ${hasSprintId ? 'EXISTS ✅' : 'MISSING ❌'}`);

  if (!hasSourceStats || !hasSprintId) {
    console.log(`\n⚠️  Missing columns detected. Need to add:`);
    if (!hasSourceStats) console.log(`  - source_stats TEXT (tracks verified vs AI question sources)`);
    if (!hasSprintId) console.log(`  - sprint_id TEXT (tracks sprint participation)`);
  } else {
    console.log(`\n✅ All required columns exist!`);
  }
}

check().catch(console.error);
