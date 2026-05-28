#!/usr/bin/env tsx
/**
 * Create verified_questions table in Turso database
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local file');
}

async function createTable() {
  console.log('🗄️  Creating verified_questions table...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Create table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS verified_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer INTEGER,
        explanation TEXT,
        subject TEXT,
        topic TEXT,
        difficulty TEXT,
        source TEXT,
        exam_relevance TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Table created successfully!');

    // Create indexes for better query performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_subject ON verified_questions(subject)
    `);
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_difficulty ON verified_questions(difficulty)
    `);
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_source ON verified_questions(source)
    `);

    console.log('✅ Indexes created successfully!');

    // Check existing data
    const result = await db.execute('SELECT COUNT(*) as count FROM verified_questions');
    console.log(`\n📊 Current questions in database: ${result.rows[0].count}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTable();
