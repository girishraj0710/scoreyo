#!/usr/bin/env tsx
/**
 * Build PYQ Authenticity Manifest
 *
 * Purpose:
 * - Generate an exam-wise sourcing plan from the real exam catalog
 * - Tie each exam to current syllabus year + official notice URL
 * - Track local PYQ raw-file coverage against target years
 *
 * Output:
 * - pyq-templates/authentic-pyq-manifest.json
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { getAllExams } from "../src/lib/exams";
import { CURRENT_SYLLABUS, getCurrentSyllabusYear, getSyllabusConfig } from "../src/lib/syllabus-config";

type CoverageStatus = "ready" | "partial" | "missing";

interface ManifestRow {
  examId: string;
  examName: string;
  subjects: string[];
  currentSyllabusYear: number;
  officialSyllabusNotice: string | null;
  recommendedPaperYears: number[];
  sourcePlan: {
    sourceType: "official-board" | "official-portal" | "exam-conducting-body";
    primaryUrl: string | null;
    authenticityRule: string;
  };
  localCoverage: {
    rawDir: string;
    foundFiles: string[];
    yearsFound: number[];
    coverageStatus: CoverageStatus;
  };
}

const HARD_CODED_PYQ_PORTALS: Record<string, string> = {
  "jee-main": "https://jeemain.nta.nic.in/question-paper/",
  "neet-ug": "https://neet.nta.nic.in/question-paper/",
  "upsc-cse": "https://www.upsc.gov.in/examination/previous-question-papers",
  "gate": "https://gate.iitm.ac.in/",
  "cat": "https://iimcat.ac.in/",
  "ssc-cgl": "https://ssc.gov.in/",
  "ssc-chsl": "https://ssc.gov.in/",
  "ibps-po": "https://www.ibps.in/",
  "ibps-clerk": "https://www.ibps.in/",
  "sbi-po": "https://sbi.co.in/web/careers",
  "kcet": "https://cetonline.karnataka.gov.in/kea/",
  "mht-cet": "https://cetcell.mahacet.org/",
  "ts-eamcet": "https://eamcet.tsche.ac.in/",
  "ap-eamcet": "https://cets.apsche.ap.gov.in/",
  "wbjee": "https://wbjeeb.nic.in/",
  "keam": "https://cee.kerala.gov.in/",
  "nda": "https://upsc.gov.in/",
  "rrb-ntpc": "https://www.rrbcdg.gov.in/",
  "rrb-alp": "https://www.rrbcdg.gov.in/",
  "neet-pg": "https://natboard.edu.in/",
};

function getTargetYears(currentSyllabusYear: number): number[] {
  // Keep a practical rolling window; avoids importing too-old pattern variants.
  return [
    currentSyllabusYear,
    currentSyllabusYear - 1,
    currentSyllabusYear - 2,
    currentSyllabusYear - 3,
    currentSyllabusYear - 4,
  ].filter((year) => year >= 2018);
}

function extractYearFromFilename(filename: string): number | null {
  const match = filename.match(/(20\d{2})/);
  if (!match) return null;
  return Number(match[1]);
}

function detectLocalCoverage(examId: string, targetYears: number[]) {
  const rawDir = join(process.cwd(), "pyq-raw", examId);
  if (!existsSync(rawDir)) {
    return {
      rawDir,
      foundFiles: [],
      yearsFound: [],
      coverageStatus: "missing" as CoverageStatus,
    };
  }

  const files = readdirSync(rawDir).filter((name) => name.endsWith(".pdf") || name.endsWith(".txt"));
  const yearsFound = Array.from(
    new Set(
      files
        .map((name) => extractYearFromFilename(name))
        .filter((year): year is number => year !== null)
    )
  ).sort((a, b) => b - a);

  const coveredCount = targetYears.filter((year) => yearsFound.includes(year)).length;
  const coverageStatus: CoverageStatus =
    coveredCount === 0 ? "missing" : coveredCount === targetYears.length ? "ready" : "partial";

  return {
    rawDir,
    foundFiles: files,
    yearsFound,
    coverageStatus,
  };
}

function resolvePrimaryUrl(examId: string): string | null {
  const fromSyllabus = getSyllabusConfig(examId)?.officialNotice;
  if (fromSyllabus) return fromSyllabus;
  return HARD_CODED_PYQ_PORTALS[examId] || null;
}

function buildRows(): ManifestRow[] {
  return getAllExams().map((exam) => {
    const currentSyllabusYear = getCurrentSyllabusYear(exam.id);
    const targetYears = getTargetYears(currentSyllabusYear);
    const primaryUrl = resolvePrimaryUrl(exam.id);

    return {
      examId: exam.id,
      examName: exam.name,
      subjects: exam.subjects.map((subject) => subject.name),
      currentSyllabusYear,
      officialSyllabusNotice: getSyllabusConfig(exam.id)?.officialNotice || null,
      recommendedPaperYears: targetYears,
      sourcePlan: {
        sourceType: "exam-conducting-body",
        primaryUrl,
        authenticityRule:
          "Accept only official board/authority papers or answer keys. Cross-check year + shift + subject before import.",
      },
      localCoverage: detectLocalCoverage(exam.id, targetYears),
    };
  });
}

async function main() {
  const rows = buildRows();

  const withOfficialNotice = rows.filter((row) => row.officialSyllabusNotice).length;
  const ready = rows.filter((row) => row.localCoverage.coverageStatus === "ready").length;
  const partial = rows.filter((row) => row.localCoverage.coverageStatus === "partial").length;
  const missing = rows.filter((row) => row.localCoverage.coverageStatus === "missing").length;

  const unmatchedSyllabusExams = CURRENT_SYLLABUS
    .map((item) => item.examId)
    .filter((examId) => !rows.some((row) => row.examId === examId));

  const output = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalExams: rows.length,
      examsWithOfficialSyllabusNotice: withOfficialNotice,
      localCoverage: { ready, partial, missing },
      syllabusEntriesWithoutExamMatch: unmatchedSyllabusExams,
    },
    rows,
  };

  const outDir = join(process.cwd(), "pyq-templates");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const outPath = join(outDir, "authentic-pyq-manifest.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log("=".repeat(80));
  console.log("PYQ AUTHENTICITY MANIFEST GENERATED");
  console.log("=".repeat(80));
  console.log(`Output: ${outPath}`);
  console.log(`Total exams: ${output.summary.totalExams}`);
  console.log(`With official syllabus notice: ${withOfficialNotice}`);
  console.log(
    `Coverage status -> ready: ${ready}, partial: ${partial}, missing: ${missing}`
  );

  if (unmatchedSyllabusExams.length > 0) {
    console.log("");
    console.log("⚠️  Syllabus config exam IDs not found in exam catalog:");
    unmatchedSyllabusExams.forEach((examId) => console.log(`   - ${examId}`));
  }

  console.log("=".repeat(80));
}

main().catch((err) => {
  console.error("Failed to generate manifest:", err);
  process.exit(1);
});
