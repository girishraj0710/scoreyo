import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testExamsAPIQuery() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing Exams API Query\n');

    // Test the main exam query
    const examsResult = await client.query(`
      SELECT
        e.id,
        e.exam_code,
        e.exam_name,
        e.category,
        e.conducting_body,
        COUNT(DISTINCT b.subject_id) as subject_count,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM dim_exams e
      LEFT JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
      GROUP BY e.id, e.exam_code, e.exam_name, e.category, e.conducting_body
      ORDER BY e.exam_name
      LIMIT 3
    `);

    console.log(`✓ Found ${examsResult.rows.length} exams\n`);

    for (const exam of examsResult.rows) {
      console.log(`Exam: ${exam.exam_name} (${exam.exam_code})`);
      console.log(`  Category: ${exam.category}`);
      console.log(`  Subjects: ${exam.subject_count}, Topics: ${exam.topic_count}\n`);

      // Get subjects for this exam
      const subjectsResult = await client.query(
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
        ORDER BY s.subject_name
        LIMIT 3`,
        [exam.id]
      );

      console.log(`  Subjects:`);
      for (const subject of subjectsResult.rows) {
        console.log(`    - ${subject.subject_name} (${subject.subject_code}): ${subject.topic_count} topics`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testExamsAPIQuery();
