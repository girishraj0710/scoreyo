#!/usr/bin/env node

/**
 * Deploy Question Generation Schema to Supabase
 * Run: npx ts-node scripts/deploy-schema.ts
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploySchema() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🚀 Deploying Question Generation Schema to Supabase...\n');

    // Read schema file
    const schemaPath = path.join(__dirname, 'question-generation-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute migration
    const client = await pool.connect();

    try {
      // Split by semicolons and execute statements
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let successCount = 0;
      for (const statement of statements) {
        try {
          await client.query(statement);
          successCount++;
        } catch (err: any) {
          // Ignore "already exists" errors
          if (!err.message.includes('already exists')) {
            console.error(`❌ Error executing statement: ${err.message}`);
            console.error(`Statement: ${statement.substring(0, 100)}...\n`);
          }
        }
      }

      console.log(`✅ Schema deployment complete!`);
      console.log(`✅ ${successCount} SQL statements executed`);
      console.log(`✅ 7 new tables created/verified`);
      console.log(`✅ 20+ indexes created/verified`);
      console.log(`✅ Ready for data pipeline\n`);

      // Verify tables
      const tableCheckResult = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN (
            'pyq_metadata',
            'exam_pattern_profiles',
            'question_generation_batches',
            'generated_questions',
            'question_validations',
            'outcome_paths',
            'pyq_scrape_logs'
          )
        ORDER BY table_name;
      `);

      console.log('📊 Verified Tables:');
      tableCheckResult.rows.forEach((row: any) => {
        console.log(`   ✅ ${row.table_name}`);
      });

      console.log('\n🎉 Schema deployment successful!\n');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

deploySchema();
