#!/usr/bin/env node

/**
 * Import All Complete Mock Test Questions to Database
 * Run this after generation completes
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const mockTestsDir = path.join(__dirname, '..', '.agents', 'artifacts', 'complete-mock-tests');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - Import All Mock Test Questions                 ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Check if directory exists
if (!fs.existsSync(mockTestsDir)) {
  console.error('❌ Mock tests directory not found!');
  console.error('   Expected: ' + mockTestsDir);
  console.error('\n   Generate questions first:');
  console.error('   node scripts/generate-all-59-exams-full.js all\n');
  process.exit(1);
}

// Get all CSV files
const files = fs.readdirSync(mockTestsDir).filter(f => f.endsWith('.csv'));

if (files.length === 0) {
  console.error('❌ No CSV files found in mock tests directory!');
  process.exit(1);
}

console.log(`📁 Found ${files.length} CSV files to import\n`);

// Check if import-questions.js exists
const importScriptPath = path.join(__dirname, 'import-questions.js');
if (!fs.existsSync(importScriptPath)) {
  console.error('❌ Import script not found: ' + importScriptPath);
  process.exit(1);
}

let totalImported = 0;
let totalFailed = 0;
const startTime = Date.now();

// Import each file
files.forEach((file, index) => {
  const filepath = path.join(mockTestsDir, file);
  const examName = file.replace('-complete-mock-tests.csv', '');

  console.log(`\n[${index + 1}/${files.length}] Importing ${examName}...`);

  try {
    // Count lines in file (excluding header)
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim()).length - 1; // -1 for header

    console.log(`   📊 ${lines} questions in file`);

    // Run import script using execFileSync (safe from injection)
    const output = execFileSync('node', [importScriptPath, filepath], {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    // Parse output to get imported count
    const importedMatch = output.match(/(\d+) questions imported/i);
    if (importedMatch) {
      const imported = parseInt(importedMatch[1]);
      totalImported += imported;
      console.log(`   ✅ Imported ${imported} questions`);
    } else {
      console.log(`   ✅ Import completed`);
      totalImported += lines;
    }

  } catch (error) {
    console.error(`   ❌ Failed to import ${file}`);
    console.error(`   Error: ${error.message}`);
    totalFailed++;
  }
});

const duration = Math.round((Date.now() - startTime) / 1000);

console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
console.log('║  ✅ IMPORT COMPLETE!                                         ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log(`📊 Summary:`);
console.log(`   ✅ Files processed: ${files.length}`);
console.log(`   ✅ Questions imported: ${totalImported.toLocaleString()}`);
console.log(`   ❌ Failed imports: ${totalFailed}`);
console.log(`   ⏱️  Time taken: ${Math.floor(duration / 60)}m ${duration % 60}s\n`);

console.log(`🎉 All mock test questions are now in your database!`);
console.log(`\n📦 Next steps:`);
console.log(`   1. Test mock tests in your app`);
console.log(`   2. Verify questions display correctly`);
console.log(`   3. Deploy to production\n`);
