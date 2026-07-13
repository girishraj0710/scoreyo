#!/usr/bin/env node
/**
 * Transfer flashcard deck ownership from old account to current account
 *
 * Problem: User has 2 accounts with same email:
 * - Old: 77788b1d-ea0f-4f92-868b-285bbbe55473 (created 7 decks)
 * - New: 2c10f9bb-50b2-4bb6-84c8-f12426d7ba37 (currently logged in)
 *
 * This script transfers all decks from old account to new account.
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const postgresLine = envContent
  .split('\n')
  .find(line => line.startsWith('POSTGRES_URL='));

let POSTGRES_URL = postgresLine?.substring('POSTGRES_URL='.length).trim();
// Remove quotes if present
if (POSTGRES_URL && (POSTGRES_URL.startsWith('"') || POSTGRES_URL.startsWith("'"))) {
  POSTGRES_URL = POSTGRES_URL.slice(1, -1);
}

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not found in .env.local');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const OLD_USER_ID = '77788b1d-ea0f-4f92-868b-285bbbe55473';
const NEW_USER_ID = '2c10f9bb-50b2-4bb6-84c8-f12426d7ba37';

async function transferDeckOwnership() {
  const client = await pool.connect();

  try {
    console.log('\n🔄 Starting deck ownership transfer...\n');

    // Step 1: Show current ownership
    console.log('📊 Current deck ownership:\n');
    const currentDecks = await client.query(`
      SELECT
        fd.id,
        fd.title,
        fd.user_id as owner_id,
        u.email as owner_email,
        u.name as owner_name
      FROM flashcard_decks fd
      LEFT JOIN users u ON fd.user_id = u.id
      WHERE fd.user_id = $1
      ORDER BY fd.id
    `, [OLD_USER_ID]);

    if (currentDecks.rows.length === 0) {
      console.log('✅ No decks found for old account. Already transferred?');
      return;
    }

    currentDecks.rows.forEach((deck, i) => {
      console.log(`  ${i + 1}. ${deck.title} (ID: ${deck.id})`);
      console.log(`     Owner: ${deck.owner_name} (${deck.owner_email})`);
    });

    console.log(`\n   Total: ${currentDecks.rows.length} decks\n`);

    // Step 2: Verify new user exists
    const newUser = await client.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [NEW_USER_ID]
    );

    if (newUser.rows.length === 0) {
      console.error('❌ New user not found:', NEW_USER_ID);
      process.exit(1);
    }

    console.log('📝 Transferring to:');
    console.log(`   Name: ${newUser.rows[0].name}`);
    console.log(`   Email: ${newUser.rows[0].email}`);
    console.log(`   ID: ${newUser.rows[0].id}\n`);

    // Step 3: Transfer ownership
    const updateResult = await client.query(`
      UPDATE flashcard_decks
      SET user_id = $1, updated_at = NOW()
      WHERE user_id = $2
      RETURNING id, title
    `, [NEW_USER_ID, OLD_USER_ID]);

    console.log(`✅ Transferred ${updateResult.rows.length} deck(s)\n`);

    // Step 4: Verify transfer
    const verifyDecks = await client.query(`
      SELECT
        fd.id,
        fd.title,
        fd.user_id as owner_id,
        u.email as owner_email,
        u.name as owner_name
      FROM flashcard_decks fd
      LEFT JOIN users u ON fd.user_id = u.id
      WHERE fd.user_id = $1
      ORDER BY fd.id
    `, [NEW_USER_ID]);

    console.log('✅ Verification - Decks now owned by new account:\n');
    verifyDecks.rows.forEach((deck, i) => {
      console.log(`  ${i + 1}. ${deck.title} (ID: ${deck.id})`);
      console.log(`     Owner: ${deck.owner_name} (${deck.owner_email})`);
    });

    console.log(`\n   Total: ${verifyDecks.rows.length} decks\n`);
    console.log('🎉 Deck ownership transfer complete!\n');

  } catch (error) {
    console.error('❌ Error during transfer:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

transferDeckOwnership().catch((error) => {
  console.error('Transfer failed:', error);
  process.exit(1);
});
