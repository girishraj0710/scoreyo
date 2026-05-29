// Import data using Supabase REST API (bypasses PostgreSQL connection)
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zomcofptwlumqkeffbht.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.log('\nPlease add it:');
  console.log('1. Go to Supabase dashboard → Settings → API');
  console.log('2. Copy the "service_role" key (secret)');
  console.log('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface ImportStats {
  table: string;
  rows: number;
  imported: boolean;
  error?: string;
  duration?: number;
}

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

    const filePath = `migration-data/${tableName}.json`;
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    if (data.length === 0) {
      console.log(`⚠️  ${tableName}: 0 rows (skipped)`);
      return { table: tableName, rows: 0, imported: true, duration: Date.now() - startTime };
    }

    // Insert in batches (Supabase REST API limit is ~1000 rows per request)
    const BATCH_SIZE = 500;
    let imported = 0;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      const { error } = await supabase
        .from(tableName)
        .insert(batch);

      if (error) {
        throw new Error(`Batch ${i}-${i + batch.length}: ${error.message}`);
      }

      imported += batch.length;

      // Progress indicator for large tables
      if (data.length > 5000) {
        console.log(`   Progress: ${imported}/${data.length} (${Math.round(imported/data.length*100)}%)`);
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
  console.log('🚀 Starting Supabase import via REST API...\n');
  console.log('Project URL:', SUPABASE_URL);
  console.log('Using service role key:', SUPABASE_SERVICE_KEY.substring(0, 20) + '...\n');

  // Test connection
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw error;
    }
    console.log('✅ Connected to Supabase\n');
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. SUPABASE_SERVICE_ROLE_KEY is correct');
    console.log('2. Supabase project is active');
    console.log('3. API access is enabled\n');
    process.exit(1);
  }

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

  require('fs').writeFileSync('migration-data/import-stats.json', JSON.stringify(stats, null, 2));
}

importAll().catch(console.error);
