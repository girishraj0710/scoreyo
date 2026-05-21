#!/usr/bin/env tsx
/**
 * Verified Sources Question Importer
 *
 * Phase 1: Top 10 Exams Only (Quality over quantity)
 *
 * Sources (in priority order):
 * 1. Official Previous Year Questions (PYQs) - 100% quality
 * 2. NCERT Solutions - 95% quality
 * 3. Government educational portals - 90% quality
 *
 * Target: 10,000 verified questions
 * Cost: $0 (all public sources)
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { getCurrentSyllabusYear } from "../src/lib/syllabus-config";

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

// Top 10 Priority Exams
const TOP_10_EXAMS = [
  { id: "jee-main", name: "JEE Main", priority: 1 },
  { id: "neet-ug", name: "NEET UG", priority: 2 },
  { id: "upsc-cse", name: "UPSC CSE", priority: 3 },
  { id: "cat", name: "CAT", priority: 4 },
  { id: "gate", name: "GATE", priority: 5 },
  { id: "sbi-po", name: "SBI PO", priority: 6 },
  { id: "ssc-cgl", name: "SSC CGL", priority: 7 },
  { id: "ibps-po", name: "IBPS PO", priority: 8 },
  { id: "karnataka-cet", name: "Karnataka CET", priority: 9 },
  { id: "nda", name: "NDA", priority: 10 },
];

// Official PYQ Sources (these are real government/official websites)
const PYQ_SOURCES = {
  "jee-main": {
    url: "https://jeemain.nta.nic.in/question-paper/",
    years: [2024, 2023, 2022, 2021, 2020],
    note: "Download PDFs from NTA official website"
  },
  "neet-ug": {
    url: "https://neet.nta.nic.in/question-paper/",
    years: [2024, 2023, 2022, 2021, 2020],
    note: "Download PDFs from NTA official website"
  },
  "upsc-cse": {
    url: "https://www.upsc.gov.in/examination/previous-question-papers",
    years: [2024, 2023, 2022],
    note: "Download Prelims GS & CSAT papers"
  },
  "gate": {
    url: "https://gate.iitm.ac.in/gate-previous-year-question-papers/",
    years: [2024, 2023, 2022],
    note: "CS, EC, EE, ME question papers"
  },
};

// NCERT Resources
const NCERT_SOURCES = {
  physics: {
    class11: "https://ncert.nic.in/textbook.php?keph1=0-14",
    class12: "https://ncert.nic.in/textbook.php?leph1=0-10",
    exercises: "End of chapter questions + examples",
  },
  chemistry: {
    class11: "https://ncert.nic.in/textbook.php?kech1=0-15",
    class12: "https://ncert.nic.in/textbook.php?lech1=0-9",
    exercises: "End of chapter questions",
  },
  mathematics: {
    class11: "https://ncert.nic.in/textbook.php?kemh1=0-16",
    class12: "https://ncert.nic.in/textbook.php?lemh1=0-6",
    exercises: "Exercise questions",
  },
  biology: {
    class11: "https://ncert.nic.in/textbook.php?kebo1=0-23",
    class12: "https://ncert.nic.in/textbook.php?lebo1=0-13",
    exercises: "End of chapter questions",
  },
};

async function dbExecuteWithRetry(query: any, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.execute(query);
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

/**
 * Display implementation roadmap
 */
