import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function analyzeContentGap() {
  const client = await pool.connect();
  try {
    console.log('🔍 CONTENT GAP ANALYSIS\n');

    // Get total topics in dimensional model
    const totalTopics = await client.query(`
      SELECT COUNT(DISTINCT t.id) as count
      FROM dim_topics t
      JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
    `);

    console.log(`📊 Total unique topics in dimensional model: ${totalTopics.rows[0].count}\n`);

    // Get topics with content
    const topicsWithContent = await client.query(`
      SELECT COUNT(*) as count FROM topic_study_content
      WHERE path_id IS NULL
    `);

    console.log(`📚 Topics with content in topic_study_content: ${topicsWithContent.rows[0].count}`);
    console.log(`   (Excluding English multi-path content)\n`);

    // Coverage by exam
    console.log('📋 COVERAGE BY EXAM:\n');

    const examCoverage = await client.query(`
      SELECT
        e.exam_code,
        e.exam_name,
        COUNT(DISTINCT b.topic_id) as total_topics,
        COUNT(DISTINCT CASE
          WHEN tsc.id IS NOT NULL THEN b.topic_id
        END) as topics_with_content
      FROM dim_exams e
      JOIN bridge_exam_subject_topic b ON e.id = b.exam_id
      LEFT JOIN dim_topics t ON b.topic_id = t.id
      LEFT JOIN topic_study_content tsc
        ON (tsc.topic_id = LOWER(REPLACE(t.topic_name, ' ', '-'))
            OR tsc.title ILIKE '%' || t.topic_name || '%')
        AND tsc.path_id IS NULL
      GROUP BY e.exam_code, e.exam_name
      ORDER BY total_topics DESC
      LIMIT 10
    `);

    for (const row of examCoverage.rows) {
      const coverage = row.total_topics > 0
        ? Math.round((row.topics_with_content / row.total_topics) * 100)
        : 0;
      const bar = '█'.repeat(Math.floor(coverage / 5)) + '░'.repeat(20 - Math.floor(coverage / 5));
      console.log(`${row.exam_code.padEnd(15)} ${bar} ${coverage}% (${row.topics_with_content}/${row.total_topics})`);
    }

    // Priority topics (high weightage, no content)
    console.log('\n\n🎯 HIGH PRIORITY TOPICS (No content yet):\n');

    const priorityTopics = await client.query(`
      SELECT
        e.exam_name,
        s.subject_name,
        t.topic_name,
        b.weightage,
        b.is_mandatory
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      LEFT JOIN topic_study_content tsc
        ON (tsc.topic_id = LOWER(REPLACE(t.topic_name, ' ', '-'))
            OR tsc.title ILIKE '%' || t.topic_name || '%')
        AND tsc.path_id IS NULL
      WHERE tsc.id IS NULL
        AND b.is_mandatory = true
        AND e.exam_code IN ('jee-main', 'neet-ug', 'upsc-cse', 'ssc-cgl', 'cat')
      ORDER BY b.weightage DESC, e.exam_name, s.subject_name
      LIMIT 30
    `);

    for (const row of priorityTopics.rows) {
      console.log(`  ${row.exam_name} → ${row.subject_name} → ${row.topic_name} (${row.weightage}%)`);
    }

    console.log('\n\n💡 RECOMMENDATION:\n');
    console.log('Generate content for top 5 exams:');
    console.log('  1. JEE Main (Engineering) - Physics, Chemistry, Maths');
    console.log('  2. NEET (Medical) - Biology, Physics, Chemistry');
    console.log('  3. UPSC CSE (Civil Services) - History, Polity, Geography, Economy');
    console.log('  4. SSC CGL (Government) - Reasoning, Quantitative, English, GK');
    console.log('  5. CAT (Management) - Verbal, Quant, DILR');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

analyzeContentGap();
