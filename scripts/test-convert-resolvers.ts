// Tests for the /api/convert source resolvers (src/lib/convert-resolvers.ts).
//
// Part A: pure unit tests for flattenStudyContent (no DB).
// Part B: integration tests for resolveGuide against english_study_content and
//         topic_study_content using throwaway rows, cleaned up in finally.
// Part C: guard-path tests for resolveMaterial (missing id / not found /
//         non-approved) — these return before any Supabase Storage download.
//
// Run: npx tsx scripts/test-convert-resolvers.ts

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
if (process.env.POSTGRES_URL && !process.env.NODE_ENV) {
  process.env.NODE_ENV = "production"; // force SSL for the Supabase pooler
}

import { randomUUID } from "crypto";
import { getPool } from "../src/lib/db";
import { ExtractionError } from "../src/lib/content-extraction";
import {
  flattenStudyContent,
  resolveGuide,
  resolveMaterial,
} from "../src/lib/convert-resolvers";

let passed = 0;
let failed = 0;
function ok(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`); }
}
async function throwsExtraction(fn: () => Promise<unknown>, msgIncludes?: string): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch (err) {
    if (!(err instanceof ExtractionError)) return false;
    return msgIncludes ? err.message.includes(msgIncludes) : true;
  }
}

// A short but >100-char body so resolvers pass the min-length guard.
const SAMPLE_CONTENT = {
  sections: [
    {
      title: "Present Simple",
      content: [
        { type: "paragraph", text: "The present simple describes habits and general truths that happen regularly over time." },
        {
          type: "example",
          examples: [
            { text: "She walks to school every day.", explanation: "Habitual action in the present simple tense." },
          ],
        },
        {
          type: "practice",
          questions: [
            { question: "Conjugate 'to go' for he.", answer: "He goes.", explanation: "Third person singular adds -es." },
          ],
        },
        { type: "list", items: ["First point about usage.", "Second point about form."] },
      ],
    },
  ],
};

// Unique ids so we never collide with real rows.
const SUFFIX = randomUUID().slice(0, 8);
const ENG_PATH = `__test_path_${SUFFIX}`;
const ENG_TOPIC = `__test_topic_${SUFFIX}`;
const EXAM_TOPIC_NAME = `Zztest Topic ${SUFFIX}`;
const EXAM_TOPIC_SLUG = EXAM_TOPIC_NAME.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

async function run() {
  const pool = getPool();
  try {
    // --- Part A: flattenStudyContent (pure) -------------------------------
    console.log("\n1. flattenStudyContent (pure)");
    const flat = flattenStudyContent(SAMPLE_CONTENT);
    ok("includes section title", flat.includes("Present Simple"));
    ok("includes paragraph text", flat.includes("habits and general truths"));
    ok("includes example text", flat.includes("She walks to school every day."));
    ok("includes example explanation", flat.includes("Habitual action"));
    ok("includes practice question", flat.includes("Conjugate 'to go'"));
    ok("includes practice answer", flat.includes("He goes."));
    ok("includes list items", flat.includes("First point about usage."));
    ok("non-object → empty string", flattenStudyContent(null) === "" && flattenStudyContent("x") === "");
    ok("missing sections → empty string", flattenStudyContent({}) === "");
    ok("non-array sections → empty string", flattenStudyContent({ sections: "nope" }) === "");
    ok("result is trimmed", flat === flat.trim() && flat.length > 100);

    // --- Part B: resolveGuide (english lesson) ----------------------------
    console.log("\n2. resolveGuide — english lesson (english_study_content)");
    await pool.query(
      `INSERT INTO english_study_content (subject_id, path_id, topic_id, title, content)
       VALUES ('english', $1, $2, $3, $4)`,
      [ENG_PATH, ENG_TOPIC, "Test English Lesson", JSON.stringify(SAMPLE_CONTENT)]
    );
    const eng = await resolveGuide({ pathId: ENG_PATH, topicId: ENG_TOPIC });
    ok("resolves lesson text", eng.text.includes("She walks to school"));
    ok("uses row title", eng.title === "Test English Lesson");
    ok("sourceRef is path/topic", eng.sourceRef === `${ENG_PATH}/${ENG_TOPIC}`);
    ok("title override respected", (await resolveGuide({ pathId: ENG_PATH, topicId: ENG_TOPIC, title: "Custom" })).title === "Custom");
    ok("unknown lesson → ExtractionError", await throwsExtraction(
      () => resolveGuide({ pathId: ENG_PATH, topicId: "__nope__" }), "No study content"));

    console.log("\n3. resolveGuide — thin english lesson is rejected");
    const THIN_PATH = `${ENG_PATH}_thin`;
    await pool.query(
      `INSERT INTO english_study_content (subject_id, path_id, topic_id, title, content)
       VALUES ('english', $1, $2, $3, $4)`,
      [THIN_PATH, ENG_TOPIC, "Thin", JSON.stringify({ sections: [{ title: "x", content: [{ type: "paragraph", text: "too short" }] }] })]
    );
    ok("too-little-content → ExtractionError", await throwsExtraction(
      () => resolveGuide({ pathId: THIN_PATH, topicId: ENG_TOPIC }), "too little content"));

    // --- Part B: resolveGuide (exam topic) --------------------------------
    console.log("\n4. resolveGuide — exam topic (topic_study_content, slug match)");
    await pool.query(
      `INSERT INTO topic_study_content (subject_id, path_id, topic_id, title, subtitle, overview, difficulty_level, content)
       VALUES ('physics', 'foundation', $1, $2, $3, $4, $5, $6)`,
      [EXAM_TOPIC_SLUG, EXAM_TOPIC_NAME, "Test subtitle", "Test overview", "beginner", JSON.stringify(SAMPLE_CONTENT)]
    );
    const exam = await resolveGuide({ topicName: EXAM_TOPIC_NAME });
    ok("resolves via slug", exam.text.includes("She walks to school"));
    ok("sourceRef is slug", exam.sourceRef === EXAM_TOPIC_SLUG);
    ok("title from row", exam.title === EXAM_TOPIC_NAME);

    console.log("\n5. resolveGuide — exam topic ILIKE fallback");
    // Row whose topic_id is a slug that the searched-for name will NOT slugify
    // to, but whose title CONTAINS the searched-for name — forces the ILIKE
    // branch (first slug query misses, title ILIKE '%name%' hits).
    const ILIKE_TOPIC_ID = `zzilike-diff-${SUFFIX}`;
    const ILIKE_SEARCH = `Zzfuzzy ${SUFFIX}`; // slug 'zzfuzzy-<suffix>' ≠ topic_id
    await pool.query(
      `INSERT INTO topic_study_content (subject_id, path_id, topic_id, title, subtitle, overview, difficulty_level, content)
       VALUES ('physics', 'foundation', $1, $2, $3, $4, $5, $6)`,
      [ILIKE_TOPIC_ID, `${ILIKE_SEARCH} Advanced Concepts`, "Test subtitle", "Test overview", "beginner", JSON.stringify(SAMPLE_CONTENT)]
    );
    const fuzzy = await resolveGuide({ topicName: ILIKE_SEARCH });
    ok("ILIKE fallback finds row", fuzzy.text.includes("She walks to school"));
    ok("ILIKE fallback sourceRef is slug of search", fuzzy.sourceRef === "zzfuzzy-" + SUFFIX);

    console.log("\n6. resolveGuide — missing identifiers / unknown topic");
    ok("no identifiers → ExtractionError", await throwsExtraction(
      () => resolveGuide({}), "Missing guide identifiers"));
    ok("unknown topic → ExtractionError", await throwsExtraction(
      () => resolveGuide({ topicName: `no-such-topic-${SUFFIX}` }), "No study content"));

    // --- Part C: resolveMaterial guard paths ------------------------------
    console.log("\n7. resolveMaterial — guard paths (no Storage access)");
    ok("missing materialId → ExtractionError", await throwsExtraction(
      () => resolveMaterial({}), "Missing material id"));
    ok("not-found material → ExtractionError", await throwsExtraction(
      () => resolveMaterial({ materialId: randomUUID() }), "Material not found"));
  } finally {
    // Teardown — remove all throwaway rows we created.
    const pool = getPool();
    await pool.query("DELETE FROM english_study_content WHERE path_id = ANY($1)", [[ENG_PATH, `${ENG_PATH}_thin`]]);
    await pool.query("DELETE FROM topic_study_content WHERE topic_id = ANY($1)", [[EXAM_TOPIC_SLUG, `zzilike-diff-${SUFFIX}`]]);
  }

  console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => { console.error("FATAL:", err); process.exit(1); });
