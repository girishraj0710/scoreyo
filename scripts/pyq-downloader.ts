#!/usr/bin/env tsx
/**
 * Official PYQ Downloader
 *
 * Strategy:
 * 1. Research official exam board websites
 * 2. Find direct PDF download links
 * 3. Download PDFs programmatically
 * 4. Save organized by exam/year
 *
 * Target: JEE Main, NEET UG, UPSC CSE
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const PYQ_DOWNLOAD_PATHS = {
  "jee-main": {
    name: "JEE Main",
    baseUrl: "https://jeemain.nta.nic.in",
    searchPattern: "question-paper",
    years: [2024, 2023, 2022],
    saveDir: "scripts/pyq-sources/jee-main",
    note: "NTA JEE Main official question papers",
  },
  "neet-ug": {
    name: "NEET UG",
    baseUrl: "https://neet.nta.nic.in",
    searchPattern: "question-paper",
    years: [2024, 2023, 2022],
    saveDir: "scripts/pyq-sources/neet-ug",
    note: "NTA NEET UG official question papers",
  },
  "upsc-cse": {
    name: "UPSC CSE",
    baseUrl: "https://www.upsc.gov.in",
    searchPattern: "previous-question-papers",
    years: [2024, 2023, 2022],
    saveDir: "scripts/pyq-sources/upsc-cse",
    note: "UPSC Civil Services Prelims papers",
  },
};

/**
 * Research and find PDF download links
 */
async function researchPYQLinks(examId: string): Promise<string[]> {
  const config = PYQ_DOWNLOAD_PATHS[examId as keyof typeof PYQ_DOWNLOAD_PATHS];

  console.log(`\n🔍 Researching ${config.name} PYQ links...`);
  console.log(`   Base URL: ${config.baseUrl}`);
  console.log(`   Looking for: ${config.searchPattern}`);

  const links: string[] = [];

  try {
    // Fetch the question paper page
    const response = await fetch(`${config.baseUrl}/${config.searchPattern}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.log(`   ⚠️  Could not access ${config.baseUrl}`);
      return links;
    }

    const html = await response.text();

    // Find PDF links (common patterns)
    const pdfPatterns = [
      /href=["'](.*?\.pdf)["']/gi,
      /src=["'](.*?\.pdf)["']/gi,
      /download=["'](.*?\.pdf)["']/gi,
    ];

    for (const pattern of pdfPatterns) {
      const matches = html.matchAll(pattern);
      for (const match of matches) {
        let pdfUrl = match[1];

        // Make absolute URL if relative
        if (pdfUrl.startsWith('/')) {
          pdfUrl = config.baseUrl + pdfUrl;
        } else if (!pdfUrl.startsWith('http')) {
          pdfUrl = config.baseUrl + '/' + pdfUrl;
        }

        // Filter by year
        const hasYear = config.years.some(year => pdfUrl.includes(String(year)));
        if (hasYear && !links.includes(pdfUrl)) {
          links.push(pdfUrl);
        }
      }
    }

    console.log(`   ✅ Found ${links.length} PDF links`);
    return links;
  } catch (err: any) {
    console.log(`   ⚠️  Error: ${err.message}`);
    return links;
  }
}

/**
 * Download a single PDF
 */
async function downloadPDF(url: string, savePath: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) return false;

    const buffer = await response.arrayBuffer();
    writeFileSync(savePath, Buffer.from(buffer));

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Download all PYQs for an exam
 */
async function downloadExamPYQs(examId: string): Promise<number> {
  const config = PYQ_DOWNLOAD_PATHS[examId as keyof typeof PYQ_DOWNLOAD_PATHS];

  console.log(`\n${"=".repeat(80)}`);
  console.log(`📥 Downloading ${config.name} Question Papers`);
  console.log(`${"=".repeat(80)}`);

  // Create directory
  if (!existsSync(config.saveDir)) {
    mkdirSync(config.saveDir, { recursive: true });
  }

  // Research links
  const links = await researchPYQLinks(examId);

  if (links.length === 0) {
    console.log(`\n⚠️  No PDF links found. Manual download required.`);
    console.log(`\nManual Instructions:`);
    console.log(`1. Visit: ${config.baseUrl}/${config.searchPattern}/`);
    console.log(`2. Download PDFs for years: ${config.years.join(", ")}`);
    console.log(`3. Save to: ${config.saveDir}/`);
    console.log(`4. Name format: ${examId}-YYYY-subject.pdf`);
    return 0;
  }

  // Download PDFs
  let downloaded = 0;
  console.log(`\nDownloading ${links.length} PDFs...`);

  for (const [index, url] of links.entries()) {
    const filename = url.split('/').pop() || `${examId}-${Date.now()}.pdf`;
    const savePath = join(config.saveDir, filename);

    console.log(`\n[${index + 1}/${links.length}] ${filename}`);
    console.log(`   URL: ${url}`);

    const success = await downloadPDF(url, savePath);

    if (success) {
      console.log(`   ✅ Downloaded`);
      downloaded++;
    } else {
      console.log(`   ❌ Failed`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✅ Downloaded: ${downloaded}/${links.length} PDFs`);
  return downloaded;
}

async function main() {
  console.log("=".repeat(80));
  console.log("📥 OFFICIAL PYQ DOWNLOADER");
  console.log("=".repeat(80));
  console.log("");
  console.log("Attempting to programmatically download official question papers");
  console.log("from government exam board websites.");
  console.log("");
  console.log("Note: Some sites may block automated downloads.");
  console.log("If so, manual download instructions will be provided.");
  console.log("");
  console.log("=".repeat(80));

  let totalDownloaded = 0;

  for (const examId of Object.keys(PYQ_DOWNLOAD_PATHS)) {
    const count = await downloadExamPYQs(examId);
    totalDownloaded += count;

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log("\n" + "=".repeat(80));
  console.log("📥 DOWNLOAD SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total PDFs downloaded: ${totalDownloaded}`);
  console.log("");

  if (totalDownloaded === 0) {
    console.log("⚠️  Automated download not possible for these sites.");
    console.log("");
    console.log("RECOMMENDED APPROACH:");
    console.log("1. Use NCERT extractor (works programmatically)");
    console.log("2. Manually download PYQs as backup");
    console.log("3. Focus on AI-generated questions with NCERT validation");
  } else {
    console.log("✅ Next step: Run PDF extractor to process downloaded papers");
    console.log("   Command: npx tsx scripts/pdf-extractor.ts");
  }

  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
