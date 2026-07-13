import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function preMigrationCheck() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Pre-Migration Dependency Check\n');
    console.log('='.repeat(80) + '\n');

    // 1. Find all tables with foreign keys to dim_subjects
    console.log('1️⃣ Checking Foreign Key Dependencies:\n');
    
    const fkCheck = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'dim_subjects'
      ORDER BY tc.table_name
    `);

    if (fkCheck.rows.length === 0) {
      console.log('  ℹ️  No foreign key constraints found to dim_subjects');
    } else {
      console.log('  ⚠️  Found foreign key references:\n');
      for (const row of fkCheck.rows) {
        console.log(`    ${row.table_name}.${row.column_name} → dim_subjects.${row.foreign_column_name}`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 2. Check topic_study_content table
    console.log('2️⃣ Checking topic_study_content Table:\n');
    
    const contentSchema = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'topic_study_content'
      ORDER BY ordinal_position
    `);

    if (contentSchema.rows.length === 0) {
      console.log('  ℹ️  topic_study_content table not found');
    } else {
      console.log('  Schema:');
      for (const col of contentSchema.rows) {
        console.log(`    - ${col.column_name} (${col.data_type})`);
      }
      
      // Check if it uses subject_id or subject_code
      const usesSubjectId = contentSchema.rows.some(col => col.column_name === 'subject_id');
      const usesSubjectCode = contentSchema.rows.some(col => col.column_name === 'subject_code');
      
      if (usesSubjectId) {
        console.log('\n  ⚠️  Uses subject_id - needs migration!');
        
        // Check for exam-specific subjects
        const examSpecificContent = await client.query(`
          SELECT 
            s.subject_code,
            s.subject_name,
            COUNT(*) as content_count
          FROM topic_study_content tsc
          JOIN dim_subjects s ON tsc.subject_id::text = s.id::text
          WHERE s.subject_code LIKE '%-%'
          GROUP BY s.subject_code, s.subject_name
          ORDER BY content_count DESC
        `);
        
        if (examSpecificContent.rows.length > 0) {
          console.log('\n  📝 Content using exam-specific subjects:');
          for (const row of examSpecificContent.rows) {
            console.log(`    - ${row.subject_code}: ${row.content_count} topics`);
          }
        } else {
          console.log('\n  ✅ No content uses exam-specific subjects');
        }
      }
      
      if (usesSubjectCode) {
        console.log('\n  ✅ Uses subject_code (TEXT) - safer, but check for exam-specific codes');
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 3. Check quiz-related tables
    console.log('3️⃣ Checking Quiz-Related Tables:\n');
    
    const quizTables = ['quiz_results', 'quiz_sessions', 'cached_questions'];
    
    for (const tableName of quizTables) {
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [tableName]);
      
      if (tableExists.rows[0].exists) {
        const schema = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
          AND column_name LIKE '%subject%'
        `, [tableName]);
        
        if (schema.rows.length > 0) {
          console.log(`  ${tableName}:`);
          for (const col of schema.rows) {
            console.log(`    - ${col.column_name} (${col.data_type})`);
          }
        }
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 4. List exam-specific subjects to be deleted
    console.log('4️⃣ Exam-Specific Subjects to be Deleted:\n');
    
    const toDelete = await client.query(`
      SELECT 
        id,
        subject_code,
        subject_name,
        (SELECT COUNT(*) FROM bridge_exam_subject_topic WHERE subject_id = dim_subjects.id) as bridge_count
      FROM dim_subjects
      WHERE subject_code LIKE '%-%'
        AND subject_name IN ('Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi')
      ORDER BY subject_name, subject_code
    `);

    console.log(`  Total to delete: ${toDelete.rows.length}\n`);
    
    const grouped = {};
    for (const row of toDelete.rows) {
      if (!grouped[row.subject_name]) {
        grouped[row.subject_name] = [];
      }
      grouped[row.subject_name].push(row);
    }
    
    for (const [name, subjects] of Object.entries(grouped)) {
      console.log(`  ${name} (${subjects.length} variants):`);
      for (const s of subjects) {
        console.log(`    - ${s.subject_code} (ID: ${s.id}, Bridge refs: ${s.bridge_count})`);
      }
      console.log('');
    }

    console.log('='.repeat(80) + '\n');

    // 5. Create backup directory
    console.log('5️⃣ Creating Backup:\n');
    
    const backupDir = './.backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `${backupDir}/pre-migration-backup-${timestamp}.sql`;
    
    console.log(`  Backup location: ${backupFile}\n`);
    
    // Export dim_subjects
    const subjects = await client.query('SELECT * FROM dim_subjects ORDER BY id');
    let backup = `-- Backup created: ${new Date().toISOString()}\n\n`;
    backup += `-- dim_subjects (${subjects.rows.length} rows)\n`;
    backup += `-- Exam-specific subjects to be deleted: ${toDelete.rows.length}\n\n`;
    
    for (const row of subjects.rows) {
      const values = [
        row.id,
        `'${row.subject_code.replace(/'/g, "''")}'`,
        `'${row.subject_name.replace(/'/g, "''")}'`,
        row.category ? `'${row.category}'` : 'NULL',
        row.description ? `'${row.description.replace(/'/g, "''")}'` : 'NULL'
      ].join(', ');
      backup += `INSERT INTO dim_subjects (id, subject_code, subject_name, category, description) VALUES (${values});\n`;
    }
    
    // Export bridge_exam_subject_topic
    const bridge = await client.query(`
      SELECT * FROM bridge_exam_subject_topic 
      WHERE subject_id IN (
        SELECT id FROM dim_subjects WHERE subject_code LIKE '%-%'
      )
      ORDER BY exam_id, subject_id, topic_id
    `);
    backup += `\n\n-- bridge_exam_subject_topic (${bridge.rows.length} rows using exam-specific subjects)\n\n`;
    
    for (const row of bridge.rows) {
      const values = [
        row.exam_id,
        row.subject_id,
        row.topic_id,
        row.is_mandatory,
        row.weightage || 'NULL',
        row.difficulty_level ? `'${row.difficulty_level}'` : 'NULL'
      ].join(', ');
      backup += `INSERT INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage, difficulty_level) VALUES (${values});\n`;
    }
    
    fs.writeFileSync(backupFile, backup);
    console.log(`  ✅ Backup saved: ${backupFile}`);
    console.log(`  📊 Backed up ${subjects.rows.length} subjects, ${bridge.rows.length} bridge mappings`);

    console.log('\n' + '='.repeat(80) + '\n');

    // 6. Summary
    console.log('6️⃣ Migration Summary:\n');
    console.log(`  Subjects to delete: ${toDelete.rows.length}`);
    console.log(`  Bridge mappings to migrate: ${toDelete.rows.reduce((sum, s) => sum + parseInt(s.bridge_count), 0)}`);
    console.log(`  Backup created: ✅`);
    console.log(`  Safe to proceed: ${fkCheck.rows.length === 0 ? '✅ YES' : '⚠️  CHECK FOREIGN KEYS'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

preMigrationCheck();