async function displayRoadmap() {
  console.log("=".repeat(80));
  console.log("📚 VERIFIED SOURCES IMPORTER - ROADMAP");
  console.log("=".repeat(80));
  console.log("");
  console.log("🎯 STRATEGY: Top 10 Exams, Verified Sources Only");
  console.log("");

  console.log("Phase 1: Official PYQ Collection (Week 1)");
  console.log("─".repeat(80));
  console.log("Step 1: Download PDFs from official websites");
  console.log("");

  for (const [examId, source] of Object.entries(PYQ_SOURCES)) {
    const exam = TOP_10_EXAMS.find(e => e.id === examId);
    if (exam) {
      console.log(`${exam.priority}. ${exam.name}`);
      console.log(`   Source: ${source.url}`);
      console.log(`   Years: ${source.years.join(", ")}`);
      console.log(`   Note: ${source.note}`);
      console.log("");
    }
  }

  console.log("Step 2: Manual PDF → Text Extraction");
  console.log("   Tools needed:");
  console.log("   - pdf-parse (installed ✅)");
  console.log("   - OCR if needed (Tesseract)");
  console.log("   - Manual review of extracted text");
  console.log("");

  console.log("Step 3: Structure Questions");
  console.log("   For each question:");
  console.log("   - Question text");
  console.log("   - 4 options (A, B, C, D)");
  console.log("   - Correct answer");
  console.log("   - Explanation (from solution keys)");
  console.log("   - Source: 'pyq-{exam}-{year}'");
  console.log("");

  console.log("Expected from Phase 1: 5,000 PYQ questions");
  console.log("");

  console.log("─".repeat(80));
  console.log("Phase 2: NCERT Solutions (Week 2)");
  console.log("─".repeat(80));
  console.log("");

  console.log("NCERT Textbooks (Classes 11-12):");
  for (const [subject, sources] of Object.entries(NCERT_SOURCES)) {
    console.log(`\n${subject.toUpperCase()}:`);
    console.log(`   Class 11: ${sources.class11}`);
    console.log(`   Class 12: ${sources.class12}`);
    console.log(`   Target: ${sources.exercises}`);
  }
  console.log("");
  console.log("Expected from Phase 2: 3,000 NCERT questions");
  console.log("");

  console.log("─".repeat(80));
  console.log("Phase 3: Educational Portals (Week 3)");
  console.log("─".repeat(80));
  console.log("");
  console.log("1. DIKSHA Platform");
  console.log("   URL: https://diksha.gov.in/");
  console.log("   Content: Government-verified educational resources");
  console.log("   Target: 1,000 questions");
  console.log("");
  console.log("2. SWAYAM Courses");
  console.log("   URL: https://swayam.gov.in/");
  console.log("   Content: Online course assessments");
  console.log("   Target: 500 questions");
  console.log("");
  console.log("3. ePathshala");
  console.log("   URL: https://epathshala.nic.in/");
  console.log("   Content: Digital textbooks with exercises");
  console.log("   Target: 500 questions");
  console.log("");
  console.log("Expected from Phase 3: 2,000 questions");
  console.log("");

  console.log("=".repeat(80));
  console.log("📊 TOTAL TARGET: 10,000 Verified Questions");
  console.log("=".repeat(80));
  console.log("");
  console.log("Timeline: 3-4 weeks");
  console.log("Cost: $0 (all public sources)");
  console.log("Quality: 95%+ (official sources)");
  console.log("");

  console.log("─".repeat(80));
  console.log("🚀 IMMEDIATE NEXT STEPS:");
  console.log("─".repeat(80));
  console.log("");
  console.log("TODAY:");
  console.log("1. Download JEE Main 2024 question papers (all shifts)");
  console.log("2. Download NEET 2024 question paper");
  console.log("3. Extract text from PDFs");
  console.log("4. Structure first 100 questions manually");
  console.log("5. Import into database");
  console.log("");
  console.log("TOMORROW:");
  console.log("1. Download JEE 2023, 2022 papers");
  console.log("2. Download NEET 2023, 2022 papers");
  console.log("3. Continue extraction pipeline");
  console.log("4. Target: 500 questions by end of Day 2");
  console.log("");
  console.log("THIS WEEK:");
  console.log("1. Complete JEE, NEET PYQs (5 years)");
  console.log("2. Add UPSC Prelims (3 years)");
  console.log("3. Start NCERT extraction");
  console.log("4. Target: 3,000 questions by end of Week 1");
  console.log("");

  console.log("=".repeat(80));
  console.log("💡 RECOMMENDATION:");
  console.log("=".repeat(80));
  console.log("");
  console.log("Since PDF extraction + structuring requires significant manual work,");
  console.log("I recommend a HYBRID approach:");
  console.log("");
  console.log("1. Start manual PYQ import (I'll guide you step-by-step)");
  console.log("2. Meanwhile, use $10 for Multi-AI Validator on critical topics");
  console.log("3. Result: Get 5K validated AI questions NOW while PYQs are in progress");
  console.log("");
  console.log("This way:");
  console.log("- ✅ Immediate 5K high-quality questions (AI-validated)");
  console.log("- ✅ Building toward 10K verified PYQs (ongoing)");
  console.log("- ✅ Best of both worlds");
  console.log("");
  console.log("Would you like me to:");
  console.log("A) Start manual PYQ extraction guide");
  console.log("B) Run Multi-AI Validator ($5-8) while you work on PYQs");
  console.log("C) Both in parallel");
  console.log("");
  console.log("=".repeat(80));
}

async function main() {
  await displayRoadmap();

  console.log("\n📋 DATABASE CURRENT STATUS:");
  console.log("─".repeat(80));

  const total = await dbExecuteWithRetry({
    sql: "SELECT COUNT(*) as count FROM exam_questions",
    args: [],
  });

  console.log(`Current total: ${total.rows[0].count} questions`);
  console.log(`Target after verified import: ${Number(total.rows[0].count) + 10000} questions`);
  console.log("");

  console.log("=".repeat(80));
  console.log("Ready to begin verified sources import!");
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
