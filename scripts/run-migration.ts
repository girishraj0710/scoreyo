import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔄 Running migration: pending_questions table...');

    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrate-pending-questions.sql'),
      'utf-8'
    );

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 80)}...`);
      await pool.query(statement);
    }

    console.log('✅ Migration completed successfully!');

    // Verify tables were created
    const pendingCount = await pool.query('SELECT COUNT(*) FROM pending_questions');
    console.log(`✅ pending_questions table exists (${pendingCount.rows[0].count} rows)`);

    const userColumns = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('questions_contributed', 'contribution_points')
    `);
    console.log(`✅ User contributor columns: ${userColumns.rows.map(r => r.column_name).join(', ')}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
