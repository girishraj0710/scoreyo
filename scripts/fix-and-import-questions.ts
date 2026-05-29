// Fix decimal values in fact_exam_questions and import
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function importQuestions() {
  console.log('🔧 Clearing existing questions...\n');

  // Clear table first
  const { error: deleteError } = await supabase
    .from('fact_exam_questions')
    .delete()
    .neq('id', 0); // Delete all rows

  if (deleteError && !deleteError.message.includes('violates foreign key')) {
    console.warn('⚠️  Clear table warning:', deleteError.message);
  } else {
    console.log('✅ Table cleared\n');
  }

  console.log('📦 Loading fact_exam_questions data...\n');

  const data = JSON.parse(readFileSync('migration-data/fact_exam_questions.json', 'utf-8'));
  console.log(`Total questions: ${data.length.toLocaleString()}`);

  // Fix decimal values in integer columns
  console.log('\n🔧 Fixing data types...');
  let fixed = 0;
  for (const row of data) {
    if (typeof row.quality_score === 'string' || row.quality_score % 1 !== 0) {
      row.quality_score = Math.floor(parseFloat(row.quality_score) || 0);
      fixed++;
    }
    if (typeof row.used_count === 'string' || row.used_count % 1 !== 0) {
      row.used_count = Math.floor(parseFloat(row.used_count) || 0);
      fixed++;
    }
    if (typeof row.id === 'string') {
      row.id = parseInt(row.id);
    }
    if (typeof row.topic_id === 'string') {
      row.topic_id = parseInt(row.topic_id);
    }
  }
  console.log(`✅ Fixed ${fixed} decimal values\n`);

  // Import in batches
  console.log('📦 Importing to Supabase...\n');
  const BATCH_SIZE = 500;
  let imported = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    try {
      const { error } = await supabase
        .from('fact_exam_questions')
        .insert(batch);

      if (error) {
        console.error(`\n❌ Batch ${i}-${i + batch.length} failed:`, error.message);
        console.log('Sample row:', JSON.stringify(batch[0], null, 2));
        throw error;
      }

      imported += batch.length;

      // Progress indicator
      if (i % 5000 === 0 || i + batch.length >= data.length) {
        const percent = Math.round((imported / data.length) * 100);
        console.log(`   Progress: ${imported.toLocaleString()}/${data.length.toLocaleString()} (${percent}%)`);
      }
    } catch (error) {
      console.error('\nImport stopped at:', imported);
      throw error;
    }
  }

  console.log(`\n✅ Successfully imported ${imported.toLocaleString()} questions!`);
}

importQuestions().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});
