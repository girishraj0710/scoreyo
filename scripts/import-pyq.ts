#!/usr/bin/env tsx
/**
 * PYQ (Past Year Questions) Importer
 *
 * Imports official past year questions from structured formats:
 * - CSV files
 * - JSON files
 * - Manual entry
 *
 * PYQs are marked with special source tags and highest priority
 */

import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";
import { resolveCanonicalSubjectId, validatePYQFile } from "./lib/pyq-validation";

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

interface PYQQuestion {
  examId: string;
  subjectId: string;
  topic: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number; // 0=A, 1=B, 2=C, 3=D
  explanation: string;
  year: number;
  difficulty?: string;
  marks?: number;
}

/**
 * Import from CSV file
 * Expected format:
 * exam_id,subject_id,topic,question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty
 */
async function importFromCSV(filePath: string): Promise<number> {
  console.log(`\n📄 Importing from CSV: ${filePath}`);

  if (!existsSync(filePath)) {
    console.log(`   ❌ File not found`);
    return 0;
  }

  const content = readFileSync(filePath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`   Found ${records.length} questions in CSV`);

  let inserted = 0;
  let skipped = 0;

  for (const record of records) {
    try {
      const r = record as any;
      const pyq: PYQQuestion = {
        examId: r.exam_id,
        subjectId: resolveCanonicalSubjectId(r.exam_id, r.subject_id),
        topic: r.topic,
        question: r.question,
        optionA: r.option_a,
        optionB: r.option_b,
        optionC: r.option_c,
        optionD: r.option_d,
        correctAnswer: parseInt(r.correct_answer),
        explanation: r.explanation || "Official PYQ - Explanation to be added",
        year: parseInt(r.year),
        difficulty: r.difficulty || "medium",
      };

      const success = await insertPYQ(pyq);
      if (success) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (err: any) {
      console.log(`   ⚠️  Skipped invalid row: ${err.message}`);
      skipped++;
    }
  }

  console.log(`   ✅ Inserted: ${inserted}, Skipped: ${skipped}`);
  return inserted;
}

/**
 * Import from JSON file
 * Expected format:
 * [
 *   {
 *     "examId": "jee-main",
 *     "subjectId": "physics",
 *     "topic": "Mechanics",
 *     "question": "A ball is thrown...",
 *     "options": ["Option A", "Option B", "Option C", "Option D"],
 *     "correctAnswer": 2,
 *     "explanation": "...",
 *     "year": 2024
 *   }
 * ]
 */
async function importFromJSON(filePath: string): Promise<number> {
  console.log(`\n📄 Importing from JSON: ${filePath}`);

  if (!existsSync(filePath)) {
    console.log(`   ❌ File not found`);
    return 0;
  }

  const content = readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(content);

  if (!Array.isArray(questions)) {
    console.log(`   ❌ Invalid JSON format - expected array`);
    return 0;
  }

  console.log(`   Found ${questions.length} questions in JSON`);

  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      const pyq: PYQQuestion = {
        examId: q.examId,
        subjectId: resolveCanonicalSubjectId(q.examId, q.subjectId),
        topic: q.topic,
        question: q.question,
        optionA: q.options[0],
        optionB: q.options[1],
        optionC: q.options[2],
        optionD: q.options[3],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "Official PYQ - Explanation to be added",
        year: q.year,
        difficulty: q.difficulty || "medium",
        marks: q.marks,
      };

      const success = await insertPYQ(pyq);
      if (success) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (err: any) {
      console.log(`   ⚠️  Skipped invalid question: ${err.message}`);
      skipped++;
    }
  }

  console.log(`   ✅ Inserted: ${inserted}, Skipped: ${skipped}`);
  return inserted;
}

/**
 * Insert a PYQ into database
 */
