import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkDuplicates() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking JEE Main subject duplicates\n');

    // Get JEE Main exam ID
    const exam = await client.query(
      `SELECT id FROM dim_exams WHERE exam_code = 'jee-main'`
    );
    const examId = exam.rows[0].id;
    console.log(`JEE Main ID: ${examId}\n`);

    // Get all subject_ids for JEE Main
    const subjectIds = await client.query(
      `SELECT DISTINCT subject_id 
       FROM bridge_exam_subject_topic 
       WHERE exam_id = $1
       ORDER BY subject_id`,
      [examId]
    );

    console.log(`Found ${subjectIds.rows.length} unique subject_ids in bridge table\n`);

    // For each subject_id, get subject details
    console.log('Subject details:');
    for (const row of subjectIds.rows) {
      const subject = await client.query(
        `SELECT id, subject_code, subject_name FROM dim_subjects WHERE id = $1`,
        [row.subject_id]
      );

      if (subject.rows.length > 0) {
        console.log(`  ${row.subject_id}: ${subject.rows[0].subject_code} - ${subject.rows[0].subject_name}`);
      }
    }

    // Check for duplicate subject names
    console.log('\n\nChecking for duplicate subject names:\n');
    const duplicates = await client.query(
      `SELECT 
        s.subject_name,
        COUNT(DISTINCT s.id) as count,
        ARRAY_AGG(DISTINCT s.subject_code) as codes
       FROM bridge_exam_subject_topic b
       JOIN dim_subjects s ON b.subject_id = s.id
       WHERE b.exam_id = $1
       GROUP BY s.subject_name
       HAVING COUNT(DISTINCT s.id) > 1
       ORDER BY s.subject_name`,
      [examId]
    );

    if (duplicates.rows.length > 0) {
      console.log('❌ Found duplicates:');
      for (const dup of duplicates.rows) {
        console.log(`  ${dup.subject_name}: ${dup.count} entries`);
        console.log(`    Subject codes: ${dup.codes.join(', ')}`);
      }
    } else {
      console.log('✅ No duplicate subject names found');
    }

    // Check the actual query used by API
    console.log('\n\nRunning actual API query:\n');
    const apiQuery = await client.query(
      `SELECT DISTINCT
        s.id,
        s.subject_code,
        s.subject_name,
        s.category,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_subjects s ON b.subject_id = s.id
      WHERE b.exam_id = $1
      GROUP BY s.id, s.subject_code, s.subject_name, s.category
      ORDER BY s.subject_name`,
      [examId]
    );

    console.log(`API would return ${apiQuery.rows.length} subjects:`);
    for (const s of apiQuery.rows) {
      console.log(`  - ${s.subject_name} (${s.subject_code}): ${s.topic_count} topics`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDuplicates();
