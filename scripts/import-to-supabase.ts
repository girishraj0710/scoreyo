// Import all exported data from Turso into Supabase PostgreSQL
import { Client } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Build PostgreSQL connection string with proper encoding
const connectionString = process.env.POSTGRES_URL_NON_POOLING ||
  `postgresql://${process.env.POSTGRES_USER}:${encodeURIComponent(process.env.POSTGRES_PASSWORD || '')}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DATABASE}`;

// PostgreSQL connection
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

interface ImportStats {
  table: string;
  rows: number;
  imported: boolean;
  error?: string;
  duration?: number;
}

// Tables in dependency order (respecting foreign keys)
const IMPORT_ORDER = [
  'users',
  'dim_exams',
  'dim_subjects',
  'dim_topics',
  'bridge_exam_subject_topic',
  'fact_exam_questions',
  'quiz_sessions',
  'question_attempts',
  'topic_mastery',
  'subscriptions',
  'payment_history',
  'mock_tests',
  'weakness_profiles',
  'clarifications',
  'daily_practice_problems',
  'dpp_completions',
  'daily_sprints',
  'sprint_participations',
  'english_progress',
  'english_questions',
  'english_daily_practice',
  'user_quiz_levels',
  'user_english_levels',
  'level_definitions',
  'level_question_cache',
  'user_badges',
  'badge_stats',
  'daily_challenges',
  'daily_challenge_progress',
  'reported_questions',
  'question_reports',
  'cached_questions',
  'otp_codes',
];

async function importTable(tableName: string): Promise<ImportStats> {
  const startTime = Date.now();

  try {
    console.log(`\n📦 Importing ${tableName}...`);

    // Read JSON file
    const filePath = `migration-data/${tableName}.json`;
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    if (data.length === 0) {
      console.log(`⚠️  ${tableName}: 0 rows (skipped)`);
      return { table: tableName, rows: 0, imported: true, duration: Date.now() - startTime };
    }

    // Get column names from first row
    const columns = Object.keys(data[0]);
    const columnList = columns.join(', ');
    const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Prepare insert statement
    const insertSQL = `INSERT INTO ${tableName} (${columnList}) VALUES (${valuePlaceholders})`;

    // Insert rows in batches (1000 at a time)
    const BATCH_SIZE = 1000;
    let imported = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      // Use transaction for batch
      await client.query('BEGIN');

      try {
        for (const row of batch) {
          const values = columns.map(col => row[col]);
          await client.query(insertSQL, values);
        }

        await client.query('COMMIT');
        imported += batch.length;

        // Progress indicator
        if (data.length > 5000) {
          console.log(`   Progress: ${imported}/${data.length} (${Math.round(imported/data.length*100)}%)`);
        }
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ ${tableName}: ${imported} rows imported (${(duration/1000).toFixed(1)}s)`);
    return { table: tableName, rows: imported, imported: true, duration };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ ${tableName}: ${error.message}`);
    return { table: tableName, rows: 0, imported: false, error: error.message, duration };
  }
}

async function importAll() {
  console.log('🚀 Starting Supabase import...\n');
  console.log('Connection:', process.env.POSTGRES_URL_NON_POOLING?.replace(/:[^:@]+@/, ':****@'));

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL\n');

    const stats: ImportStats[] = [];
    let totalRows = 0;
    let totalDuration = 0;

    // Import tables in order
    for (const table of IMPORT_ORDER) {
      const stat = await importTable(table);
      stats.push(stat);
      totalRows += stat.rows;
      totalDuration += stat.duration || 0;
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 Import Summary:');
    console.log('='.repeat(70));

    const successful = stats.filter(s => s.imported);
    const failed = stats.filter(s => !s.imported);

    console.log(`✅ Successful: ${successful.length} tables`);
    console.log(`❌ Failed: ${failed.length} tables`);
    console.log(`📦 Total rows imported: ${totalRows.toLocaleString()}`);
    console.log(`⏱️  Total duration: ${(totalDuration/1000).toFixed(1)}s`);

    // Show top tables by size
    console.log('\n📊 Largest Tables:');
    const sorted = [...stats].sort((a, b) => b.rows - a.rows).slice(0, 10);
    sorted.forEach(s => {
      if (s.rows > 0) {
        const duration = s.duration ? ` (${(s.duration/1000).toFixed(1)}s)` : '';
        console.log(`   ${s.table.padEnd(30)} ${s.rows.toLocaleString().padStart(10)} rows${duration}`);
      }
    });

    if (failed.length > 0) {
      console.log('\n⚠️  Failed Tables:');
      failed.forEach(f => console.log(`   - ${f.table}: ${f.error}`));
    }

    console.log('\n✅ Migration complete!');
    console.log('\nNext steps:');
    console.log('1. Verify data in Supabase dashboard');
    console.log('2. Update DATABASE_URL in Vercel to use Supabase');
    console.log('3. Disable emergency auth mode');
    console.log('4. Cancel Turso subscription\n');

    // Save stats
    const statsPath = 'migration-data/import-stats.json';
    require('fs').writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    console.log(`📄 Import stats saved to: ${statsPath}`);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.end();
  }
}

importAll().catch(console.error);