async function insertPYQ(pyq: PYQQuestion): Promise<boolean> {
  try {
    // Check for duplicate
    const existing = await db.execute({
      sql: `SELECT id FROM exam_questions
            WHERE exam_id = ?
            AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))`,
      args: [pyq.examId, pyq.question],
    });

    if (existing.rows.length > 0) {
      return false; // Skip duplicate
    }

    const validFrom = getCurrentSyllabusYear(pyq.examId);
    const options = [pyq.optionA, pyq.optionB, pyq.optionC, pyq.optionD];

    await db.execute({
      sql: `INSERT INTO exam_questions
            (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        pyq.examId,
        pyq.subjectId,
        pyq.topic,
        pyq.question,
        JSON.stringify(options),
        pyq.correctAnswer,
        pyq.explanation,
        pyq.difficulty || "medium",
        `pyq-${pyq.examId}-${pyq.year}`, // Special PYQ source tag
        validFrom,
        null,
      ],
    });

    return true;
  } catch (err: any) {
    console.log(`      Error inserting: ${err.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log("=".repeat(80));
  console.log("📚 PYQ (PAST YEAR QUESTIONS) IMPORTER");
  console.log("=".repeat(80));
  console.log("");

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  npx tsx scripts/import-pyq.ts <file.csv>");
    console.log("  npx tsx scripts/import-pyq.ts <file.json>");
    console.log("  npx tsx scripts/import-pyq.ts --batch pyq-data/");
    console.log("  npx tsx scripts/import-pyq.ts <file.json|file.csv> --skip-validate");
    console.log("");
    console.log("File formats:");
    console.log("");
    console.log("CSV format (with header):");
    console.log("  exam_id,subject_id,topic,question,option_a,option_b,option_c,option_d,correct_answer,explanation,year,difficulty");
    console.log("");
    console.log("JSON format:");
    console.log('  [{"examId":"jee-main","subjectId":"physics","topic":"Mechanics",...}]');
    console.log("");
    console.log("Examples:");
    console.log("  See pyq-templates/ directory for sample files");
    console.log("");
    console.log("=".repeat(80));
    return;
  }

  let totalInserted = 0;
  const skipValidate = args.includes("--skip-validate");

  if (args[0] === "--batch" && args[1]) {
    // Batch import from directory
    const dirPath = args[1];
    console.log(`\n📂 Batch importing from: ${dirPath}`);

    // Not implemented yet - placeholder
    console.log("   ⚠️  Batch import not yet implemented");
    console.log("   💡 Process files individually for now");
  } else {
    // Single file import
    const filePath = args[0];
    const ext = filePath.toLowerCase().split('.').pop();

    if (!skipValidate) {
      console.log("\n🔎 Running syllabus/topic validation before import...");
      const validation = validatePYQFile(filePath);
      const errors = validation.issues.filter((issue) => issue.severity === "error");
      const warnings = validation.issues.filter((issue) => issue.severity === "warning");
      console.log(
        `   Validation result: total=${validation.totalQuestions}, valid=${validation.validQuestions}, errors=${errors.length}, warnings=${warnings.length}`
      );
      console.log(
        `   Quality: avg=${validation.quality.averageScore}, high=${validation.quality.high}, medium=${validation.quality.medium}, low=${validation.quality.low}`
      );
      if (errors.length > 0) {
        console.log("   ❌ Import blocked due to validation errors.");
        console.log("   💡 Fix the file or run validator for detailed report:");
        console.log(`      npx tsx scripts/validate-pyq-syllabus.ts ${filePath}`);
        process.exit(2);
      }
    } else {
      console.log("\n⚠️  Skipping pre-import validation (--skip-validate)");
    }

    if (ext === 'csv') {
      totalInserted = await importFromCSV(filePath);
    } else if (ext === 'json') {
      totalInserted = await importFromJSON(filePath);
    } else {
      console.log(`   ❌ Unsupported file format: ${ext}`);
      console.log(`   📝 Supported: .csv, .json`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`✅ IMPORT COMPLETE`);
  console.log("=".repeat(80));
  console.log(`Total PYQs imported: ${totalInserted}`);
  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
