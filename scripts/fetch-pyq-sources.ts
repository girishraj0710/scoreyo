#!/usr/bin/env tsx
/**
 * PYQ Source Fetcher
 *
 * Fetches PYQs from various online sources and converts them to our format
 *
 * Sources:
 * 1. Official Exam Websites (NTA, UPSC, etc.)
 * 2. Government PDFs (downloadable past papers)
 * 3. Educational Platforms (with permission/API)
 * 4. OCR from PDF question papers
 */

import { createClient } from "@libsql/client";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
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
 * Official PYQ Sources (Public Domain / Free to Use)
 */
const PYQ_SOURCES = {
  "jee-main": {
    name: "JEE Main",
    officialWebsite: "https://nta.ac.in",
    years: [2024, 2023, 2022, 2021, 2020],
    format: "pdf",
    note: "Download from NTA website, requires PDF parsing"
  },
  "neet-ug": {
    name: "NEET UG",
    officialWebsite: "https://nta.ac.in",
    years: [2024, 2023, 2022, 2021, 2020],
    format: "pdf",
    note: "Download from NTA website, requires PDF parsing"
  },
  "upsc-cse": {
    name: "UPSC CSE",
    officialWebsite: "https://upsc.gov.in",
    years: [2024, 2023, 2022, 2021, 2020],
    format: "pdf",
    note: "Download prelims papers from UPSC website"
  },
  "ssc-cgl": {
    name: "SSC CGL",
    officialWebsite: "https://ssc.nic.in",
    years: [2024, 2023, 2022, 2021, 2020],
    format: "pdf",
    note: "Download from SSC website"
  },
  "cat": {
    name: "CAT",
    officialWebsite: "https://iimcat.ac.in",
    years: [2024, 2023, 2022, 2021],
    format: "pdf",
    note: "Official papers released by IIMs"
  }
};

/**
 * Generate AI-assisted PYQ extraction prompt
 * Use this with Claude/GPT-4 Vision to parse PDF images
 */
function generateExtractionPrompt(examName: string, subject: string, year: number): string {
  return `Extract MCQ questions from ${examName} ${year} ${subject} question paper.

For each question, provide in this exact JSON format:
{
  "examId": "${examName.toLowerCase().replace(/\s+/g, '-')}",
  "subjectId": "${subject.toLowerCase().replace(/\s+/g, '-')}",
  "topic": "Topic name",
  "question": "Complete question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation with step-by-step solution",
  "year": ${year},
  "difficulty": "easy|medium|hard",
  "marks": 4
}

Return only valid JSON array. Extract ALL questions from the paper.`;
}

/**
 * Download PYQ papers (links to official sources)
 */
function generateDownloadGuide(): void {
  console.log("\n" + "=".repeat(80));
  console.log("📥 PYQ DOWNLOAD GUIDE");
  console.log("=".repeat(80));
  console.log("");
  console.log("Official sources to download Past Year Question papers:");
  console.log("");

  Object.entries(PYQ_SOURCES).forEach(([examId, info]) => {
    console.log(`📚 ${info.name}`);
    console.log(`   Website: ${info.officialWebsite}`);
    console.log(`   Years: ${info.years.join(", ")}`);
    console.log(`   Format: ${info.format.toUpperCase()}`);
    console.log(`   Note: ${info.note}`);
    console.log("");
  });

  console.log("=".repeat(80));
  console.log("\n📝 EXTRACTION WORKFLOW:\n");
  console.log("1. Download PDF from official website");
  console.log("2. Convert PDF to images (if needed)");
  console.log("3. Use AI (Claude/GPT-4 Vision) to extract questions");
  console.log("4. Save as JSON/CSV using our templates");
  console.log("5. Import using: npx tsx scripts/import-pyq.ts <file>");
  console.log("");
  console.log("=".repeat(80));
}

/**
 * Save extraction prompt for manual use
 */
function saveExtractionPrompts(): void {
  const promptsDir = join(process.cwd(), "pyq-templates", "extraction-prompts");
  if (!existsSync(promptsDir)) {
    mkdirSync(promptsDir, { recursive: true });
  }

  Object.entries(PYQ_SOURCES).forEach(([examId, info]) => {
    const subjects = {
      "jee-main": ["Physics", "Chemistry", "Mathematics"],
      "neet-ug": ["Physics", "Chemistry", "Biology"],
      "upsc-cse": ["General Studies", "CSAT"],
      "ssc-cgl": ["General Intelligence", "Quantitative Aptitude", "English", "General Awareness"],
      "cat": ["Verbal Ability", "Data Interpretation", "Quantitative Ability"]
    };

    const examSubjects = subjects[examId as keyof typeof subjects] || ["General"];

    examSubjects.forEach(subject => {
      info.years.forEach(year => {
        const prompt = generateExtractionPrompt(info.name, subject, year);
        const filename = `${examId}-${subject.toLowerCase().replace(/\s+/g, '-')}-${year}.txt`;
        const filepath = join(promptsDir, filename);
        writeFileSync(filepath, prompt);
      });
    });
  });

  console.log(`\n✅ Extraction prompts saved to: ${promptsDir}`);
  console.log(`   Use these prompts with Claude/GPT-4 Vision to extract questions from PDFs`);
}

/**
 * Main function
 */
async function main() {
  console.log("=".repeat(80));
  console.log("🎯 PYQ SOURCE FETCHER & EXTRACTOR GUIDE");
  console.log("=".repeat(80));
  console.log("");

  const args = process.argv.slice(2);

  if (args.includes("--guide")) {
    generateDownloadGuide();
  } else if (args.includes("--prompts")) {
    saveExtractionPrompts();
  } else {
    console.log("Usage:");
    console.log("  npx tsx scripts/fetch-pyq-sources.ts --guide");
    console.log("  npx tsx scripts/fetch-pyq-sources.ts --prompts");
    console.log("");
    console.log("Options:");
    console.log("  --guide    Show download guide for official PYQ sources");
    console.log("  --prompts  Generate AI extraction prompts for all exams");
    console.log("");
    console.log("Workflow:");
    console.log("  1. Run: npx tsx scripts/fetch-pyq-sources.ts --guide");
    console.log("  2. Download PDFs from official sources");
    console.log("  3. Run: npx tsx scripts/fetch-pyq-sources.ts --prompts");
    console.log("  4. Use prompts with AI to extract questions");
    console.log("  5. Import: npx tsx scripts/import-pyq.ts <extracted.json>");
    console.log("");
    console.log("=".repeat(80));
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
