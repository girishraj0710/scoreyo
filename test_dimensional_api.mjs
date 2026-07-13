import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testDimensionalAPI() {
  const client = await pool.connect();
  try {
    console.log('🧪 TESTING DIMENSIONAL MODEL API\n');

    // Test Case 1: JEE Main → Physics → Thermodynamics
    console.log('📋 Test 1: JEE Main → Physics → Thermodynamics\n');

    // Step 1: Map exam code
    const exam = await client.query(
      `SELECT id, exam_name FROM dim_exams WHERE exam_code = $1`,
      ['jee-main']
    );
    console.log(`✓ Exam: jee-main → ID ${exam.rows[0]?.id} (${exam.rows[0]?.exam_name})`);

    // Step 2: Map subject code
    const subject = await client.query(
      `SELECT id, subject_name FROM dim_subjects WHERE subject_code = $1`,
      ['jee-physics']
    );
    console.log(`✓ Subject: jee-physics → ID ${subject.rows[0]?.id} (${subject.rows[0]?.subject_name})`);

    // Step 3: Find topic in bridge
    if (exam.rows.length > 0 && subject.rows.length > 0) {
      const topic = await client.query(
        `SELECT
          t.id, t.topic_name, t.category,
          b.is_mandatory, b.weightage
         FROM bridge_exam_subject_topic b
         JOIN dim_topics t ON b.topic_id = t.id
         WHERE b.exam_id = $1 AND b.subject_id = $2
           AND t.topic_name ILIKE '%Thermodynamics%'
         LIMIT 1`,
        [exam.rows[0].id, subject.rows[0].id]
      );

      if (topic.rows.length > 0) {
        console.log(`✓ Topic: Thermodynamics → ID ${topic.rows[0].id} (${topic.rows[0].topic_name})`);
        console.log(`  Category: ${topic.rows[0].category}, Mandatory: ${topic.rows[0].is_mandatory}, Weightage: ${topic.rows[0].weightage}%`);

        // Step 4: Check if content exists
        const content = await client.query(
          `SELECT id, title, subject_id, topic_id FROM topic_study_content
           WHERE topic_id = 'thermodynamics' OR title ILIKE '%Thermodynamics%'
           LIMIT 1`
        );

        if (content.rows.length > 0) {
          console.log(`✅ Content found: "${content.rows[0].title}"`);
          console.log(`   (subject_id: ${content.rows[0].subject_id}, topic_id: ${content.rows[0].topic_id})\n`);
        } else {
          console.log(`⚠️  No content found in topic_study_content\n`);
        }
      } else {
        console.log(`❌ Topic not found in bridge table\n`);
      }
    }

    // Test Case 2: NEET → Biology → Cell Structure
    console.log('📋 Test 2: NEET → Biology → Cell Structure\n');

    const neetExam = await client.query(
      `SELECT id, exam_name FROM dim_exams WHERE exam_code = $1`,
      ['neet-ug']
    );

    if (neetExam.rows.length > 0) {
      console.log(`✓ Exam: neet-ug → ID ${neetExam.rows[0].id} (${neetExam.rows[0].exam_name})`);

      const neetBiology = await client.query(
        `SELECT id, subject_name FROM dim_subjects WHERE subject_code = $1`,
        ['neet-biology']
      );

      if (neetBiology.rows.length > 0) {
        console.log(`✓ Subject: neet-biology → ID ${neetBiology.rows[0].id} (${neetBiology.rows[0].subject_name})`);

        const cellTopic = await client.query(
          `SELECT
            t.id, t.topic_name, t.category,
            b.is_mandatory, b.weightage
           FROM bridge_exam_subject_topic b
           JOIN dim_topics t ON b.topic_id = t.id
           WHERE b.exam_id = $1 AND b.subject_id = $2
             AND t.topic_name ILIKE '%Cell%'
           LIMIT 1`,
          [neetExam.rows[0].id, neetBiology.rows[0].id]
        );

        if (cellTopic.rows.length > 0) {
          console.log(`✓ Topic: Cell → ID ${cellTopic.rows[0].id} (${cellTopic.rows[0].topic_name})`);

          const cellContent = await client.query(
            `SELECT id, title FROM topic_study_content
             WHERE topic_id ILIKE '%cell%' OR title ILIKE '%Cell Structure%'
             LIMIT 1`
          );

          if (cellContent.rows.length > 0) {
            console.log(`✅ Content found: "${cellContent.rows[0].title}"\n`);
          } else {
            console.log(`⚠️  No content found\n`);
          }
        } else {
          console.log(`❌ Topic not found in bridge table\n`);
        }
      } else {
        console.log(`❌ Subject not found\n`);
      }
    } else {
      console.log(`❌ Exam not found\n`);
    }

    // Test Case 3: List all available topics for JEE Main Physics
    console.log('📋 Test 3: All JEE Main Physics topics in bridge table\n');

    if (exam.rows.length > 0 && subject.rows.length > 0) {
      const allTopics = await client.query(
        `SELECT
          t.id, t.topic_name, b.weightage, b.is_mandatory
         FROM bridge_exam_subject_topic b
         JOIN dim_topics t ON b.topic_id = t.id
         WHERE b.exam_id = $1 AND b.subject_id = $2
         ORDER BY t.topic_name
         LIMIT 20`,
        [exam.rows[0].id, subject.rows[0].id]
      );

      console.log(`Found ${allTopics.rows.length} topics for JEE Main Physics:`);
      for (const row of allTopics.rows) {
        // Check if content exists
        const hasContent = await client.query(
          `SELECT COUNT(*) as count FROM topic_study_content
           WHERE topic_id = $1 OR title ILIKE $2`,
          [row.topic_name.toLowerCase().replace(/\s+/g, '-'), `%${row.topic_name}%`]
        );

        const contentStatus = parseInt(hasContent.rows[0].count) > 0 ? '✅' : '❌';
        console.log(`  ${contentStatus} ${row.topic_name} (${row.weightage}%)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testDimensionalAPI();
