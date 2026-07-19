import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🚀 Running match game migration...');

    const sqlPath = join(__dirname, '../migrations/match-game-schema.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    await pool.query(sql);

    console.log('✅ Match game schema created successfully!');

    // Verify
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_name = 'match_game_sessions'
    `);

    if (result.rows[0].count === '1') {
      console.log('✅ Table verified: match_game_sessions exists');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
