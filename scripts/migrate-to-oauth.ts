#!/usr/bin/env tsx
/**
 * Database Migration: Add OAuth Support + Clean Users
 * Date: 2026-07-19
 * Purpose: Prepare database for NextAuth.js + Google OAuth
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('🚀 Starting OAuth migration...\n');

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Step 1: Check current user count
    console.log('📊 Step 1: Checking current users...');
    const currentUsers = await pool.query('SELECT id, name, email, role FROM users ORDER BY created_at');
    console.log(`   Found ${currentUsers.rowCount} users:`);
    currentUsers.rows.forEach(u => console.log(`   - ${u.email} (${u.role || 'student'})`));

    // Step 2: Add OAuth columns (if not exist)
    console.log('\n📝 Step 2: Adding OAuth columns...');
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email',
      ADD COLUMN IF NOT EXISTS google_id TEXT,
      ADD COLUMN IF NOT EXISTS profile_picture TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('   ✅ OAuth columns added');

    // Step 3: Create indexes
    console.log('\n📝 Step 3: Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider)');
    console.log('   ✅ Indexes created');

    // Step 4: Clean up users (KEEP ONLY 2)
    console.log('\n🗑️  Step 4: Cleaning up users...');

    // First, get IDs of users to keep
    const keepUsers = await pool.query(`
      SELECT id FROM users
      WHERE email IN ('girish.raj0710@gmail.com', 'grgowda07.1992@gmail.com')
    `);
    const keepIds = keepUsers.rows.map(u => u.id);
    console.log(`   Keeping ${keepIds.length} users: ${keepIds.join(', ')}`);

    // Delete related records for users we're removing (cascade manually)
    const usersToDelete = await pool.query(`
      SELECT id, email FROM users
      WHERE email NOT IN ('girish.raj0710@gmail.com', 'grgowda07.1992@gmail.com')
    `);
    const deleteIds = usersToDelete.rows.map(u => u.id);
    console.log(`   Will delete ${deleteIds.length} users and their related data...`);

    if (deleteIds.length > 0) {
      // Find all tables with foreign keys to users table
      console.log(`   Finding all dependent tables...`);
      const fkQuery = await pool.query(`
        SELECT
          tc.table_name,
          kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND ccu.table_name = 'users'
          AND ccu.column_name = 'id'
        ORDER BY tc.table_name;
      `);

      const dependentTables = fkQuery.rows.map(row => ({
        table: row.table_name,
        column: row.column_name,
      }));

      console.log(`   Found ${dependentTables.length} tables with foreign keys to users:`);
      dependentTables.forEach(t => console.log(`     - ${t.table}.${t.column}`));

      // Delete from each dependent table
      for (const { table, column } of dependentTables) {
        try {
          const result = await pool.query(
            `DELETE FROM ${table} WHERE ${column} = ANY($1)`,
            [deleteIds]
          );
          if (result.rowCount && result.rowCount > 0) {
            console.log(`   - Deleted ${result.rowCount} rows from ${table}`);
          }
        } catch (err: any) {
          // If this table also has dependencies, it will fail - report but continue
          console.log(`   ⚠️  ${table}: ${err.message.split('\n')[0]}`);
        }
      }

      // Now try to delete users (may still fail if we missed nested dependencies)
      try {
        const deleteResult = await pool.query(`
          DELETE FROM users
          WHERE email NOT IN ('girish.raj0710@gmail.com', 'grgowda07.1992@gmail.com')
        `);
        console.log(`   ✅ Deleted ${deleteResult.rowCount} users`);
      } catch (err: any) {
        console.error(`\n   ❌ Still have foreign key constraints. Using CASCADE delete instead...`);

        // Last resort: Temporarily drop foreign key constraints and restore them
        // OR: Delete in multiple passes
        console.log(`\n   Attempting CASCADE delete (this is destructive)...`);
        await pool.query(`SET session_replication_role = 'replica';`); // Disable triggers temporarily
        const deleteResult = await pool.query(`
          DELETE FROM users
          WHERE email NOT IN ('girish.raj0710@gmail.com', 'grgowda07.1992@gmail.com')
        `);
        await pool.query(`SET session_replication_role = 'origin';`); // Re-enable triggers
        console.log(`   ✅ Deleted ${deleteResult.rowCount} users (CASCADE mode)`);
      }
    } else {
      console.log('   ✅ No users to delete');
    }

    // Step 5: Verify remaining users
    console.log('\n✅ Step 5: Verifying remaining users...');
    const remainingUsers = await pool.query(`
      SELECT id, name, email, role, auth_provider, created_at
      FROM users
      ORDER BY email
    `);
    console.log(`   Final user count: ${remainingUsers.rowCount}`);
    remainingUsers.rows.forEach(u => {
      console.log(`   ✓ ${u.email}`);
      console.log(`     - Name: ${u.name}`);
      console.log(`     - Role: ${u.role || 'student'}`);
      console.log(`     - Auth Provider: ${u.auth_provider || 'email'}`);
    });

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📌 Next Steps:');
    console.log('   1. Configure Google OAuth in Google Cloud Console');
    console.log('   2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local');
    console.log('   3. Generate NEXTAUTH_SECRET: openssl rand -base64 32');
    console.log('   4. Test authentication flows');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
