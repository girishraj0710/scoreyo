// Export all data from Turso to JSON files for migration
import { createClient } from "@libsql/client";
import { writeFileSync, mkdirSync } from "fs";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface ExportStats {
  table: string;
  rows: number;
  exported: boolean;
  error?: string;
}

async function exportTable(tableName: string): Promise<ExportStats> {
  try {
    console.log(`📦 Exporting ${tableName}...`);
    const result = await client.execute(`SELECT * FROM ${tableName}`);

    // Convert rows to plain objects
    const data = result.rows.map((row) => {
      const obj: any = {};
      for (const col of result.columns) {
        obj[col] = row[col];
      }
      return obj;
    });

    const count = data.length;

    if (count > 0) {
      const filename = `migration-data/${tableName}.json`;
      writeFileSync(filename, JSON.stringify(data, null, 2));
      console.log(`✅ ${tableName}: ${count} rows exported`);
    } else {
      console.log(`⚠️  ${tableName}: 0 rows (skipped)`);
    }

    return { table: tableName, rows: count, exported: true };
  } catch (error: any) {
    console.error(`❌ ${tableName}: ${error.message}`);
    return { table: tableName, rows: 0, exported: false, error: error.message };
  }
}

async function exportAll() {
  console.log('🚀 Starting Turso data export...\n');

  // Create migration directory
  mkdirSync('migration-data', { recursive: true });

  // Tables to export (in order - respecting foreign keys)
  const tables = [
    // Core tables first
    'users',
    'dim_exams',
    'dim_subjects',
    'dim_topics',
    'bridge_exam_subject_topic',

    // Questions (most important - 150K rows!)
    'fact_exam_questions',

    // User activity tables
    'quiz_sessions',
    'question_attempts',
    'topic_mastery',

    // Subscriptions & payments
    'subscriptions',
    'payment_history',

    // Features
    'mock_tests',
    'weakness_profiles',
    'clarifications',
    'daily_practice_problems',
    'dpp_completions',
    'daily_sprints',
    'sprint_participations',

    // English learning
    'english_progress',
    'english_questions',
    'english_daily_practice',

    // Level system
    'user_quiz_levels',
    'user_english_levels',
    'level_definitions',
    'level_question_cache',

    // Badges & achievements
    'user_badges',
    'badge_stats',
    'daily_challenges',
    'daily_challenge_progress',

    // Reports
    'reported_questions',
    'question_reports',

    // Other
    'cached_questions',
    'otp_codes',
  ];

  const stats: ExportStats[] = [];
  let totalRows = 0;

  for (const table of tables) {
    const stat = await exportTable(table);
    stats.push(stat);
    totalRows += stat.rows;
  }

  // Summary
  console.log('\n📊 Export Summary:');
  console.log('='.repeat(60));

  const successful = stats.filter(s => s.exported);
  const failed = stats.filter(s => !s.exported);

  console.log(`✅ Successful: ${successful.length} tables`);
  console.log(`❌ Failed: ${failed.length} tables`);
  console.log(`📦 Total rows: ${totalRows.toLocaleString()}`);

  // Show top tables by size
  console.log('\n📊 Largest Tables:');
  const sorted = [...stats].sort((a, b) => b.rows - a.rows).slice(0, 10);
  sorted.forEach(s => {
    if (s.rows > 0) {
      console.log(`   ${s.table.padEnd(30)} ${s.rows.toLocaleString().padStart(10)} rows`);
    }
  });

  if (failed.length > 0) {
    console.log('\n⚠️  Failed Tables:');
    failed.forEach(f => console.log(`   - ${f.table}: ${f.error}`));
  }

  console.log('\n✅ Export complete! Files saved in: migration-data/');
  console.log('Next step: Import to Supabase\n');

  // Save stats
  writeFileSync('migration-data/export-stats.json', JSON.stringify(stats, null, 2));
}

exportAll().catch(console.error);
