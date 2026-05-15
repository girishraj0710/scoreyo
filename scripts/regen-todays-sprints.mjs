/**
 * One-off: delete today's sprints from Turso and re-trigger the local cron
 * endpoint so today's sprints are regenerated with the new question count.
 *
 * Run with: node --env-file=.env.local scripts/regen-todays-sprints.mjs
 */
import { createClient } from "@libsql/client";

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, CRON_SECRET } = process.env;
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN || !CRON_SECRET) {
  console.error("Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN / CRON_SECRET in env");
  process.exit(1);
}

const db = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });
const today = new Date().toISOString().split("T")[0];

console.log(`\nRegenerating sprints for ${today}`);

const before = await db.execute({
  sql: "SELECT id FROM daily_sprints WHERE date = ?",
  args: [today],
});
console.log(`Found ${before.rows.length} existing sprints for today.`);

if (before.rows.length > 0) {
  const ids = before.rows.map((r) => r.id);
  // Wipe any participations tied to today's sprints to avoid orphaned FKs
  await db.execute({
    sql: `DELETE FROM sprint_participations WHERE sprint_id IN (${ids
      .map(() => "?")
      .join(",")})`,
    args: ids,
  });
  await db.execute({
    sql: "DELETE FROM daily_sprints WHERE date = ?",
    args: [today],
  });
  console.log(`Deleted ${ids.length} sprint rows + their participations.`);
}

console.log("\nTriggering local cron endpoint...");
const url = `http://localhost:3000/api/cron/create-sprint?secret=${encodeURIComponent(
  CRON_SECRET
)}`;

const res = await fetch(url);
const body = await res.json();
console.log("Status:", res.status);
console.log(JSON.stringify(body, null, 2));
