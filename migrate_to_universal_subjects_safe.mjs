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
    console.log('🚀 Starting Safe Migration to Universal Subjects\n');
    console.log('='.repeat(80) + '\n');

    await client.query('BEGIN');

    // Step 1: Create subject mapping (exam-specific → universal)
    console.log('1️⃣ Creating Subject Mapping...\n');
    
    const subjectMapping = await client.query(`
      SELECT 
        subject_name,
        MIN(CASE WHEN subject_code NOT LIKE '%-%' THEN id END) as universal_id,
        array_agg(id) FILTER (WHERE subject_code LIKE '%-%') as exam_specific_ids
      FROM dim_subjects
      WHERE subject_name IN ('Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi')
      GROUP BY subject_name
    `);

    const mapping = {};
    let totalExamSpecific = 0;
    
    for (const row of subjectMapping.rows) {
      if (!row.universal_id) {
        console.log(`  ⚠️ No universal subject for: ${row.subject_name}`);
        console.log(`     Using first variant as universal`);
        mapping[row.subject_name] = {
          universalId: row.exam_specific_ids[0],
          examSpecificIds: row.exam_specific_ids.slice(1)
        };
      } else {
        mapping[row.subject_name] = {
          universalId: row.universal_id,
          examSpecificIds: row.exam_specific_ids || []
        };
      }
      
      totalExamSpecific += mapping[row.subject_name].examSpecificIds.length;
      console.log(`  ${row.subject_name}: Universal ID ${mapping[row.subject_name].universalId}, ${mapping[row.subject_name].examSpecificIds.length} exam-specific variants`);
    }
    
    console.log(`\n  Total exam-specific subjects to migrate: ${totalExamSpecific}`);

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 2: Migrate bridge_exam_subject_topic
    console.log('2️⃣ Migrating bridge_exam_subject_topic...\n');
    
    let bridgeMigrated = 0;
    
    for (const [subjectName, { universalId, examSpecificIds }] of Object.entries(mapping)) {
      if (examSpecificIds.length === 0) continue;
      
      console.log(`  ${subjectName}:`);
      
      for (const examSpecificId of examSpecificIds) {
        // Update mappings to universal subject (skip if duplicate exists)
        const result = await client.query(`
          WITH to_update AS (
            SELECT id FROM bridge_exam_subject_topic
            WHERE subject_id = $1
            AND NOT EXISTS (
              SELECT 1 FROM bridge_exam_subject_topic existing
              WHERE existing.exam_id = bridge_exam_subject_topic.exam_id
              AND existing.subject_id = $2
              AND existing.topic_id = bridge_exam_subject_topic.topic_id
            )
          )
          UPDATE bridge_exam_subject_topic
          SET subject_id = $2
          WHERE id IN (SELECT id FROM to_update)
          RETURNING id
        `, [examSpecificId, universalId]);
        
        if (result.rows.length > 0) {
          console.log(`    Migrated ${result.rows.length} mappings from ID ${examSpecificId} → ${universalId}`);
          bridgeMigrated += result.rows.length;
        }
        
        // Delete remaining duplicates
        const deleted = await client.query(`
          DELETE FROM bridge_exam_subject_topic
          WHERE subject_id = $1
          RETURNING id
        `, [examSpecificId]);
        
        if (deleted.rows.length > 0) {
          console.log(`    Deleted ${deleted.rows.length} duplicate mappings for ID ${examSpecificId}`);
        }
      }
    }
    
    console.log(`\n  ✅ Total bridge mappings migrated: ${bridgeMigrated}`);

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 3: Migrate outcome_paths table
    console.log('3️⃣ Migrating outcome_paths...\n');
    
    const outcomePathsExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'outcome_paths'
      )
    `);
    
    if (outcomePathsExists.rows[0].exists) {
      let outcomesMigrated = 0;
      
      for (const [subjectName, { universalId, examSpecificIds }] of Object.entries(mapping)) {
        if (examSpecificIds.length === 0) continue;
        
        for (const examSpecificId of examSpecificIds) {
          const result = await client.query(`
            UPDATE outcome_paths
            SET subject_id = $1
            WHERE subject_id = $2
            RETURNING id
          `, [universalId, examSpecificId]);
          
          if (result.rows.length > 0) {
            outcomesMigrated += result.rows.length;
          }
        }
      }
      
      console.log(`  ✅ Migrated ${outcomesMigrated} outcome_paths records`);
    } else {
      console.log(`  ℹ️  outcome_paths table not found`);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 4: Migrate question_generation_batches
    console.log('4️⃣ Migrating question_generation_batches...\n');
    
    const batchesExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'question_generation_batches'
      )
    `);
    
    if (batchesExists.rows[0].exists) {
      let batchesMigrated = 0;
      
      for (const [subjectName, { universalId, examSpecificIds }] of Object.entries(mapping)) {
        if (examSpecificIds.length === 0) continue;
        
        for (const examSpecificId of examSpecificIds) {
          const result = await client.query(`
            UPDATE question_generation_batches
            SET subject_id = $1
            WHERE subject_id = $2
            RETURNING id
          `, [universalId, examSpecificId]);
          
          if (result.rows.length > 0) {
            batchesMigrated += result.rows.length;
          }
        }
      }
      
      console.log(`  ✅ Migrated ${batchesMigrated} question_generation_batches records`);
    } else {
      console.log(`  ℹ️  question_generation_batches table not found`);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 5: Migrate study_materials
    console.log('5️⃣ Migrating study_materials...\n');
    
    const materialsExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'study_materials'
      )
    `);
    
    if (materialsExists.rows[0].exists) {
      let materialsMigrated = 0;
      
      for (const [subjectName, { universalId, examSpecificIds }] of Object.entries(mapping)) {
        if (examSpecificIds.length === 0) continue;
        
        for (const examSpecificId of examSpecificIds) {
          const result = await client.query(`
            UPDATE study_materials
            SET subject_id = $1
            WHERE subject_id = $2
            RETURNING id
          `, [universalId, examSpecificId]);
          
          if (result.rows.length > 0) {
            materialsMigrated += result.rows.length;
          }
        }
      }
      
      console.log(`  ✅ Migrated ${materialsMigrated} study_materials records`);
    } else {
      console.log(`  ℹ️  study_materials table not found`);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 6: Check for any remaining references
    console.log('6️⃣ Checking for Remaining References...\n');
    
    let canDelete = true;
    
    for (const [subjectName, { examSpecificIds }] of Object.entries(mapping)) {
      if (examSpecificIds.length === 0) continue;
      
      for (const examSpecificId of examSpecificIds) {
        const bridgeCheck = await client.query(`
          SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE subject_id = $1
        `, [examSpecificId]);
        
        if (parseInt(bridgeCheck.rows[0].count) > 0) {
          console.log(`  ⚠️ ${subjectName} (ID ${examSpecificId}) still has ${bridgeCheck.rows[0].count} bridge references`);
          canDelete = false;
        }
      }
    }
    
    if (canDelete) {
      console.log(`  ✅ All references migrated, safe to delete exam-specific subjects`);
    } else {
      throw new Error('Some exam-specific subjects still have references. Aborting.');
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 7: Delete exam-specific subjects
    console.log('7️⃣ Deleting Exam-Specific Subjects...\n');
    
    let totalDeleted = 0;
    
    for (const [subjectName, { examSpecificIds }] of Object.entries(mapping)) {
      if (examSpecificIds.length === 0) continue;
      
      const deleted = await client.query(`
        DELETE FROM dim_subjects
        WHERE id = ANY($1)
        RETURNING id, subject_code
      `, [examSpecificIds]);
      
      console.log(`  ${subjectName}: Deleted ${deleted.rows.length} exam-specific variants`);
      totalDeleted += deleted.rows.length;
    }
    
    console.log(`\n  ✅ Total subjects deleted: ${totalDeleted}`);

    console.log('\n' + '='.repeat(80) + '\n');

    // Step 8: Verify results
    console.log('8️⃣ Verification...\n');
    
    const duplicateCheck = await client.query(`
      SELECT subject_name, COUNT(*) as count
      FROM dim_subjects
      WHERE subject_name IN ('Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi')
      GROUP BY subject_name
      HAVING COUNT(*) > 1
    `);
    
    if (duplicateCheck.rows.length === 0) {
      console.log('  ✅ No duplicate subjects found!');
    } else {
      console.log('  ⚠️ Duplicates still exist:');
      for (const row of duplicateCheck.rows) {
        console.log(`    - ${row.subject_name}: ${row.count} variants`);
      }
    }

    // Check JEE Main
    const jeeCheck = await client.query(`
      SELECT 
        s.subject_name,
        s.subject_code,
        COUNT(DISTINCT b.topic_id) as topic_count
      FROM bridge_exam_subject_topic b
      JOIN dim_subjects s ON b.subject_id = s.id
      WHERE b.exam_id = (SELECT id FROM dim_exams WHERE exam_code = 'jee-main')
      GROUP BY s.id, s.subject_name, s.subject_code
      ORDER BY s.subject_name
    `);

    console.log('\n  JEE Main subjects after migration:');
    for (const row of jeeCheck.rows) {
      const marker = row.subject_code.includes('-') ? '⚠️' : '✅';
      console.log(`    ${marker} ${row.subject_name} (${row.subject_code}): ${row.topic_count} topics`);
    }

    await client.query('COMMIT');
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('🎉 Migration Completed Successfully!\n');
    console.log('Summary:');
    console.log(`  - Bridge mappings migrated: ${bridgeMigrated}`);
    console.log(`  - Subjects deleted: ${totalDeleted}`);
    console.log(`  - Result: All exams now use universal subjects`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration Failed - All changes rolled back\n');
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateToUniversalSubjects();
