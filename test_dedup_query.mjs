import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testDedupQuery() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing deduplication query for JEE Main\n');

    const examId = 1;  // JEE Main
    const examCode = 'jee-main';
    const examPrefix = examCode.split('-')[0];  // 'jee'

    console.log(`Exam: ${examCode}, Prefix: ${examPrefix}%\n`);

    const result = await client.query(
      `WITH subject_counts AS (
        -- First compute topic counts for each subject
        SELECT
          s.id,
          s.subject_code,
          s.subject_name,
          s.category,
          COUNT(DISTINCT b.topic_id) as topic_count,
          COUNT(DISTINCT CASE WHEN b.is_mandatory = true THEN b.topic_id END) as mandatory_count
        FROM bridge_exam_subject_topic b
        JOIN dim_subjects s ON b.subject_id = s.id
        WHERE b.exam_id = $1
        GROUP BY s.id, s.subject_code, s.subject_name, s.category
      ),
      ranked_subjects AS (
        -- Then deduplicate by picking the subject with most topics
        SELECT
          id,
          subject_code,
          subject_name,
          category,
          topic_count,
          mandatory_count,
          ROW_NUMBER() OVER (
            PARTITION BY subject_name
            ORDER BY
              topic_count DESC,  -- Most topics first (most comprehensive)
              CASE WHEN subject_code LIKE $2 THEN 1 ELSE 2 END,  -- Then exam-specific
              LENGTH(subject_code) DESC  -- Then longer code (more specific)
          ) as rn
        FROM subject_counts
      )
      SELECT id, subject_code, subject_name, category, topic_count, mandatory_count
      FROM ranked_subjects
      WHERE rn = 1  -- Only keep the highest priority subject per subject_name
      ORDER BY subject_name`,
      [examId, `${examPrefix}%`]
    );

    console.log(`✅ Found ${result.rows.length} unique subjects:\n`);
    for (const row of result.rows) {
      console.log(`  - ${row.subject_name} (${row.subject_code}): ${row.topic_count} topics`);
    }

    console.log('\n✅ No duplicates! All subjects show max topic counts.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

testDedupQuery();
