import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function removeDuplicates() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🧹 Removing generic duplicates...\n');

    // Generic duplicate IDs to remove (keep the lower ID)
    const duplicateIds = [21, 186, 296, 172, 4363];

    console.log(`Removing IDs: ${duplicateIds.join(', ')}`);

    await pool.query(`
      DELETE FROM english_questions
      WHERE id = ANY($1)
    `, [duplicateIds]);

    console.log(`✅ Deleted ${duplicateIds.length} duplicate questions\n`);

    // Final count
    const finalResult = await pool.query('SELECT COUNT(*) FROM english_questions');
    console.log(`✅ Final count: ${finalResult.rows[0].count} questions\n`);

    // Verify no more duplicates
    const checkResult = await pool.query(`
      SELECT question, COUNT(*) as count
      FROM english_questions
      GROUP BY question
      HAVING COUNT(*) > 1
      LIMIT 5
    `);

    if (checkResult.rows.length === 0) {
      console.log('✅ No more duplicates found!\n');
    } else {
      console.log(`⚠️  Still found ${checkResult.rows.length} duplicates:`);
      checkResult.rows.forEach(row => {
        console.log(`   "${row.question.substring(0, 80)}..." (${row.count} times)`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

removeDuplicates();
