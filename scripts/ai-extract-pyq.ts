#!/usr/bin/env tsx
/**
 * AI-Powered PYQ Extractor
 *
 * Uses Claude API to extract questions from PDF text or images
 * Automates the extraction process for bulk PYQ import
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync, existsSync } from "fs";
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

/**
 * Extract questions from text using Claude
 */
async function extractFromText(
  examId: string,
  subjectId: string,
  year: number,
  pdfText: string
): Promise<any[]> {
  function safeParseQuestions(raw: string): any[] {
    const cleanedBlock = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonStart = cleanedBlock.indexOf("[");
    const jsonEnd = cleanedBlock.lastIndexOf("]");
    const candidate =
      jsonStart >= 0 && jsonEnd > jsonStart
        ? cleanedBlock.slice(jsonStart, jsonEnd + 1)
        : cleanedBlock;

    const attempts: string[] = [candidate];
    attempts.push(candidate.replace(/,\s*([}\]])/g, "$1"));
    attempts.push(candidate.replace(/[\u0000-\u001f]/g, " "));

    for (const attempt of attempts) {
      try {
        const parsed = JSON.parse(attempt);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // try next strategy
      }
    }

    throw new Error("Unable to parse extracted JSON response");
  }


  const prompt = `Extract ALL MCQ questions from this ${examId} ${year} ${subjectId} question paper.

PDF Text:
${pdfText}

Return ONLY a valid JSON array with this exact format:
[
  {
    "examId": "${examId}",
    "subjectId": "${subjectId}",
    "topic": "Identify the topic from question content",
    "question": "Complete question text",
    "options": ["Option A full text", "Option B full text", "Option C full text", "Option D full text"],
    "correctAnswer": 0,
    "explanation": "Step-by-step solution if answer key provided, otherwise write 'Official PYQ - Solution to be added'",
    "year": ${year},
    "difficulty": "medium",
    "marks": 4
  }
]

Important:
- Extract EVERY question
- Keep original question text exactly
- Put full option text, not just (A), (B), (C), (D)
- correctAnswer is index: 0=A, 1=B, 2=C, 3=D
- If answer key not in PDF, set correctAnswer to 0 and note in explanation
- Return ONLY the JSON array, no markdown, no extra text`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prepgenie.co.in",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash:free",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting exam questions from PDFs. Return only valid JSON arrays."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      console.log(`   ❌ API Error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    let text = (data.choices[0]?.message?.content || "").trim();

    const questions = safeParseQuestions(text);

    if (!Array.isArray(questions)) {
      console.log(`   ❌ Response not an array`);
      return [];
    }

    return questions.filter((q: any) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctAnswer === 'number'
    );
  } catch (err: any) {
    console.log(`   ❌ Extraction failed: ${err.message}`);
    return [];
  }
}

/**
 * Process a single exam paper
 */
async function processPaper(
  examId: string,
  examName: string,
  subjectId: string,
  year: number,
  pdfTextFile: string
): Promise<number> {

  console.log(`\n📄 Processing: ${examName} ${year} - ${subjectId}`);

  if (!existsSync(pdfTextFile)) {
    console.log(`   ⚠️  Text file not found: ${pdfTextFile}`);
    console.log(`   💡 Extract text from PDF first using:`);
    console.log(`      pdftotext ${pdfTextFile.replace('.txt', '.pdf')} ${pdfTextFile}`);
    return 0;
  }

  const pdfText = readFileSync(pdfTextFile, 'utf-8');

  if (pdfText.length < 100) {
    console.log(`   ⚠️  Text file too short (${pdfText.length} chars)`);
    return 0;
  }

  console.log(`   📝 Extracted ${(pdfText.length / 1024).toFixed(1)}KB text`);
  console.log(`   🤖 Sending to Claude for extraction...`);

  const questions = await extractFromText(examId, subjectId, year, pdfText);

  if (questions.length === 0) {
    console.log(`   ❌ No questions extracted`);
    return 0;
  }

  console.log(`   ✅ Extracted ${questions.length} questions`);

  // Save extracted questions to JSON
  const outputFile = join(
    process.cwd(),
    'pyq-data',
    `${examId}-${subjectId}-${year}.json`
  );

  writeFileSync(outputFile, JSON.stringify(questions, null, 2));
  console.log(`   💾 Saved to: ${outputFile}`);

  // Auto-import
  console.log(`   📥 Importing to database...`);

  let imported = 0;
  for (const q of questions) {
    try {
      // Check duplicate
      const existing = await db.execute({
        sql: `SELECT id FROM exam_questions WHERE exam_id = ? AND LOWER(SUBSTR(question, 1, 80)) = LOWER(SUBSTR(?, 1, 80))`,
        args: [examId, q.question],
      });

      if (existing.rows.length > 0) continue;

      await db.execute({
        sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source, valid_from, valid_until)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          examId,
          subjectId,
          q.topic,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty || "medium",
          `pyq-${examId}-${year}`,
          year,
          null,
        ],
      });

      imported++;
    } catch (err: any) {
      // Skip errors
    }
  }

  console.log(`   ✅ Imported ${imported}/${questions.length} to database`);

  return imported;
}

/**
 * Batch process multiple papers
 */
async function batchProcess(papersList: any[]): Promise<void> {
  console.log("=".repeat(80));
  console.log("🤖 AI-POWERED PYQ EXTRACTION");
  console.log("=".repeat(80));
  console.log(`\nProcessing ${papersList.length} papers...\n`);

  let totalExtracted = 0;
  let totalImported = 0;

  for (const paper of papersList) {
    const imported = await processPaper(
      paper.examId,
      paper.examName,
      paper.subjectId,
      paper.year,
      paper.textFile
    );

    totalImported += imported;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ BATCH EXTRACTION COMPLETE");
  console.log("=".repeat(80));
  console.log(`Total imported: ${totalImported} questions`);
  console.log("=".repeat(80));
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("=".repeat(80));
    console.log("🤖 AI-POWERED PYQ EXTRACTOR");
    console.log("=".repeat(80));
    console.log("");
    console.log("Usage:");
    console.log("  Single paper:");
    console.log("    npx tsx scripts/ai-extract-pyq.ts <exam> <subject> <year> <text-file>");
    console.log("");
    console.log("  Example:");
    console.log("    npx tsx scripts/ai-extract-pyq.ts jee-main physics 2024 jee-physics-2024.txt");
    console.log("");
    console.log("Prerequisites:");
    console.log("  1. Download PDF from official source");
    console.log("  2. Extract text: pdftotext paper.pdf paper.txt");
    console.log("  3. Run this script");
    console.log("");
    console.log("The script will:");
    console.log("  - Use Claude AI to extract all questions");
    console.log("  - Save to pyq-data/ as JSON");
    console.log("  - Auto-import to database");
    console.log("");
    console.log("Cost: ~$0.05-0.10 per paper (100 questions)");
    console.log("");
    console.log("=".repeat(80));
    return;
  }

  if (args.length === 4) {
    // Single paper processing
    const [examId, subjectId, year, textFile] = args;
    const examName = examId.toUpperCase().replace(/-/g, ' ');

    await processPaper(examId, examName, subjectId, parseInt(year), textFile);
  } else {
    console.log("❌ Invalid arguments");
    console.log("Usage: npx tsx scripts/ai-extract-pyq.ts <exam> <subject> <year> <text-file>");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
