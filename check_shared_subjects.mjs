import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkSharedSubjects() {
  const client = await pool.connect();
  try {
    console.log('🔍 CHECKING IF SUBJECTS ARE TRULY SHARED\n');

    // Get all subjects
    const subjects = await client.query(`
      SELECT id, subject_code, subject_name, category
      FROM dim_subjects
      ORDER BY subject_name, id
    `);

    console.log(`Total subjects: ${subjects.rows.length}\n`);

    // Group by subject name
    const grouped = {};
    for (const row of subjects.rows) {
      const name = row.subject_name;
      if (!grouped[name]) grouped[name] = [];
      grouped[name].push(row);
    }

    console.log('📊 SUBJECTS GROUPED BY NAME:\n');
    for (const [name, rows] of Object.entries(grouped)) {
      console.log(`${name} (${rows.length} entries):`);
      for (const row of rows) {
        console.log(`  - ID ${row.id}: ${row.subject_code}`);
      }
      console.log('');
    }

    console.log('\n💡 ANALYSIS:\n');
    if (Object.values(grouped).some(arr => arr.length > 1)) {
      console.log('❌ Subjects are NOT truly shared!');
      console.log('   Each exam has its own Physics, Chemistry, Maths');
      console.log('   Example: jee-physics, kcet-physics, comedk-physics are SEPARATE');
      console.log('');
      console.log('Expected dimensional model:');
      console.log('   - ONE "Physics" subject (shared)');
      console.log('   - ONE "Chemistry" subject (shared)');
      console.log('   - ONE "Mathematics" subject (shared)');
      console.log('   - bridge table maps: JEE Main → Physics, KCET → Physics, etc.');
    } else {
      console.log('✅ Subjects are truly shared!');
    }

    // Check if there are universal subjects
    console.log('\n\n🔍 LOOKING FOR UNIVERSAL SUBJECTS:\n');
    const universalSubjects = await client.query(`
      SELECT id, subject_code, subject_name
      FROM dim_subjects
      WHERE subject_code IN ('physics', 'chemistry', 'mathematics', 'biology', 'english')
    `);

    if (universalSubjects.rows.length > 0) {
      console.log('✅ Found universal subjects:');
      for (const row of universalSubjects.rows) {
        console.log(`  - ${row.subject_code} (${row.subject_name})`);
      }
    } else {
      console.log('❌ No universal subjects found!');
      console.log('   All subjects are exam-specific (jee-physics, kcet-physics, etc.)');
    }

    // Check bridge table to understand the design
    console.log('\n\n📋 BRIDGE TABLE DESIGN CHECK:\n');
    const bridgeSample = await client.query(`
      SELECT 
        e.exam_code,
        s.subject_code,
        COUNT(*) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      GROUP BY e.exam_code, s.subject_code
      ORDER BY e.exam_code, s.subject_code
      LIMIT 20
    `);

    console.log('Exam → Subject mapping:');
    for (const row of bridgeSample.rows) {
      console.log(`  ${row.exam_code} → ${row.subject_code} (${row.topic_count} topics)`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSharedSubjects();
