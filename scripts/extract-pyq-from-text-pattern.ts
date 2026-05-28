#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface ParsedQuestion {
  examId: string;
  subjectId: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  year: number;
  difficulty: string;
  marks: number;
}

function cleanText(input: string): string {
  return input
    .replace(/--\s*\d+\s*of\s*\d+\s*--/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMcqBlocks(text: string): Array<{ stem: string; options: string[] }> {
  const blocks = text.split(/Q\.\d+\s+/g).slice(1);
  const parsed: Array<{ stem: string; options: string[] }> = [];

  for (const block of blocks) {
    const aIdx = block.indexOf("(A)");
    const bIdx = block.indexOf("(B)");
    const cIdx = block.indexOf("(C)");
    const dIdx = block.indexOf("(D)");
    if ([aIdx, bIdx, cIdx, dIdx].some((idx) => idx < 0)) {
      continue;
    }
    if (!(aIdx < bIdx && bIdx < cIdx && cIdx < dIdx)) {
      continue;
    }

    const stem = cleanText(block.slice(0, aIdx));
    const optionA = cleanText(block.slice(aIdx + 3, bIdx));
    const optionB = cleanText(block.slice(bIdx + 3, cIdx));
    const optionC = cleanText(block.slice(cIdx + 3, dIdx));

    // Option D runs until next question marker marker fragment if present.
    const dTail = block.slice(dIdx + 3);
    const nextQuestionMarker = dTail.search(/Q\.\d+\s+/);
    const optionD = cleanText(
      nextQuestionMarker >= 0 ? dTail.slice(0, nextQuestionMarker) : dTail
    );

    if (!stem || !optionA || !optionB || !optionC || !optionD) {
      continue;
    }

    parsed.push({ stem, options: [optionA, optionB, optionC, optionD] });
  }

  return parsed;
}

async function main() {
  const [examId, subjectId, yearStr, textFile, topic, outputTag] = process.argv.slice(2);
  if (!examId || !subjectId || !yearStr || !textFile) {
    console.log("Usage:");
    console.log(
      "  npx tsx scripts/extract-pyq-from-text-pattern.ts <examId> <subjectId> <year> <text-file> [topic]"
    );
    process.exit(1);
  }

  if (!existsSync(textFile)) {
    throw new Error(`Text file not found: ${textFile}`);
  }

  const year = Number.parseInt(yearStr, 10);
  const raw = readFileSync(textFile, "utf-8");
  const parsedBlocks = parseMcqBlocks(raw);

  const questions: ParsedQuestion[] = parsedBlocks.map((item) => ({
    examId,
    subjectId,
    topic: topic || "PYQ Mixed Topics",
    question: item.stem,
    options: item.options,
    correctAnswer: 0,
    explanation: "Official PYQ parsed from paper text. Answer key to be mapped separately.",
    year,
    difficulty: "medium",
    marks: 4,
  }));

  const outDir = join(process.cwd(), "pyq-data");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const safeTag = outputTag ? `-${outputTag.replace(/[^a-zA-Z0-9_-]/g, "_")}` : "";
  const outPath = join(outDir, `${examId}-${subjectId}-${year}-pattern-extracted${safeTag}.json`);
  writeFileSync(outPath, JSON.stringify(questions, null, 2));

  console.log("=".repeat(80));
  console.log("PATTERN EXTRACTION COMPLETE");
  console.log("=".repeat(80));
  console.log(`Source text: ${textFile}`);
  console.log(`Extracted MCQs: ${questions.length}`);
  console.log(`Output: ${outPath}`);
  console.log("=".repeat(80));
}

main().catch((error) => {
  console.error("Pattern extraction failed:", error);
  process.exit(1);
});
