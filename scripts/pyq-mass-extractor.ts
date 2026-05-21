#!/usr/bin/env tsx
/**
 * PYQ MASS EXTRACTOR
 *
 * Automated pipeline to extract PYQs at scale:
 * Week 1: Top 5 exams × 1 year = 500 PYQs
 * Week 2: Top 5 exams × 5 years = 2,500 PYQs
 * Month 2: All 20 exams × 5 years = 10,000 PYQs
 *
 * Uses Claude Haiku API for cost-effective extraction
 */

import { readFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

/**
 * PYQ Extraction Plan
 */
const EXTRACTION_PLAN = {
  week1: {
    name: "Week 1: Top 5 Exams × 2024",
    target: 500,
    exams: [
      {
        id: "jee-main",
        name: "JEE Main",
        years: [2024],
        subjects: ["physics", "chemistry", "mathematics"],
        questionsPerPaper: 75,
        officialSource: "https://nta.ac.in - JEE Main 2024 Question Papers",
      },
      {
        id: "neet-ug",
        name: "NEET UG",
        years: [2024],
        subjects: ["physics", "chemistry", "biology"],
        questionsPerPaper: 180,
        officialSource: "https://nta.ac.in - NEET UG 2024 Question Paper",
      },
      {
        id: "upsc-cse",
        name: "UPSC CSE Prelims",
        years: [2024],
        subjects: ["general-studies", "csat"],
        questionsPerPaper: 100,
        officialSource: "https://upsc.gov.in - Prelims 2024",
      },
      {
        id: "ssc-cgl",
        name: "SSC CGL",
        years: [2024],
        subjects: ["reasoning", "quantitative", "english", "general-awareness"],
        questionsPerPaper: 100,
        officialSource: "https://ssc.nic.in - SSC CGL 2024 Tier 1",
      },
      {
        id: "cat",
        name: "CAT",
        years: [2024],
        subjects: ["varc", "dilr", "quant"],
        questionsPerPaper: 66,
        officialSource: "https://iimcat.ac.in - CAT 2024",
      },
    ],
  },

  week2: {
    name: "Week 2: Expand to 2020-2024",
    target: 2500,
    note: "Same exams, years: [2020, 2021, 2022, 2023, 2024]",
  },

  month2: {
    name: "Month 2: All Top 20 Exams",
    target: 10000,
    additionalExams: [
      "gate", "ibps-po", "sbi-po", "clat", "nda",
      "xat", "cds", "ibps-clerk", "ssc-chsl", "rrb-ntpc",
      "lic-aao", "delhi-police", "up-police", "ugc-net", "kcet"
    ],
  },
};

/**
 * Generate download instructions
 */
function generateDownloadInstructions(): void {
  console.log("\n" + "=".repeat(80));
  console.log("📥 STEP 1: DOWNLOAD OFFICIAL PYQS");
  console.log("=".repeat(80));
  console.log("\nWeek 1 Target: 500 PYQs from Top 5 Exams (2024 papers)\n");

  EXTRACTION_PLAN.week1.exams.forEach((exam, idx) => {
    const totalQ = exam.subjects.length * exam.questionsPerPaper * exam.years.length;
    console.log(`${idx + 1}. ${exam.name}`);
    console.log(`   📊 Estimated: ${totalQ} questions`);
    console.log(`   📝 Subjects: ${exam.subjects.join(", ")}`);
    console.log(`   🌐 Source: ${exam.officialSource}`);
    console.log(`   📂 Download to: pyq-raw/${exam.id}/`);
    console.log("");
  });

  console.log("=".repeat(80));
  console.log("\n💡 QUICK START:\n");
  console.log("1. Create directories:");
  console.log("   mkdir -p pyq-raw/{jee-main,neet-ug,upsc-cse,ssc-cgl,cat}\n");
  console.log("2. Download PDFs from official websites (links above)");
  console.log("3. Name files: {exam}-{subject}-{year}.pdf");
  console.log("   Example: jee-main-physics-2024.pdf\n");
  console.log("4. Extract text from PDFs:");
  console.log("   for file in pyq-raw/*/*.pdf; do");
  console.log('     pdftotext "$file" "${file%.pdf}.txt"');
  console.log("   done\n");
  console.log("5. Run extraction:");
  console.log("   npx tsx scripts/pyq-mass-extractor.ts --extract-week1");
  console.log("\n" + "=".repeat(80));
}

/**
 * Extract Week 1 papers
 */
async function extractWeek1(): Promise<void> {
  console.log("\n" + "=".repeat(80));
  console.log("🤖 WEEK 1 EXTRACTION: Top 5 Exams × 2024");
  console.log("=".repeat(80));

  let totalExtracted = 0;

  for (const exam of EXTRACTION_PLAN.week1.exams) {
    console.log(`\n📚 ${exam.name}`);

    for (const year of exam.years) {
      for (const subject of exam.subjects) {
        const textFile = `pyq-raw/${exam.id}/${exam.id}-${subject}-${year}.txt`;

        console.log(`\n   Processing: ${subject} ${year}`);

        try {
          // Run AI extraction
          const cmd = `npx tsx scripts/ai-extract-pyq.ts ${exam.id} ${subject} ${year} ${textFile}`;
          const { stdout } = await execAsync(cmd);

          // Parse output to count
          const match = stdout.match(/Imported (\d+)/);
          if (match) {
            const count = parseInt(match[1]);
            totalExtracted += count;
            console.log(`   ✅ Extracted: ${count} questions`);
          }

        } catch (err: any) {
          console.log(`   ⚠️  Failed: ${err.message}`);
        }

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`✅ WEEK 1 COMPLETE: ${totalExtracted} PYQs extracted`);
  console.log(`💰 Estimated cost: $${(totalExtracted * 0.001).toFixed(2)}`);
  console.log("=".repeat(80));
}

/**
 * Generate status report
 */
async function generateStatus(): Promise<void> {
  console.log("\n" + "=".repeat(80));
  console.log("📊 PYQ EXTRACTION STATUS");
  console.log("=".repeat(80));

  try {
    const { stdout } = await execAsync("npx tsx scripts/check-pyq-status.ts");
    console.log(stdout);
  } catch (err: any) {
    console.log("Error checking status:", err.message);
  }

  console.log("\n📈 EXTRACTION ROADMAP:\n");
  console.log(`Week 1:  Top 5 exams × 2024     → Target: ${EXTRACTION_PLAN.week1.target} PYQs`);
  console.log(`Week 2:  Expand to 2020-2024    → Target: ${EXTRACTION_PLAN.week2.target} PYQs`);
  console.log(`Month 2: All 20 exams × 5 years → Target: ${EXTRACTION_PLAN.month2.target} PYQs`);
  console.log("");
  console.log("💰 Total estimated cost: $10-15 (using Claude Haiku)");
  console.log("⏱️  Total estimated time: 10-15 hours (mostly automated)");
  console.log("\n" + "=".repeat(80));
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log("=".repeat(80));
    console.log("🚀 PYQ MASS EXTRACTOR");
    console.log("=".repeat(80));
    console.log("");
    console.log("Automated PYQ extraction pipeline");
    console.log("");
    console.log("Commands:");
    console.log("  --guide           Show download instructions for Week 1");
    console.log("  --extract-week1   Extract all Week 1 papers (Top 5 exams × 2024)");
    console.log("  --status          Show extraction progress");
    console.log("");
    console.log("Workflow:");
    console.log("  1. npx tsx scripts/pyq-mass-extractor.ts --guide");
    console.log("  2. Download PDFs from official sources");
    console.log("  3. Extract text: for f in pyq-raw/*/*.pdf; do pdftotext \"$f\"; done");
    console.log("  4. npx tsx scripts/pyq-mass-extractor.ts --extract-week1");
    console.log("  5. npx tsx scripts/pyq-mass-extractor.ts --status");
    console.log("");
    console.log("=".repeat(80));
    return;
  }

  if (args.includes("--guide")) {
    generateDownloadInstructions();
  } else if (args.includes("--extract-week1")) {
    await extractWeek1();
  } else if (args.includes("--status")) {
    await generateStatus();
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
