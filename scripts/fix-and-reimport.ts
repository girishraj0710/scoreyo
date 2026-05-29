// Fix schema issues and reimport failed tables
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zomcofptwlumqkeffbht.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixSchema() {
  console.log('🔧 Fixing Supabase schema...\n');

  const fixes = [
    // Add missing columns to fact_exam_questions
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0`,
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS logic TEXT`,
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS calculation TEXT`,
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS formula TEXT`,
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS "commonMistakes" TEXT`,
    `ALTER TABLE fact_exam_questions ADD COLUMN IF NOT EXISTS "trapAlerts" TEXT`,

    // Make parent_topic_id nullable
    `ALTER TABLE dim_topics ALTER COLUMN parent_topic_id DROP NOT NULL`,

    // Clear existing data
    `TRUNCATE TABLE users CASCADE`,
  ];

  for (const sql of fixes) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.log(`⚠️  ${sql.substring(0, 50)}... - ${error.message}`);
      } else {
        console.log(`✅ ${sql.substring(0, 60)}...`);
      }
    } catch (error: any) {
      console.log(`⚠️  ${sql.substring(0, 50)}... - ${error.message}`);
    }
  }
}

async function importTable(tableName: string, data: any[]) {
  if (data.length === 0) return { table: tableName, rows: 0, success: true };

  console.log(`\n📦 Importing ${tableName} (${data.length} rows)...`);

  const BATCH_SIZE = 500;
  let imported = 0;

  try {
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from(tableName).insert(batch);

      if (error) throw new Error(error.message);

      imported += batch.length;
      if (data.length > 1000 && i % 5000 === 0) {
        console.log(`   Progress: ${imported}/${data.length} (${Math.round(imported/data.length*100)}%)`);
      }
    }

    console.log(`✅ ${tableName}: ${imported} rows`);
    return { table: tableName, rows: imported, success: true };
  } catch (error: any) {
    console.error(`❌ ${tableName}: ${error.message}`);
    return { table: tableName, rows: imported, success: false, error: error.message };
  }
}

async function reimportCriticalTables() {
  console.log('\n\n🚀 Re-importing critical tables...\n');

  const tables = [
    'users',
    'dim_topics',
    'bridge_exam_subject_topic',
    'fact_exam_questions', // THE BIG ONE - 137K questions!
  ];

  const stats = [];

  for (const table of tables) {
    try {
      const data = JSON.parse(readFileSync(`migration-data/${table}.json`, 'utf-8'));
      const stat = await importTable(table, data);
      stats.push(stat);
    } catch (error: any) {
      console.error(`❌ ${table}: ${error.message}`);
      stats.push({ table, rows: 0, success: false, error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  const successful = stats.filter(s => s.success);
  const failed = stats.filter(s => !s.success);
  const totalRows = stats.reduce((sum, s) => sum + s.rows, 0);

  console.log(`✅ Successful: ${successful.length}/${tables.length} tables`);
  console.log(`📦 Total rows: ${totalRows.toLocaleString()}`);

  if (failed.length > 0) {
    console.log(`\n⚠️  Failed:`);
    failed.forEach(f => console.log(`   - ${f.table}`));
  }

  console.log('='.repeat(60));
}

async function main() {
  await fixSchema();
  await reimportCriticalTables();

  console.log('\n✅ Done! Check Supabase dashboard to verify data.\n');
}

main().catch(console.error);
