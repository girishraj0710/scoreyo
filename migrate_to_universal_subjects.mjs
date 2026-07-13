import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function migrateToUniversalSubjects() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting Migration to Universal Subjects\n');
    console.log('='.repeat(80) + '\n');

    await client.query('BEGIN');

    // Step 1: Identify subject name groups and their universal IDs
    console.log('1️⃣ Identifying Universal Subject IDs...\n');
    
    const subjectGroups = await client.query(`
      SELECT 
        subject_name,
        MIN(CASE WHEN subject_code NOT LIKE '%-%' THEN id END) as universal_id,
        array_agg(id) as all_variant_ids,
        array_agg(subject_code) as all_variant_codes
      FROM dim_subjects
      WHERE subject_name IN ('Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi')
      GROUP BY subject_name
      HAVING COUNT(*) > 1
    `);

    console.log(`Found ${subjectGroups.rows.length} subject groups with duplicates:\n`);
    
    const migrationMap = {};
    
    for (const group of subjectGroups.rows) {
      if (!group.universal_id) {
        console.log(`  ⚠️ No universal subject found for: ${group.subject_name}`);
        console.log(`     Variants: ${group.all_variant_codes.join(', ')}`);
        console.log(`     Will use first variant as universal\n`);
        migrationMap[group.subject_name] = {
          universalId: group.all_variant_ids[0],
          variantIds: group.all_variant_ids.slice(1)
        };
      } else {
        console.log(`  ✅ ${group.subject_name}: Universal ID = ${group.universal_id}`);
        console.log(`     Exam-specific variants to migrate: ${group.all_variant_ids.filter(id => id !== group.universal_id).length}`);
        migrationMap[group.subject_name] = {
          universalId: group.universal_id,
          variantIds: group.all_variant_ids.filter(id => id !== group.universal_id)
        };
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 2: Migrate bridge table mappings
    console.log('2️⃣ Migrating Bridge Table Mappings...\n');
    
    let totalMigrated = 0;
    
    for (const [subjectName, { universalId, variantIds }] of Object.entries(migrationMap)) {
      console.log(`  Processing: ${subjectName} → Universal ID ${universalId}`);
      
      for (const variantId of variantIds) {
        // Check if mappings exist for this variant
        const existingMappings = await client.query(`
          SELECT COUNT(*) as count
          FROM bridge_exam_subject_topic
          WHERE subject_id = $1
        `, [variantId]);
        
        const count = parseInt(existingMappings.rows[0].count);
        
        if (count > 0) {
          console.log(`    Migrating ${count} mappings from variant ${variantId}...`);
          
          // Update mappings to use universal subject ID (skip if already exists)
          await client.query(`
            UPDATE bridge_exam_subject_topic
            SET subject_id = $1
            WHERE subject_id = $2
            AND NOT EXISTS (
              SELECT 1 FROM bridge_exam_subject_topic existing
              WHERE existing.exam_id = bridge_exam_subject_topic.exam_id
              AND existing.subject_id = $1
              AND existing.topic_id = bridge_exam_subject_topic.topic_id
            )
          `, [universalId, variantId]);
          
          // Delete remaining duplicate mappings
          await client.query(`
            DELETE FROM bridge_exam_subject_topic
            WHERE subject_id = $2
          `, [universalId, variantId]);
          
          totalMigrated += count;
        }
      }
    }
    
    console.log(`\n  ✅ Total mappings migrated: ${totalMigrated}`);

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 3: Delete exam-specific subject entries
    console.log('3️⃣ Deleting Exam-Specific Subject Entries...\n');
    
    let totalDeleted = 0;
    
    for (const [subjectName, { variantIds }] of Object.entries(migrationMap)) {
      if (variantIds.length > 0) {
        const deleteResult = await client.query(`
          DELETE FROM dim_subjects
          WHERE id = ANY($1)
          RETURNING id, subject_code
        `, [variantIds]);
        
        console.log(`  ${subjectName}: Deleted ${deleteResult.rows.length} exam-specific variants`);
        for (const deleted of deleteResult.rows) {
          console.log(`    - ${deleted.subject_code} (ID: ${deleted.id})`);
        }
        
        totalDeleted += deleteResult.rows.length;
      }
    }
    
    console.log(`\n  ✅ Total subjects deleted: ${totalDeleted}`);

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 4: Verify results
    console.log('4️⃣ Verification...\n');
    
    const verifyDuplicates = await client.query(`
      SELECT subject_name, COUNT(*) as count
      FROM dim_subjects
      WHERE subject_name IN ('Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi')
      GROUP BY subject_name
      HAVING COUNT(*) > 1
    `);
    
    if (verifyDuplicates.rows.length === 0) {
      console.log('  ✅ No duplicate subject names found - Migration successful!');
    } else {
      console.log('  ⚠️ Still have duplicates:');
      for (const row of verifyDuplicates.rows) {
        console.log(`    - ${row.subject_name}: ${row.count} variants`);
      }
    }

    // Verify JEE Main now uses universal subjects
    const jeeSubjects = await client.query(`
      SELECT DISTINCT
        s.subject_name,
        s.subject_code,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_subjects s ON b.subject_id = s.id
      WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = 'jee-main')
      GROUP BY s.id, s.subject_name, s.subject_code
      ORDER BY s.subject_name
    `);

    console.log('\n  JEE Main now uses:');
    for (const row of jeeSubjects.rows) {
      const isUniversal = !row.subject_code.includes('-');
      const marker = isUniversal ? '✅' : '⚠️';
      console.log(`    ${marker} ${row.subject_name} (${row.subject_code}): ${row.topic_count} topics`);
    }

    await client.query('COMMIT');
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🎉 Migration completed successfully!\n');
    console.log('Result: All exams now use universal subjects (physics, chemistry, mathematics, etc.)');
    console.log('Topic differentiation happens via bridge_exam_subject_topic table.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateToUniversalSubjects();
