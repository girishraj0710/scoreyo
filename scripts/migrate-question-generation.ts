#!/usr/bin/env node

/**
 * Deploy Question Generation Schema to Supabase
 * Reuses connection from src/lib/db.ts pool
 */

import 'dotenv/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('❌ ERROR: POSTGRES_URL environment variable not set');
    console.error('Set it in .env.local or as an environment variable');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
  });

  try {
    console.log('🚀 Deploying Question Generation Schema to Supabase...\n');

    const schemaPath = path.join(__dirname, 'question-generation-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    const client = await pool.connect();
    console.log('✅ Connected to Supabase\n');

    try {
      // Split and execute statements (simple split by ;)
      // Be careful with nested statements
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

      let successCount = 0;
      let skipCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        try {
          const result = await client.query(statement);
          successCount++;

          // Log table creation
          if (statement.includes('CREATE TABLE')) {
            const match = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
            if (match) {
              console.log(`   ✅ Table: ${match[1]}`);
            }
          }
          // Log index creation
          else if (statement.includes('CREATE INDEX')) {
            const match = statement.match(/CREATE INDEX idx_(\w+)/);
            if (match) {
              console.log(`   📍 Index: idx_${match[1]}`);
            }
          }
        } catch (err: any) {
          // Ignore "already exists" errors
          if (err.code === '42P07') {  // relation already exists
            skipCount++;
          } else if (err.message.includes('already exists')) {
            skipCount++;
          } else {
            console.error(`\n❌ Error at statement ${i + 1}:`);
            console.error(`   ${err.code}: ${err.message}`);
            console.error(`   Statement: ${statement.substring(0, 80)}...\n`);
          }
        }
      }

      console.log(`\n📊 Deployment Summary:`);
      console.log(`   ✅ Executed: ${successCount} statements`);
      console.log(`   ⏭️  Skipped: ${skipCount} statements (already exist)`);

      // Verify tables
      console.log(`\n🔍 Verifying tables...\n`);
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

      if (tableCheckResult.rows.length === 7) {
        console.log('✅ All 7 tables verified:\n');
        tableCheckResult.rows.forEach((row: any) => {
          console.log(`   ✅ ${row.table_name}`);
        });
      } else {
        console.warn(`⚠️  Expected 7 tables, found ${tableCheckResult.rows.length}`);
      }

      // Count indexes
      const indexCheckResult = await client.query(`
        SELECT count(*) as count FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname LIKE 'idx_%'
          AND (
            indexname LIKE 'idx_pyq_%' OR
            indexname LIKE 'idx_exam_pattern_%' OR
            indexname LIKE 'idx_generation_%' OR
            indexname LIKE 'idx_generated_%' OR
            indexname LIKE 'idx_question_validations_%' OR
            indexname LIKE 'idx_outcome_%' OR
            indexname LIKE 'idx_scrape_%'
          );
      `);

      console.log(`\n📍 Indexes: ${indexCheckResult.rows[0]?.count || 0} created\n`);

      console.log('🎉 Schema deployment successful!\n');
      console.log('Next: Week 2 - Build Learn English scraper');
      console.log('Target: 500+ IELTS questions in database\n');

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

migrate();
