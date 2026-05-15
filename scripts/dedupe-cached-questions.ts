/**
 * Deduplicates `cached_questions` by question text.
 *
 * Why: when we seeded `exam_questions` from `cached_questions` we found that
 * 16,199 of the 29,536 cached rows (≈55%) had duplicate question text. That's
 * a huge variety dilution at runtime — `getCachedQuestions` returns rows at
 * random, so the same text can keep coming up for a user.
 *
 * Strategy:
 *   - Group rows by `LOWER(TRIM(question text from question_json))`.
 *   - Within each group, keep ONE row (highest `used_count`, then lowest `id`
 *     as deterministic tiebreaker). That preserves the most-loved variant.
 *   - Delete the rest in batched IDs.
 *
 * Idempotent and safe to re-run. The script reports what it WILL delete
 * before doing anything, then proceeds (set DRY_RUN=true to skip the delete).
 *
 * Run:
 *   npx tsx scripts/dedupe-cached-questions.ts
 *   DRY_RUN=true npx tsx scripts/dedupe-cached-questions.ts   # preview only
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf-8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length) envVars[key.trim()] = valueParts.join("=").trim();
});

const DRY_RUN = process.env.DRY_RUN === "true";

const db = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

const PAGE_SIZE = 2000;
const DELETE_BATCH = 200;
const INTER_BATCH_DELAY_MS = 150;

async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = 8): Promise<T> {
  let delay = 1500;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err?.message || String(err);
      const cause = err?.cause?.code || "";
      const transient = /fetch failed|socket|ECONN|ETIMEDOUT|EAI_AGAIN|UND_ERR/i.test(
        msg + " " + cause
      );
      if (!transient || i === attempts) throw err;
      console.warn(
        `\n  [${label}] attempt ${i}/${attempts} failed (${cause || msg.slice(0, 60)}), retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, 15000);
    }
  }
  throw new Error("unreachable");
}

function normaliseKey(q: string): string {
  return (q || "").toLowerCase().trim();
}

type Row = { id: number; key: string; usedCount: number };

async function loadAll(): Promise<Row[]> {
  const rows: Row[] = [];
  let offset = 0;
  while (true) {
    const res = await withRetry(
      () =>
        db.execute({
          sql:
            "SELECT id, used_count, question_json FROM cached_questions ORDER BY id LIMIT ? OFFSET ?",
          args: [PAGE_SIZE, offset],
        }),
      "loadAll"
    );
    if (res.rows.length === 0) break;
    for (const r of res.rows) {
      try {
        const q = JSON.parse(String(r.question_json));
        const key = normaliseKey(String(q?.question || ""));
        if (!key) continue;
        rows.push({
          id: Number(r.id),
          key,
          usedCount: Number(r.used_count ?? 0),
        });
      } catch {
        // skip malformed; will be untouched
      }
    }
    process.stdout.write(`\r  loaded ${rows.length} rows...`);
    if (res.rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  console.log();
  return rows;
}

async function deleteIds(ids: number[]) {
  let done = 0;
  while (done < ids.length) {
    const slice = ids.slice(done, done + DELETE_BATCH);
    const placeholders = slice.map(() => "?").join(",");
    await withRetry(
      () =>
        db.execute({
          sql: `DELETE FROM cached_questions WHERE id IN (${placeholders})`,
          args: slice,
        }),
      "delete"
    );
    done += slice.length;
    process.stdout.write(`\r  deleted ${done}/${ids.length}`);
    await new Promise((r) => setTimeout(r, INTER_BATCH_DELAY_MS));
  }
  console.log();
}

async function main() {
  console.log("=== Dedupe cached_questions ===\n");

  const before = await db.execute("SELECT COUNT(*) AS n FROM cached_questions");
  console.log(`Rows BEFORE: ${before.rows[0].n}`);

  console.log("\nLoading all rows...");
  const all = await loadAll();
  console.log(`  total parseable rows: ${all.length}`);

  console.log("\nGrouping by question text...");
  const winners = new Map<string, Row>(); // key -> winning row
  const losers: number[] = []; // ids to delete

  for (const r of all) {
    const cur = winners.get(r.key);
    if (!cur) {
      winners.set(r.key, r);
    } else {
      // Pick higher used_count, then lower id as deterministic tiebreaker.
      const replace =
        r.usedCount > cur.usedCount ||
        (r.usedCount === cur.usedCount && r.id < cur.id);
      if (replace) {
        losers.push(cur.id);
        winners.set(r.key, r);
      } else {
        losers.push(r.id);
      }
    }
  }

  console.log(`  unique question texts: ${winners.size}`);
  console.log(`  rows to delete:        ${losers.length}`);
  console.log(`  rows to keep:          ${winners.size}`);

  if (losers.length === 0) {
    console.log("\nNothing to delete. cached_questions is already deduped.");
    return;
  }

  if (DRY_RUN) {
    console.log("\nDRY_RUN=true — not deleting. Re-run without DRY_RUN to apply.");
    return;
  }

  console.log("\nDeleting losers...");
  await deleteIds(losers);

  const after = await db.execute("SELECT COUNT(*) AS n FROM cached_questions");
  console.log(`\nRows AFTER:  ${after.rows[0].n}`);
  console.log(`Net removed: ${Number(before.rows[0].n) - Number(after.rows[0].n)}`);
}

main().catch((err) => {
  console.error("Dedupe failed:", err);
  process.exit(1);
});
