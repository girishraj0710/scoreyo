#!/usr/bin/env node

/**
 * Migration: Add new user fields (age, location, phone_number, exam_preparing_for)
 * Run this once to update the users table schema
 */

const { createClient } = require("@libsql/client");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

process.env.TURSO_DATABASE_URL = envVars.TURSO_DATABASE_URL;
process.env.TURSO_AUTH_TOKEN = envVars.TURSO_AUTH_TOKEN;

async function migrate() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('🔄 Migrating users table...\n');

  try {
    // Add new columns (SQLite will ignore if they already exist with IF NOT EXISTS)
    const migrations = [
      'ALTER TABLE users ADD COLUMN age INTEGER',
      'ALTER TABLE users ADD COLUMN location TEXT',
      'ALTER TABLE users ADD COLUMN phone_number TEXT',
      'ALTER TABLE users ADD COLUMN exam_preparing_for TEXT',
    ];

    for (const migration of migrations) {
      try {
        await client.execute(migration);
        console.log(`✅ ${migration}`);
      } catch (error) {
        // Column might already exist
        if (error.message.includes('duplicate column name')) {
          console.log(`⏭️  ${migration} (already exists)`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Migration complete!\n');
    console.log('New user fields added:');
    console.log('  - age (INTEGER)');
    console.log('  - location (TEXT)');
    console.log('  - phone_number (TEXT)');
    console.log('  - exam_preparing_for (TEXT)\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
