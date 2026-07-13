import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkDimensionalModel() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking Dimensional Model for Study Guides\n');
    console.log('Expected Flow: ExamCategory → Exam → Subjects → Topics\n');

    // List all tables related to study guides
    console.log('📊 DATABASE TABLES:\n');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%exam%' 
        OR table_name LIKE '%subject%' 
        OR table_name LIKE '%topic%'
        OR table_name LIKE '%study%'
      ORDER BY table_name
    `);

    for (const row of tables.rows) {
      console.log(`  ✓ ${row.table_name}`);
      
      // Get column info
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [row.table_name]);
      
      console.log(`    Columns:`);
      for (const col of columns.rows) {
        console.log(`      - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
      }
      console.log('');
    }

    // Check for bridge/mapping tables
    console.log('\n🔗 LOOKING FOR BRIDGE/MAPPING TABLES:\n');
    const mappingTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE '%mapping%' OR table_name LIKE '%bridge%')
      ORDER BY table_name
    `);

    if (mappingTables.rows.length > 0) {
      console.log('Found mapping tables:');
      for (const row of mappingTables.rows) {
        console.log(`  ✓ ${row.table_name}`);
        
        const columns = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [row.table_name]);
        
        console.log(`    Columns:`);
        for (const col of columns.rows) {
          console.log(`      - ${col.column_name} (${col.data_type})`);
        }
        console.log('');
      }
    } else {
      console.log('❌ No mapping tables found with "mapping" or "bridge" in name');
    }

    // Check current topic_study_content structure
    console.log('\n📋 CURRENT topic_study_content STRUCTURE:\n');
    const sampleContent = await client.query(`
      SELECT subject_id, topic_id, title
      FROM topic_study_content
      LIMIT 5
    `);

    console.log('Sample entries:');
    for (const row of sampleContent.rows) {
      console.log(`  Subject: ${row.subject_id} | Topic: ${row.topic_id} | Title: ${row.title}`);
    }

    console.log('\n\n💡 ANALYSIS:\n');
    console.log('Current structure appears to be:');
    console.log('  topic_study_content (subject_id, topic_id, content)');
    console.log('');
    console.log('Expected dimensional model should have:');
    console.log('  1. exams table (exam definitions)');
    console.log('  2. subjects table (shared subjects: physics, chemistry, etc.)');
    console.log('  3. topics table (topics within subjects)');
    console.log('  4. exam_subject_mapping (which exams have which subjects)');
    console.log('  5. subject_topic_mapping (which topics belong to which subjects)');
    console.log('  6. topic_study_content (actual content for topics)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDimensionalModel();
