#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

type TopicCandidate = {
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  currentCount: number;
  lastAttemptAt?: string;
};

type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

type RotationEntry = {
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  lastStatus?: "success" | "failed" | "empty";
  attempts: number;
  insertedTotal: number;
};

type RotationTracker = Record<string, RotationEntry>;

const ROTATION_TRACKER_FILE = join(process.cwd(), ".free-seed-rotation.json");

function topicKey(examId: string, subjectId: string, topic: string): string {
  return `${examId}::${subjectId}::${topic}`;
}

function loadRotationTracker(): RotationTracker {
  try {
    if (!existsSync(ROTATION_TRACKER_FILE)) return {};
    const parsed = JSON.parse(readFileSync(ROTATION_TRACKER_FILE, "utf-8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveRotationTracker(tracker: RotationTracker) {
  writeFileSync(ROTATION_TRACKER_FILE, JSON.stringify(tracker, null, 2), "utf-8");
}

function selectDiverseCandidates(candidates: TopicCandidate[], maxTopics: number): TopicCandidate[] {
  const bySubject = new Map<string, TopicCandidate[]>();
  for (const c of candidates) {
    const key = `${c.examId}::${c.subjectId}`;
    if (!bySubject.has(key)) bySubject.set(key, []);
    bySubject.get(key)!.push(c);
  }

  for (const bucket of bySubject.values()) {
    bucket.sort((a, b) => a.currentCount - b.currentCount);
  }

  const subjectKeys = Array.from(bySubject.keys());
  subjectKeys.sort();

  const selected: TopicCandidate[] = [];
  let guard = 0;
  while (selected.length < maxTopics && guard < 100000) {
    guard++;
    let addedThisRound = false;
    for (const key of subjectKeys) {
      const bucket = bySubject.get(key);
      if (!bucket || bucket.length === 0) continue;
      selected.push(bucket.shift()!);
      addedThisRound = true;
      if (selected.length >= maxTopics) break;
    }
    if (!addedThisRound) break;
  }
  return selected;
}

function selectLeastFirstCandidates(candidates: TopicCandidate[], maxTopics: number): TopicCandidate[] {
  return candidates.slice(0, maxTopics);
}

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  const env = readFileSync(envPath, "utf-8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (!match) return;
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  });
}

function parseArg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1 || !process.argv[idx + 1]) return fallback;
  return process.argv[idx + 1];
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

async function callOllama(model: string, prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1800,
        },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`Ollama error ${response.status}: ${txt}`);
    }
    const data = await response.json();
    return data.response || "";
  } finally {
    clearTimeout(timeout);
  }
}

function extractJsonArray(raw: string): string | null {
  const start = raw.indexOf("[");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) return raw.slice(start, i + 1);
    }
  }
  return null;
}

function parseQuestions(raw: string): GeneratedQuestion[] {
  let text = raw.trim();
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  const jsonArray = extractJsonArray(text);
  if (!jsonArray) return [];

  const parsed = JSON.parse(jsonArray);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((q) =>
      q &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === "number" &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3 &&
      typeof q.explanation === "string" && // No length check - accept all explanations
      ["easy", "medium", "hard"].includes(String(q.difficulty))
    )
    .map((q) => ({
      question: String(q.question).trim(),
      options: q.options.map((o: unknown) => String(o)),
      correctAnswer: q.correctAnswer,
      explanation: String(q.explanation).trim(),
      difficulty: q.difficulty,
    }));
}

