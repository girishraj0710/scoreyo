import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function loadThermodynamics() {
  console.log('🔥 Loading Thermodynamics study material into database...\n');

  // Read the JSON file
  const filePath = path.join(process.cwd(), '.agents/artifacts/thermodynamics-study-material.json');

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    process.exit(1);
  }

  const jsonContent = fs.readFileSync(filePath, 'utf-8');
  const material = JSON.parse(jsonContent);

  console.log('📖 Material loaded:');
  console.log('   Title:', material.title);
  console.log('   Topic ID:', material.topic_id);
  console.log('   Sections:', material.content.sections.length);
  console.log('');

  // Check if already exists
  const checkResult = await pool.query(
    `SELECT id FROM topic_study_content WHERE topic_id = $1 AND subject_id = $2`,
    [material.topic_id, material.subject_id]
  );

  const exists = checkResult.rows.length > 0;

  if (exists) {
    console.log('⚠️  Material already exists. Updating...');
    await pool.query(
      `UPDATE topic_study_content SET
        title = $1,
        subtitle = $2,
        overview = $3,
        content = $4,
        difficulty_level = $5,
        estimated_time_minutes = $6,
        curriculum_standard = $7,
        textbook_references = $8,
        updated_at = NOW()
       WHERE topic_id = $9 AND subject_id = $10`,
      [
        material.title,
        material.subtitle || null,
        material.overview || null,
        JSON.stringify(material.content),
        material.difficulty_level || 'intermediate',
        material.estimated_time_minutes || 45,
        material.curriculum_standard || 'NCERT Class 11',
        material.textbook_references || [],
        material.topic_id,
        material.subject_id
      ]
    );
    console.log('✅ Updated successfully!');
  } else {
    console.log('📥 Inserting new material...');
    await pool.query(
      `INSERT INTO topic_study_content (
        subject_id,
        topic_id,
        path_id,
        title,
        subtitle,
        overview,
        content,
        difficulty_level,
        estimated_time_minutes,
        curriculum_standard,
        textbook_references
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        material.subject_id,
        material.topic_id,
        material.path_id || null,
        material.title,
        material.subtitle || null,
        material.overview || null,
        JSON.stringify(material.content),
        material.difficulty_level || 'intermediate',
        material.estimated_time_minutes || 45,
        material.curriculum_standard || 'NCERT Class 11',
        material.textbook_references || []
      ]
    );
    console.log('✅ Inserted successfully!');
  }

  await pool.end();
  console.log('\n🎉 Done!');
}

loadThermodynamics().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
