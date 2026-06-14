/**
 * Supabase Database Validation Script
 * Validates database state before running dimensional model migration
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function validate() {
  const client = await pool.connect();

  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║       SUPABASE DATABASE VALIDATION - MIGRATION PREFLIGHT      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // 1. Check if dimensional model tables exist
    console.log('1️⃣  Checking Dimensional Model Tables...');
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('dim_exams', 'dim_subjects', 'dim_topics', 'bridge_exam_subject_topic', 'fact_exam_questions')
      ORDER BY table_name
    `);
    console.log(`   ✅ Found ${tables.rows.length}/5 tables:`, tables.rows.map(r => r.table_name).join(', '));

    if (tables.rows.length < 5) {
      console.log('   ❌ ERROR: Missing dimensional model tables! Cannot proceed.');
      process.exit(1);
    }

    // 2. Count current exam-specific subjects
    console.log('\n2️⃣  Current Subject Structure...');
    const currentSubjects = await client.query(`
      SELECT subject_code
      FROM dim_subjects
      WHERE subject_code LIKE '%-%'
      ORDER BY subject_code
      LIMIT 10
    `);
    const totalExamSpecific = await client.query(`SELECT COUNT(*) FROM dim_subjects WHERE subject_code LIKE '%-%'`);
    console.log(`   📊 Exam-specific subjects (with dash): ${totalExamSpecific.rows[0].count}`);
    console.log(`   📝 Examples:`, currentSubjects.rows.map(r => r.subject_code).join(', '));

    // Check if shared subjects already exist
    const sharedSubjects = await client.query(`
      SELECT subject_code
      FROM dim_subjects
      WHERE subject_code NOT LIKE '%-%'
      ORDER BY subject_code
      LIMIT 10
    `);
    const totalShared = await client.query(`SELECT COUNT(*) FROM dim_subjects WHERE subject_code NOT LIKE '%-%'`);
    console.log(`   📊 Shared subjects (no dash): ${totalShared.rows[0].count}`);
    if (totalShared.rows[0].count > 0) {
      console.log(`   📝 Examples:`, sharedSubjects.rows.map(r => r.subject_code).join(', '));
    }

    // 3. Count exams
    console.log('\n3️⃣  Exams in Database...');
    const exams = await client.query(`SELECT exam_code FROM dim_exams ORDER BY exam_code`);
    console.log(`   📊 Total exams: ${exams.rows.length}`);
    console.log(`   📝 Examples:`, exams.rows.slice(0, 10).map(r => r.exam_code).join(', '));

    // 4. Count topics
    console.log('\n4️⃣  Topics in Database...');
    const totalTopics = await client.query(`SELECT COUNT(*) FROM dim_topics`);
    const sampleTopics = await client.query(`SELECT topic_name FROM dim_topics ORDER BY topic_name LIMIT 10`);
    console.log(`   📊 Total topics: ${totalTopics.rows[0].count}`);
    console.log(`   📝 Examples:`, sampleTopics.rows.map(r => r.topic_name).join(', '));

    // 5. Count questions
    console.log('\n5️⃣  Questions in Database...');
    const totalQuestions = await client.query(`SELECT COUNT(*) FROM fact_exam_questions`);
    console.log(`   📊 Total questions: ${totalQuestions.rows[0].count}`);

    // 6. Check bridge table structure
    console.log('\n6️⃣  Bridge Table Sample (JEE/NEET Physics)...');
    const bridgeSample = await client.query(`
      SELECT
        e.exam_code,
        s.subject_code,
        t.topic_name
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      WHERE e.exam_code IN ('jee-main', 'neet')
        AND s.subject_code LIKE '%physics%'
      ORDER BY e.exam_code, t.topic_name
      LIMIT 5
    `);
    console.log(`   📊 Found ${bridgeSample.rows.length} bridge entries:`);
    bridgeSample.rows.forEach(r => {
      console.log(`      ${r.exam_code} → ${r.subject_code} → ${r.topic_name}`);
    });

    // 7. Get ALL subjects from database to check mapper coverage
    console.log('\n7️⃣  Validating Subject Mapper Coverage...');
    const allDbSubjects = await client.query(`
      SELECT DISTINCT subject_code
      FROM dim_subjects
      WHERE subject_code LIKE '%-%'
      ORDER BY subject_code
    `);

    const dbSubjects = allDbSubjects.rows.map(r => r.subject_code);
    console.log(`   📊 Database has ${dbSubjects.length} exam-specific subjects`);

    // Load our mapper
    const { SUBJECT_MAP } = require('../src/lib/subject-mapper.ts');
    const mapperKeys = Object.keys(SUBJECT_MAP);
    console.log(`   📊 Mapper has ${mapperKeys.length} mappings`);

    const unmappedInDb = dbSubjects.filter(s => !mapperKeys.includes(s));
    const mappedButNotInDb = mapperKeys.filter(s => !dbSubjects.includes(s));

    if (unmappedInDb.length > 0) {
      console.log(`   ⚠️  WARNING: ${unmappedInDb.length} subjects in DB but NOT in mapper:`);
      unmappedInDb.forEach(s => console.log(`      - ${s}`));
      console.log(`   ⚠️  These will use fallback mapping (strip prefix)`);
    } else {
      console.log(`   ✅ All database subjects are mapped!`);
    }

    if (mappedButNotInDb.length > 0) {
      console.log(`   ℹ️  ${mappedButNotInDb.length} subjects in mapper but not in DB`);
      console.log(`      (This is OK - they come from exams.ts frontend definitions)`);
    }

    // 8. Check if migration was already run
    console.log('\n8️⃣  Migration Status Check...');
    const migrationTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'subject_migration_map'
      ) as exists
    `);

    if (migrationTableExists.rows[0].exists) {
      console.log(`   ⚠️  WARNING: subject_migration_map table already exists!`);
      console.log(`   ⚠️  Migration may have been run before. Check carefully!`);

      const mapCount = await client.query(`SELECT COUNT(*) FROM subject_migration_map`);
      console.log(`   📊 Existing mappings in table: ${mapCount.rows[0].count}`);
    } else {
      console.log(`   ✅ Migration NOT yet run (safe to proceed)`);
    }

    // 9. Sample a few subjects to show current vs planned structure
    console.log('\n9️⃣  Current vs Planned Structure Example...');
    const physicsSample = await client.query(`
      SELECT
        e.exam_code,
        s.subject_code,
        COUNT(DISTINCT t.id) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_exams e ON b.exam_id = e.id
      JOIN dim_subjects s ON b.subject_id = s.id
      JOIN dim_topics t ON b.topic_id = t.id
      WHERE s.subject_code LIKE '%physics%'
      GROUP BY e.exam_code, s.subject_code
      ORDER BY e.exam_code
      LIMIT 5
    `);

    console.log('   📊 Current (exam-specific):');
    physicsSample.rows.forEach(r => {
      const planned = SUBJECT_MAP[r.subject_code] || 'unknown';
      console.log(`      ${r.exam_code} → ${r.subject_code} (${r.topic_count} topics) → will map to: "${planned}"`);
    });

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    VALIDATION SUMMARY                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log(`✅ Dimensional tables exist: YES`);
    console.log(`✅ Exam-specific subjects in DB: ${dbSubjects.length}`);
    console.log(`✅ Subject mapper mappings: ${mapperKeys.length}`);
    console.log(`✅ Unmapped subjects: ${unmappedInDb.length} ${unmappedInDb.length > 0 ? '(will use fallback)' : ''}`);
    console.log(`✅ Total exams: ${exams.rows.length}`);
    console.log(`✅ Total topics: ${totalTopics.rows[0].count}`);
    console.log(`✅ Total questions: ${totalQuestions.rows[0].count}`);
    console.log(`${migrationTableExists.rows[0].exists ? '⚠️' : '✅'}  Migration already run: ${migrationTableExists.rows[0].exists ? 'YES (check carefully!)' : 'NO'}`);

    console.log('\n🚀 Ready to proceed with migration!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

validate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
