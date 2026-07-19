require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL not found in environment variables');
    console.error('Make sure .env.local exists with POSTGRES_URL');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Connecting to Supabase PostgreSQL...');
    const client = await pool.connect();

    // Read migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../migrations/ensure-english-progress-table.sql'),
      'utf8'
    );

    console.log('📝 Running migration: ensure-english-progress-table.sql');
    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully!');

    // Verify table exists
    const result = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'english_progress'
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 english_progress table structure:');
    console.table(result.rows);

    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
