#!/usr/bin/env tsx
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join, parse } from "path";

interface ExtractionResult {
  pdfPath: string;
  txtPath: string;
  status: "extracted" | "skipped" | "failed";
  pages?: number;
  chars?: number;
  error?: string;
}

function walkPdfFiles(rootDir: string): string[] {
  if (!existsSync(rootDir)) return [];
  const entries = readdirSync(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPdfFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const examIdx = args.indexOf("--exam");
  const examFilter = examIdx >= 0 ? args[examIdx + 1] : null;
  return { force, examFilter };
}

async function extractSingle(pdfPath: string, force: boolean): Promise<ExtractionResult> {
  const { dir, name } = parse(pdfPath);
  const txtPath = join(dir, `${name}.txt`);

  if (!force && existsSync(txtPath)) {
    return { pdfPath, txtPath, status: "skipped" };
  }

  try {
    const pdfParseModule = await import("pdf-parse");
    const PDFParse = (pdfParseModule as any).PDFParse;
    if (!PDFParse) {
      throw new Error("PDFParse export not found in pdf-parse package");
    }
    const buffer = readFileSync(pdfPath);
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const content = parsed.text?.trim() || "";
    await parser.destroy();

    if (!content) {
      return {
        pdfPath,
        txtPath,
        status: "failed",
        error: "No text extracted from PDF",
      };
    }

    writeFileSync(txtPath, content, "utf-8");
    return {
      pdfPath,
      txtPath,
      status: "extracted",
      pages: parsed.pages?.length || undefined,
      chars: content.length,
    };
  } catch (error: any) {
    return {
      pdfPath,
      txtPath,
      status: "failed",
      error: error.message,
    };
  }
}

async function main() {
  const { force, examFilter } = parseArgs();
  const baseDir = join(process.cwd(), "pyq-raw");
  const scopedDir = examFilter ? join(baseDir, examFilter) : baseDir;

  if (!existsSync(scopedDir)) {
    throw new Error(`Directory not found: ${scopedDir}`);
  }

  const pdfFiles = walkPdfFiles(scopedDir);
  const results: ExtractionResult[] = [];

  console.log("=".repeat(80));
  console.log("PYQ BATCH PDF -> TEXT EXTRACTION");
  console.log("=".repeat(80));
  console.log(`Scope: ${scopedDir}`);
  console.log(`PDF files found: ${pdfFiles.length}`);
  console.log(`Mode: ${force ? "force re-extract" : "skip existing .txt files"}`);
  console.log("=".repeat(80));

  for (const [index, pdfFile] of pdfFiles.entries()) {
    console.log(`[${index + 1}/${pdfFiles.length}] ${pdfFile}`);
    const result = await extractSingle(pdfFile, force);
    results.push(result);
    if (result.status === "failed") {
      console.log(`   ❌ ${result.error}`);
    } else if (result.status === "skipped") {
      console.log("   ⏭️  skipped");
    } else {
      console.log(`   ✅ pages=${result.pages} chars=${result.chars}`);
    }
  }

  const extracted = results.filter((row) => row.status === "extracted").length;
  const skipped = results.filter((row) => row.status === "skipped").length;
  const failed = results.filter((row) => row.status === "failed").length;

  const reportDir = join(process.cwd(), "pyq-templates");
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = join(reportDir, "batch-extraction-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        scope: scopedDir,
        total: results.length,
        extracted,
        skipped,
        failed,
        results,
      },
      null,
      2
    )
  );

  console.log("=".repeat(80));
  console.log("EXTRACTION COMPLETE");
  console.log("=".repeat(80));
  console.log(`Extracted: ${extracted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Report: ${reportPath}`);
  console.log("=".repeat(80));
}

main().catch((error) => {
  console.error("Batch extraction failed:", error);
  process.exit(1);
});
