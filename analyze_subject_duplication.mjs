import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function analyzeDuplication() {
  const client = await pool.connect();
  try {
    console.log('🔍 Analyzing Subject Duplication in Database\n');
    console.log('='.repeat(80) + '\n');

    // 1. Find all subjects mapped to JEE Main
    console.log('1️⃣ JEE Main Subject Mappings:\n');
    const jeeSubjects = await client.query(`
      SELECT DISTINCT
        s.id,
        s.subject_code,
        s.subject_name,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_subjects s ON b.subject_id = s.id
      WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = 'jee-main')
      GROUP BY s.id, s.subject_code, s.subject_name
      ORDER BY s.subject_name, s.subject_code
    `);

    for (const row of jeeSubjects.rows) {
      const isExamSpecific = row.subject_code.startsWith('jee-');
      const marker = isExamSpecific ? '🔴 EXAM-SPECIFIC' : '🟢 UNIVERSAL';
      console.log(`  ${marker} | ${row.subject_name.padEnd(15)} | ${row.subject_code.padEnd(20)} | ${row.topic_count} topics`);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 2. Check if universal subjects exist for same names
    console.log('2️⃣ Checking for Universal Subject Alternatives:\n');
    
    const duplicateCheck = await client.query(`
      SELECT 
        subject_name,
        array_agg(subject_code ORDER BY subject_code) as all_codes,
        array_agg(id ORDER BY subject_code) as all_ids,
        COUNT(*) as variant_count
      FROM dim_subjects
      WHERE subject_name IN (
        SELECT DISTINCT subject_name 
        FROM dim_subjects 
        WHERE id IN (
          SELECT DISTINCT subject_id 
          FROM bridge_exam_subject_topic 
          WHERE exam_id = (SELECT id FROM dim_exams WHERE exam_code = 'jee-main')
        )
      )
      GROUP BY subject_name
      HAVING COUNT(*) > 1
      ORDER BY subject_name
    `);

    if (duplicateCheck.rows.length === 0) {
      console.log('  ✅ No duplicate subject names found - Database is clean!');
    } else {
      console.log('  ⚠️ Found duplicate subject names:\n');
      for (const row of duplicateCheck.rows) {
        console.log(`  Subject: ${row.subject_name}`);
        console.log(`    Variants: ${row.variant_count}`);
        console.log(`    Codes: ${row.all_codes.join(', ')}`);
        console.log(`    IDs: ${row.all_ids.join(', ')}`);
        console.log('');
      }
    }

    console.log('='.repeat(80) + '\n');

    // 3. Check topic overlap between variants
    console.log('3️⃣ Topic Overlap Analysis:\n');
    
    const overlapAnalysis = await client.query(`
      WITH jee_physics_topics AS (
        SELECT topic_id FROM bridge_exam_subject_topic
        WHERE exam_id = 1 AND subject_id = 1  -- jee-physics
      ),
      universal_physics_topics AS (
        SELECT topic_id FROM bridge_exam_subject_topic
        WHERE exam_id = 1 AND subject_id = 271  -- physics
      )
      SELECT 
        (SELECT COUNT(*) FROM jee_physics_topics) as jee_physics_count,
        (SELECT COUNT(*) FROM universal_physics_topics) as universal_physics_count,
        (SELECT COUNT(*) FROM (
          SELECT topic_id FROM jee_physics_topics
          INTERSECT
          SELECT topic_id FROM universal_physics_topics
        ) overlap) as overlapping_topics
    `);

    if (overlapAnalysis.rows[0]) {
      const o = overlapAnalysis.rows[0];
      console.log(`  jee-physics: ${o.jee_physics_count} topics`);
      console.log(`  physics (universal): ${o.universal_physics_count} topics`);
      console.log(`  Overlapping topics: ${o.overlapping_topics}`);
      
      if (o.overlapping_topics > 0) {
        console.log('\n  ⚠️ Topics are mapped to BOTH subjects! This creates redundancy.');
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 4. Recommendation
    console.log('4️⃣ RECOMMENDATION:\n');
    console.log('  Current state: Database has BOTH exam-specific AND universal subjects');
    console.log('  Problem: Creates duplicates, complex queries, data redundancy');
    console.log('  Solution: Use UNIVERSAL subjects only, map topics via bridge table\n');
    console.log('  Clean-up needed:');
    console.log('    1. Migrate all bridge mappings from exam-specific to universal subjects');
    console.log('    2. Delete exam-specific subjects (jee-physics, jee-chemistry, etc.)');
    console.log('    3. Keep only universal subjects (physics, chemistry, mathematics)');
    console.log('    4. Bridge table handles exam-specific topic differentiation\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

analyzeDuplication();
