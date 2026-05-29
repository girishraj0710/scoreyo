// Thoroughly clean data and import fact_exam_questions
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function cleanIntegerValue(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return Math.floor(val);
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : Math.floor(parsed);
  }
  return null;
}

async function importQuestions() {
  console.log('🔧 Clearing existing questions...\n');

  const { error: deleteError } = await supabase
    .from('fact_exam_questions')
    .delete()
    .neq('id', 0);

  if (deleteError && !deleteError.message.includes('violates foreign key')) {
    console.warn('⚠️  Clear table warning:', deleteError.message);
  } else {
    console.log('✅ Table cleared\n');
  }

  console.log('📦 Loading fact_exam_questions data...\n');
  const data = JSON.parse(readFileSync('migration-data/fact_exam_questions.json', 'utf-8'));
  console.log(`Total questions: ${data.length.toLocaleString()}\n`);

  console.log('🔧 Cleaning data...');
  let fixedCount = 0;
  const integerColumns = ['id', 'topic_id', 'correct_answer', 'quality_score', 'used_count', 'valid_from', 'valid_until'];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Clean all integer columns
    for (const col of integerColumns) {
      const original = row[col];
      const cleaned = cleanIntegerValue(original);

      if (original !== cleaned) {
        if (i >= 21000 && i < 21010) {
          console.log(`  Row ${i}: ${col} = "${original}" → ${cleaned}`);
        }
        row[col] = cleaned;
        fixedCount++;
      }
    }
  }

  console.log(`✅ Fixed ${fixedCount} values\n`);

  // Save cleaned data for inspection
  console.log('💾 Saving cleaned data sample...');
  const sample = data.slice(21000, 21010);
  writeFileSync('migration-data/questions-sample-21000.json', JSON.stringify(sample, null, 2));
  console.log('✅ Saved to migration-data/questions-sample-21000.json\n');

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
        console.log('\nFirst 3 rows of failed batch:');
        batch.slice(0, 3).forEach((row, idx) => {
          console.log(`\nRow ${i + idx}:`, JSON.stringify(row, null, 2));
        });
        throw error;
      }

      imported += batch.length;

      if (i % 5000 === 0 || i + batch.length >= data.length) {
        const percent = Math.round((imported / data.length) * 100);
        console.log(`   Progress: ${imported.toLocaleString()}/${data.length.toLocaleString()} (${percent}%)`);
      }
    } catch (error) {
      console.error('\n💥 Import stopped at:', imported);
      throw error;
    }
  }

  console.log(`\n✅ Successfully imported ${imported.toLocaleString()} questions!`);
  console.log('\n🎉 Migration complete!');
}

importQuestions().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});
