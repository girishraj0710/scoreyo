import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkDimensionalData() {
  const client = await pool.connect();
  try {
    console.log('🔍 CHECKING DIMENSIONAL MODEL DATA\n');

    // Check dim_exams
    console.log('📊 dim_exams:\n');
    const exams = await client.query(`
      SELECT id, exam_code, exam_name, category
      FROM dim_exams
      ORDER BY id
      LIMIT 10
    `);
    console.log(`Total exams: ${exams.rows.length}`);
    for (const row of exams.rows) {
      console.log(`  ${row.id}. ${row.exam_code} - ${row.exam_name} (${row.category})`);
    }

    // Check dim_subjects
    console.log('\n📚 dim_subjects:\n');
    const subjects = await client.query(`
      SELECT id, subject_code, subject_name, category
      FROM dim_subjects
      ORDER BY id
      LIMIT 20
    `);
    console.log(`Total subjects: ${subjects.rows.length}`);
    for (const row of subjects.rows) {
      console.log(`  ${row.id}. ${row.subject_code} - ${row.subject_name} (${row.category})`);
    }

    // Check dim_topics
    console.log('\n📖 dim_topics:\n');
    const topics = await client.query(`
      SELECT id, topic_name, category, scope
      FROM dim_topics
      ORDER BY id
      LIMIT 20
    `);
    console.log(`Total topics: ${topics.rows.length}`);
    for (const row of topics.rows) {
      console.log(`  ${row.id}. ${row.topic_name} (${row.category} - ${row.scope})`);
    }

    // Check bridge table
    console.log('\n🔗 bridge_exam_subject_topic:\n');
    const bridge = await client.query(`
      SELECT 
        b.exam_id,
        e.exam_name,
        b.subject_id,
        s.subject_name,
        b.topic_id,
        t.topic_name,
        b.is_mandatory,
        b.weightage
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      LIMIT 20
    `);
    console.log(`Total bridge entries: ${bridge.rows.length}`);
    for (const row of bridge.rows) {
      console.log(`  ${row.exam_name} → ${row.subject_name} → ${row.topic_name} (weightage: ${row.weightage}%)`);
    }

    // Check topic_study_content vs dimensional model
    console.log('\n\n⚠️  MISMATCH CHECK:\n');
    console.log('topic_study_content uses TEXT IDs (subject_id, topic_id)');
    console.log('Dimensional model uses INTEGER IDs\n');

    const contentSample = await client.query(`
      SELECT subject_id, topic_id, title
      FROM topic_study_content
      LIMIT 5
    `);

    console.log('topic_study_content sample:');
    for (const row of contentSample.rows) {
      console.log(`  subject_id: "${row.subject_id}" (TEXT) | topic_id: "${row.topic_id}" (TEXT)`);
    }

    console.log('\n\n💡 THE PROBLEM:\n');
    console.log('1. Dimensional model ready: dim_exams, dim_subjects, dim_topics ✅');
    console.log('2. Bridge table ready: bridge_exam_subject_topic ✅');
    console.log('3. topic_study_content still uses OLD format (TEXT IDs) ❌');
    console.log('4. API likely still queries by TEXT subject_id/topic_id ❌');
    console.log('');
    console.log('SOLUTION NEEDED:');
    console.log('- Either migrate topic_study_content to use INTEGER IDs');
    console.log('- OR create a mapping layer to translate TEXT → INTEGER');
    console.log('- Update API to query via bridge table');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDimensionalData();
