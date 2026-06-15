#!/usr/bin/env tsx
/**
 * Master script to load ALL Week 1 content into Supabase
 *
 * Usage:
 *   npx tsx scripts/load-all-content.ts
 *
 * This script runs both:
 * 1. load-study-materials.ts - Inserts 7 grammar study materials
 * 2. load-english-questions.ts - Inserts 501 questions
 *
 * It provides a unified summary at the end.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runScript(scriptPath: string, name: string): Promise<boolean> {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 RUNNING: ${name}`);
  console.log('='.repeat(70));

  try {
    const { stdout, stderr } = await execAsync(`npx tsx ${scriptPath}`, {
      cwd: process.cwd(),
      env: process.env
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`\n✅ ${name} completed successfully`);
    return true;
  } catch (err: any) {
    console.error(`\n❌ ${name} failed:`);
    console.error(err.message);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return false;
  }
}

async function main() {
  console.log('\n');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║' + '  🎉 WEEK 1 CONTENT LOADER - LOAD ALL TO SUPABASE 🎉  '.padEnd(68) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');

  const startTime = Date.now();

  // Step 1: Load study materials
  const materialsSuccess = await runScript(
    'scripts/load-study-materials.ts',
    'Study Materials Loader'
  );

  // Step 2: Load questions
  const questionsSuccess = await runScript(
    'scripts/load-english-questions.ts',
    'English Questions Loader'
  );

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Final summary
  console.log('\n\n');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║' + '  📊 FINAL SUMMARY  '.padEnd(68) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');
  console.log();
  console.log(`   Study Materials: ${materialsSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Questions:       ${questionsSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Total Time:      ${duration} seconds`);
  console.log();

  if (materialsSuccess && questionsSuccess) {
    console.log('🎉 All content loaded successfully!');
    console.log();
    console.log('Next steps:');
    console.log('  1. Test on production: https://krakkify.in/english');
    console.log('  2. Verify study materials appear on topic pages');
    console.log('  3. Start quiz and verify new questions appear');
    console.log('  4. Check Week 1 completion in dashboard');
    console.log();
    process.exit(0);
  } else {
    console.log('⚠️  Some loaders failed. Check errors above.');
    console.log();
    process.exit(1);
  }
}

main();
