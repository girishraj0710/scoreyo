#!/usr/bin/env bun
// Direct migration executor using Bun and pg library

import { Pool } from 'pg';
import { readFileSync } from 'fs';

// Read connection string from .env.local
const envContent = readFileSync('.env.local', 'utf8');
const dbUrlMatch = envContent.match(/POSTGRES_URL="([^"]+)"/);
if (!dbUrlMatch) {
  console.error('❌ POSTGRES_URL not found in .env.local');
  process.exit(1);
}

const dbUrl = dbUrlMatch[1];
const pool = new Pool({ connectionString: dbUrl });

console.log('═'.repeat(80));
console.log('DIMENSIONAL MODEL MIGRATION');
console.log('═'.repeat(80));

async function main() {
  const client = await pool.connect();

  try {
    console.log('\n✅ Connected to Supabase\n');

    // PRE-MIGRATION CHECK
    console.log('═'.repeat(80));
    console.log('PRE-MIGRATION CHECK');
    console.log('═'.repeat(80));

    const subjectsRes = await client.query('SELECT COUNT(*) FROM dim_subjects');
    console.log(`Total subjects: ${subjectsRes.rows[0].count}`);

    const sharedRes = await client.query("SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%'");
    console.log(`Shared subjects: ${sharedRes.rows[0].count}`);

    const mapRes = await client.query("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'subject_migration_map')");
    console.log(`Migration map exists: ${mapRes.rows[0].exists}`);

    if (sharedRes.rows[0].count > 0 || mapRes.rows[0].exists) {
      console.log('\n⚠️  WARNING: Migration may have already run!');
      console.log('Continue anyway? Press Ctrl+C to cancel, or wait 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // LOAD MIGRATION SQL
    console.log('\n═'.repeat(80));
    console.log('LOADING MIGRATION SQL');
    console.log('═'.repeat(80));

    let migrationSql: string;
    try {
      migrationSql = readFileSync('migration-dimensional-model.sql', 'utf8');
    } catch {
      try {
        migrationSql = readFileSync(`${process.env.HOME}/Desktop/migration-dimensional-model.sql`, 'utf8');
      } catch {
        console.error('❌ migration-dimensional-model.sql not found');
        console.error('   Checked: ./migration-dimensional-model.sql');
        console.error(`   Checked: ~/Desktop/migration-dimensional-model.sql`);
        process.exit(1);
      }
    }

    console.log(`✅ Loaded ${(migrationSql.length / 1024).toFixed(1)} KB`);

    // EXECUTE MIGRATION
    console.log('\n═'.repeat(80));
    console.log('EXECUTING MIGRATION');
    console.log('═'.repeat(80));
    console.log('This may take 30-60 seconds...\n');

    await client.query(migrationSql);

    console.log('✅ Migration completed successfully!\n');

    // POST-MIGRATION VALIDATION
    console.log('═'.repeat(80));
    console.log('VALIDATION');
    console.log('═'.repeat(80));

    const tests = [
      {
        name: 'Shared subjects created',
        query: "SELECT COUNT(*) as count FROM dim_subjects WHERE subject_code NOT LIKE '%-%'",
        check: (r: any) => r.rows[0].count === 52 ? '✅ PASS' : `❌ FAIL (expected 52, got ${r.rows[0].count})`
      },
      {
        name: 'Migration map created',
        query: 'SELECT COUNT(*) as count FROM subject_migration_map',
        check: (r: any) => r.rows[0].count >= 295 ? '✅ PASS' : `❌ FAIL (expected 295+, got ${r.rows[0].count})`
      },
      {
        name: 'No duplicate bridge entries',
        query: `SELECT COUNT(*) as dup FROM (
          SELECT exam_id, subject_id, topic_id, COUNT(*) as cnt
          FROM bridge_exam_subject_topic
          GROUP BY exam_id, subject_id, topic_id
          HAVING COUNT(*) > 1
        ) d`,
        check: (r: any) => r.rows[0].dup === '0' ? '✅ PASS' : `❌ FAIL (found ${r.rows[0].dup} duplicates)`
      },
      {
        name: 'JEE + NEET share physics',
        query: `SELECT e.exam_code, s.subject_code, COUNT(DISTINCT b.topic_id) as topics
          FROM bridge_exam_subject_topic b
          JOIN dim_exams e ON b.exam_id = e.id
          JOIN dim_subjects s ON b.subject_id = s.id
          WHERE e.exam_code IN ('jee-main', 'neet') AND s.subject_code = 'physics'
          GROUP BY e.exam_code, s.subject_code`,
        check: (r: any) => r.rows.length === 2 && r.rows[0].subject_code === 'physics' && r.rows[1].subject_code === 'physics'
          ? '✅ PASS' : '❌ FAIL (not sharing physics)'
      }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      const result = await client.query(test.query);
      const status = test.check(result);
      console.log(`${status} ${test.name}`);
      if (status.startsWith('✅')) passed++;
      else failed++;
    }

    console.log('\n═'.repeat(80));
    if (failed === 0) {
      console.log('🎉 MIGRATION SUCCESSFUL!');
      console.log('✅ All validation tests passed');
      console.log('\nNext: Test on https://krakkify.in');
    } else {
      console.log('⚠️  Migration completed with warnings');
      console.log(`Passed: ${passed}/${tests.length}`);
      console.log(`Failed: ${failed}/${tests.length}`);
    }
    console.log('═'.repeat(80));

  } catch (error: any) {
    console.error('\n❌ MIGRATION FAILED!');
    console.error(`Error: ${error.message}`);
    console.log('\n🔄 Rolling back...');
    await client.query('ROLLBACK');
    console.log('✅ Rolled back. No changes made.');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
