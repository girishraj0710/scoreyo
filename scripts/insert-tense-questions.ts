import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not found in environment');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
});

const SQL_FILES = [
  'CORRECT-present-simple-questions.sql',
  'CORRECT-present-continuous-questions.sql',
  'CORRECT-present-perfect-FULL.sql',
  'CORRECT-past-simple-FULL.sql',
  'CORRECT-past-continuous-FULL.sql',
  'CORRECT-future-simple-FULL.sql',
  'COMPLETE-tenses-advanced-ALL-510Q.sql',
];

const EXPECTED_COUNTS = {
  'present-simple': 100,
  'present-continuous': 100,
  'present-perfect': 120,
  'past-simple': 100,
  'past-continuous': 100,
  'future-simple': 100,
  'tenses-advanced': 102,
};

async function insertTenseQuestions() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting tense questions insertion...\n');

    // Clear existing tense questions
    console.log('🗑️  Clearing existing tense questions...');
    await client.query(`
      DELETE FROM english_questions WHERE topic_id IN (
        'present-simple',
        'present-continuous',
        'present-perfect',
        'past-simple',
        'past-continuous',
        'future-simple',
        'tenses-advanced'
      )
    `);
    console.log('✅ Cleared existing questions\n');

    // Insert questions from each file
    for (const filename of SQL_FILES) {
      const filePath = path.join(__dirname, 'output', filename);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        continue;
      }

      console.log(`📄 Processing ${filename}...`);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      // Extract only INSERT statements (skip comments and verification queries)
      const insertStatements = sqlContent
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('(') ||
                 trimmed.startsWith('INSERT INTO') ||
                 trimmed.includes('VALUES');
        })
        .join('\n');

      if (insertStatements.trim()) {
        try {
          await client.query(insertStatements);
          console.log(`✅ Inserted questions from ${filename}\n`);
        } catch (error: any) {
          console.error(`❌ Error inserting from ${filename}:`, error.message);
          // Continue with other files
        }
      }
    }

    // Verification
    console.log('============================================================================');
    console.log('📊 VERIFICATION RESULTS');
    console.log('============================================================================\n');

    const result = await client.query(`
      SELECT
        topic_id,
        COUNT(*) as total_questions,
        SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
        SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
        SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
      FROM english_questions
      WHERE topic_id IN (
        'present-simple',
        'present-continuous',
        'present-perfect',
        'past-simple',
        'past-continuous',
        'future-simple',
        'tenses-advanced'
      )
      GROUP BY topic_id
      ORDER BY
        CASE topic_id
          WHEN 'present-simple' THEN 1
          WHEN 'present-continuous' THEN 2
          WHEN 'present-perfect' THEN 3
          WHEN 'past-simple' THEN 4
          WHEN 'past-continuous' THEN 5
          WHEN 'future-simple' THEN 6
          WHEN 'tenses-advanced' THEN 7
        END
    `);

    let totalInserted = 0;
    result.rows.forEach(row => {
      const expected = EXPECTED_COUNTS[row.topic_id as keyof typeof EXPECTED_COUNTS] || '?';
      const status = row.total_questions === expected ? '✅' : '⚠️';
      console.log(`${status} ${row.topic_id.padEnd(25)} ${row.total_questions}/${expected} questions (Easy: ${row.easy_count}, Medium: ${row.medium_count}, Hard: ${row.hard_count})`);
      totalInserted += parseInt(row.total_questions);
    });

    console.log('\n============================================================================');
    console.log(`✅ TOTAL INSERTED: ${totalInserted}/722 questions`);
    console.log('============================================================================\n');

    if (totalInserted === 722) {
      console.log('🎉 SUCCESS! All 722 tense questions inserted successfully!\n');
    } else {
      console.log(`⚠️  Expected 722 questions, but inserted ${totalInserted}\n`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

insertTenseQuestions()
  .then(() => {
    console.log('✅ Insertion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  });
