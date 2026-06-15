import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkContent() {
  const result = await pool.query(
    `SELECT topic_id, title, content FROM topic_study_content WHERE topic_id = 'parts-of-speech'`
  );
  
  if (result.rows.length === 0) {
    console.log('❌ No data found for parts-of-speech');
    return;
  }
  
  const row = result.rows[0];
  console.log('✅ Found data for:', row.topic_id);
  console.log('📋 Title:', row.title);
  console.log('📦 Sections in content:', row.content.sections?.length || 0);
  console.log('\n📂 Section titles:');
  row.content.sections?.forEach((section: any, idx: number) => {
    console.log(`  ${idx + 1}. ${section.title}`);
  });
  
  // Check specifically for Practice Problems
  const practiceSection = row.content.sections?.find((s: any) => 
    s.title?.toLowerCase().includes('practice')
  );
  
  if (practiceSection) {
    console.log('\n✅ Practice Problems section found!');
    console.log('   Title:', practiceSection.title);
    console.log('   Content length:', practiceSection.content?.length || 0);
  } else {
    console.log('\n❌ Practice Problems section NOT found');
  }
  
  await pool.end();
}

checkContent().catch(console.error);
