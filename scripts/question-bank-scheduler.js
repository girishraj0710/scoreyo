#!/usr/bin/env node

/**
 * PrepGenie - Question Bank Auto-Builder Scheduler
 *
 * Runs the auto-generation system on a schedule:
 * - Generates questions continuously
 * - Monitors quality and progress
 * - Auto-imports to question bank
 * - Tracks statistics
 *
 * Usage:
 *   node scripts/question-bank-scheduler.js [--interval <minutes>]
 *
 * Default: Runs every 60 minutes
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STATS_FILE = '.agents/artifacts/question-bank-stats.json';
const LOG_FILE = '.agents/artifacts/question-generation.log';

// Configuration
const CONFIG = {
  INTERVAL_MINUTES: 60,
  QUESTIONS_PER_RUN: 20,
  QUALITY_THRESHOLD: 80,
  TARGET_TOTAL: 10000, // Goal: 10,000 verified questions
};

// Load existing stats
function loadStats() {
  if (fs.existsSync(STATS_FILE)) {
    return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
  }

  return {
    total_generated: 0,
    total_imported: 0,
    runs: 0,
    last_run: null,
    by_exam: {},
    by_difficulty: { easy: 0, medium: 0, hard: 0 },
    avg_quality: 0,
  };
}

// Save stats
function saveStats(stats) {
  const dir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Log message
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(message);

  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Run generation
async function runGeneration() {
  log('🚀 Starting question generation...');

  try {
    const output = execFileSync(
      'node',
      [
        'scripts/auto-generate-questions.js',
        '--count',
        String(CONFIG.QUESTIONS_PER_RUN),
        '--threshold',
        String(CONFIG.QUALITY_THRESHOLD)
      ],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );

    log('✅ Generation completed successfully');

    // Parse output to extract stats
    const stats = loadStats();
    stats.runs += 1;
    stats.last_run = new Date().toISOString();

    // Extract counts from output
    const generatedMatch = output.match(/Generated: (\d+) questions/);
    if (generatedMatch) {
      const count = parseInt(generatedMatch[1]);
      stats.total_generated += count;
      stats.total_imported += count; // Assuming auto-import succeeded
    }

    saveStats(stats);

    return true;
  } catch (error) {
    log(`❌ Generation failed: ${error.message}`);
    return false;
  }
}

// Display progress
function displayProgress() {
  const stats = loadStats();

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         PrepGenie - Question Bank Auto-Builder Status         ║
╚═══════════════════════════════════════════════════════════════╝

Progress:
  Total Generated:  ${stats.total_generated.toLocaleString()} / ${CONFIG.TARGET_TOTAL.toLocaleString()}
  Total Imported:   ${stats.total_imported.toLocaleString()}
  Runs Completed:   ${stats.runs}
  Last Run:         ${stats.last_run ? new Date(stats.last_run).toLocaleString() : 'Never'}

Progress: ${Math.round((stats.total_generated / CONFIG.TARGET_TOTAL) * 100)}%
${'█'.repeat(Math.round((stats.total_generated / CONFIG.TARGET_TOTAL) * 50))}${'░'.repeat(50 - Math.round((stats.total_generated / CONFIG.TARGET_TOTAL) * 50))}

Configuration:
  Interval:         ${CONFIG.INTERVAL_MINUTES} minutes
  Per Run:          ${CONFIG.QUESTIONS_PER_RUN} questions
  Quality:          ${CONFIG.QUALITY_THRESHOLD}/100
`);
}

// Main loop
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--interval' && args[i + 1]) {
      CONFIG.INTERVAL_MINUTES = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      CONFIG.QUESTIONS_PER_RUN = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--target' && args[i + 1]) {
      CONFIG.TARGET_TOTAL = parseInt(args[i + 1]);
      i++;
    }
  }

  log('📊 Question Bank Auto-Builder started');
  displayProgress();

  log(`⏰ Scheduled to run every ${CONFIG.INTERVAL_MINUTES} minutes`);
  log(`🎯 Generating ${CONFIG.QUESTIONS_PER_RUN} questions per run`);

  // Run immediately
  await runGeneration();
  displayProgress();

  // Schedule recurring runs
  setInterval(async () => {
    const stats = loadStats();

    // Check if we've reached target
    if (stats.total_generated >= CONFIG.TARGET_TOTAL) {
      log(`🎉 Target reached! ${stats.total_generated} questions generated.`);
      log('✅ Stopping scheduler (target achieved)');
      process.exit(0);
    }

    await runGeneration();
    displayProgress();
  }, CONFIG.INTERVAL_MINUTES * 60 * 1000);

  log('✨ Scheduler is running. Press Ctrl+C to stop.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n👋 Scheduler stopped by user');
  displayProgress();
  process.exit(0);
});

// Run
main().catch(err => {
  log(`❌ Fatal error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
