// Quick DB inventory: counts rows in every question-bearing table and breaks
// them down per exam / subject where it matters. Run with:
//   node --env-file=.env.local scripts/count-questions.mjs
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function table(name) {
  try {
    const r = await db.execute(`SELECT COUNT(*) AS n FROM ${name}`);
    return Number(r.rows[0].n);
  } catch (e) {
    return `ERR(${e.message.split("\n")[0]})`;
  }
}

async function groupBy(sql) {
  try {
    const r = await db.execute(sql);
    return r.rows;
  } catch (e) {
    return [{ err: e.message.split("\n")[0] }];
  }
}

console.log("=== PrepGenie question inventory ===\n");

console.log("Top-level table counts:");
console.log("  exam_questions     :", await table("exam_questions"));
console.log("  english_questions  :", await table("english_questions"));
console.log("  cached_questions   :", await table("cached_questions"));
console.log("  daily_sprints      :", await table("daily_sprints"));

console.log("\nexam_questions by exam_id:");
for (const r of await groupBy(
  "SELECT exam_id, COUNT(*) AS n FROM exam_questions GROUP BY exam_id ORDER BY n DESC"
)) {
  console.log(`  ${(r.exam_id ?? "(null)").toString().padEnd(20)} ${r.n}`);
}

console.log("\nexam_questions by exam_id + subject_id (top 30):");
for (const r of await groupBy(
  "SELECT exam_id, subject_id, COUNT(*) AS n FROM exam_questions GROUP BY exam_id, subject_id ORDER BY n DESC LIMIT 30"
)) {
  console.log(`  ${(r.exam_id ?? "").toString().padEnd(15)} ${(r.subject_id ?? "").toString().padEnd(25)} ${r.n}`);
}

console.log("\nenglish_questions by path + topic (top 20):");
for (const r of await groupBy(
  "SELECT path_id, topic_id, COUNT(*) AS n FROM english_questions GROUP BY path_id, topic_id ORDER BY n DESC LIMIT 20"
)) {
  console.log(`  ${(r.path_id ?? "").toString().padEnd(20)} ${(r.topic_id ?? "").toString().padEnd(28)} ${r.n}`);
}

console.log("\ncached_questions by exam_id (top 20):");
for (const r of await groupBy(
  "SELECT exam_id, COUNT(*) AS n FROM cached_questions GROUP BY exam_id ORDER BY n DESC LIMIT 20"
)) {
  console.log(`  ${(r.exam_id ?? "").toString().padEnd(20)} ${r.n}`);
}

console.log("\ncached_questions by exam_id + subject_id + topic (top 30):");
for (const r of await groupBy(
  "SELECT exam_id, subject_id, topic, COUNT(*) AS n FROM cached_questions GROUP BY exam_id, subject_id, topic ORDER BY n DESC LIMIT 30"
)) {
  console.log(
    `  ${(r.exam_id ?? "").toString().padEnd(15)} ${(r.subject_id ?? "").toString().padEnd(20)} ${(r.topic ?? "").toString().padEnd(35)} ${r.n}`
  );
}
