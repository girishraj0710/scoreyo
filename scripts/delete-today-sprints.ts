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

async function deleteSprints() {
  const today = new Date().toISOString().split('T')[0];
  await db.execute({ sql: "DELETE FROM daily_sprints WHERE date = ?", args: [today] });
  console.log("✅ Deleted all sprints for today");
}

deleteSprints().catch(console.error);
