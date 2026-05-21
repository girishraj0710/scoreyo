#!/usr/bin/env tsx
import { writeFileSync } from "fs";
import { join } from "path";
import { validatePYQFile } from "./lib/pyq-validation";

function printUsage() {
  console.log("Usage:");
  console.log("  npx tsx scripts/validate-pyq-syllabus.ts <file.json|file.csv>");
  console.log("  npx tsx scripts/validate-pyq-syllabus.ts <file> --report <report.json>");
  console.log("");
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  if (!filePath || filePath.startsWith("--")) {
    printUsage();
    process.exit(1);
  }

  const reportFlagIdx = args.indexOf("--report");
  const reportPath =
    reportFlagIdx >= 0 && args[reportFlagIdx + 1]
      ? args[reportFlagIdx + 1]
      : join(process.cwd(), "pyq-templates", "pyq-validation-report.json");

  const result = validatePYQFile(filePath);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  console.log("=".repeat(80));
  console.log("PYQ SYLLABUS VALIDATION");
  console.log("=".repeat(80));
  console.log(`File: ${result.filePath}`);
  console.log(`Total questions: ${result.totalQuestions}`);
  console.log(`Valid questions: ${result.validQuestions}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(
    `Quality score: avg=${result.quality.averageScore} high=${result.quality.high} medium=${result.quality.medium} low=${result.quality.low}`
  );
  console.log("=".repeat(80));

  writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`Detailed report: ${reportPath}`);

  if (errors.length > 0) {
    console.log("");
    console.log("Top errors:");
    errors.slice(0, 10).forEach((issue) => {
      console.log(`- [row ${issue.row}] ${issue.code}: ${issue.message}`);
    });
    process.exit(2);
  }
}

main().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});