async function generateForTopic(
  model: string,
  examName: string,
  subjectName: string,
  topic: string,
  count: number,
  chunkSize: number,
  retriesPerChunk: number
): Promise<GeneratedQuestion[]> {
  const collected: GeneratedQuestion[] = [];
  const seen = new Set<string>();
  let guard = 0;

  while (collected.length < count && guard < 50) {
    guard++;
    const want = Math.min(chunkSize, count - collected.length);
    const prompt = `Generate exactly ${want} high-quality MCQ questions for Indian exam prep.

Exam: ${examName}
Subject: ${subjectName}
Topic: ${topic}

Return ONLY valid JSON array:
[
  {
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation with core concept and why the correct option is right.",
    "difficulty": "easy"
  }
]

Rules:
- Keep exam pattern realistic.
- Keep factual accuracy high.
- Mix conceptual and application-style questions.
- Difficulty mix approx: easy 30%, medium 50%, hard 20%.
- No markdown, no extra text outside JSON array.`;

    let parsedChunk: GeneratedQuestion[] = [];
    let ok = false;
    for (let attempt = 1; attempt <= retriesPerChunk; attempt++) {
      try {
        const raw = await callOllama(model, prompt);
        parsedChunk = parseQuestions(raw);
        if (parsedChunk.length > 0) {
          ok = true;
          break;
        }
      } catch {
        // retry below
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }

    if (!ok) continue;
    for (const q of parsedChunk) {
      const key = q.question.toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      collected.push(q);
      if (collected.length >= count) break;
    }
  }

  return collected;
}

async function main() {
  loadEnvLocal();
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const minStock = Number(parseArg("min-stock", "10")); // Changed from 30 to 10 - target low-count topics
  const maxTopics = Number(parseArg("max-topics", "10"));
  const questionsPerTopic = Number(parseArg("questions-per-topic", "15"));
  const cooldownHours = Number(parseArg("cooldown-hours", "24"));
  const chunkSize = Number(parseArg("chunk-size", "5"));
  const retriesPerChunk = Number(parseArg("retries-per-chunk", "3"));
  const selectionMode = parseArg("selection-mode", "least-first");
  const shardCount = Number(parseArg("shard-count", "1"));
  const shardIndex = Number(parseArg("shard-index", "0"));
  const model = parseArg("model", "llama3.2");
  const dryRun = process.argv.includes("--dry-run");

  if (Number.isNaN(shardCount) || shardCount < 1) {
    throw new Error("--shard-count must be >= 1");
  }
  if (Number.isNaN(shardIndex) || shardIndex < 0 || shardIndex >= shardCount) {
    throw new Error("--shard-index must be in range [0, shard-count)");
  }
  if (Number.isNaN(chunkSize) || chunkSize < 1) {
    throw new Error("--chunk-size must be >= 1");
  }
  if (Number.isNaN(retriesPerChunk) || retriesPerChunk < 1) {
    throw new Error("--retries-per-chunk must be >= 1");
  }
  if (!["least-first", "balanced"].includes(selectionMode)) {
    throw new Error("--selection-mode must be 'least-first' or 'balanced'");
  }
  const rotation = loadRotationTracker();
  const nowMs = Date.now();

  const candidates: TopicCandidate[] = [];
  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          const countRes = await db.execute({
            sql: "SELECT COUNT(*) as c FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND topic = ?",
            args: [exam.id, subject.id, topic],
          });
          const c = Number(countRes.rows[0]?.c || 0);
          if (c < minStock) {
            const shardKey = topicKey(exam.id, subject.id, topic);
            if (shardCount > 1) {
              const assignedShard = hashString(shardKey) % shardCount;
              if (assignedShard !== shardIndex) continue;
            }
            const key = topicKey(exam.id, subject.id, topic);
            const existing = rotation[key];
            if (existing?.lastAttemptAt) {
              const elapsedMs = nowMs - new Date(existing.lastAttemptAt).getTime();
              if (elapsedMs < cooldownHours * 60 * 60 * 1000) continue;
            }
            candidates.push({
              examId: exam.id,
              examName: exam.name,
              subjectId: subject.id,
              subjectName: subject.name,
              topic,
              currentCount: c,
              lastAttemptAt: existing?.lastAttemptAt,
            });
          }
        }
      }
    }
  }

  candidates.sort((a, b) => {
    if (a.currentCount !== b.currentCount) return a.currentCount - b.currentCount;
    const aMs = a.lastAttemptAt ? new Date(a.lastAttemptAt).getTime() : 0;
    const bMs = b.lastAttemptAt ? new Date(b.lastAttemptAt).getTime() : 0;
    return aMs - bMs;
  });
  const selected =
    selectionMode === "balanced"
      ? selectDiverseCandidates(candidates, maxTopics)
      : selectLeastFirstCandidates(candidates, maxTopics);

  console.log(
    `Found ${candidates.length} low-stock topics (< ${minStock}) for shard ${shardIndex}/${shardCount}.`
  );
  console.log(
    `Processing ${selected.length} topics with model=${model}, cooldown=${cooldownHours}h, selection=${selectionMode}.`
  );
  if (selected.length === 0) return;

  let totalInserted = 0;
  for (const t of selected) {
    console.log(`\nSeeding ${t.examName} -> ${t.subjectName} -> ${t.topic} (${t.currentCount} existing)`);
    const key = topicKey(t.examId, t.subjectId, t.topic);
    const entry: RotationEntry = rotation[key] || { attempts: 0, insertedTotal: 0 };
    entry.attempts += 1;
    entry.lastAttemptAt = new Date().toISOString();
    let generated: GeneratedQuestion[] = [];
    try {
      generated = await generateForTopic(
        model,
        t.examName,
        t.subjectName,
        t.topic,
        questionsPerTopic,
        chunkSize,
        retriesPerChunk
      );
    } catch (e: any) {
      console.log(`  Generation failed: ${e.message}`);
      entry.lastStatus = "failed";
      rotation[key] = entry;
      if (!dryRun) saveRotationTracker(rotation);
      continue;
    }

    if (!generated.length) {
      console.log("  No valid questions parsed.");
      entry.lastStatus = "empty";
      rotation[key] = entry;
      if (!dryRun) saveRotationTracker(rotation);
      continue;
    }

    console.log(`  Generated ${generated.length} questions.`);
    if (dryRun) continue;

    const validFrom = getCurrentSyllabusYear(t.examId);
    let inserted = 0;
    for (const q of generated) {
      try {
        const exists = await db.execute({
          sql: "SELECT id FROM exam_questions WHERE exam_id = ? AND subject_id = ? AND question = ? LIMIT 1",
          args: [t.examId, t.subjectId, q.question],
        });
        if (exists.rows.length > 0) continue;

        await db.execute({
          sql: `INSERT INTO exam_questions
            (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            t.examId,
            t.subjectId,
            t.topic,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
            "ollama-local",
            validFrom,
            null,
          ],
        });
        inserted++;
      } catch {
        // Skip malformed/duplicate rows
      }
    }
    totalInserted += inserted;
    console.log(`  Inserted ${inserted} new questions.`);
    entry.insertedTotal += inserted;
    entry.lastStatus = inserted > 0 ? "success" : "empty";
    if (inserted > 0) entry.lastSuccessAt = new Date().toISOString();
    rotation[key] = entry;
    if (!dryRun) saveRotationTracker(rotation);
  }

  console.log(`\nDone. Total newly inserted questions: ${totalInserted}`);
}

main().catch((err) => {
  console.error("free seeding failed:", err);
  process.exit(1);
});
