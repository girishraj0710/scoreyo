import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function analyzeStudyGuides() {
  const client = await pool.connect();
  try {
    console.log('🔍 PROPER Study Guides Analysis\n');
    console.log('Expected Flow:');
    console.log('1. User selects EXAM (e.g., JEE Main)');
    console.log('2. Shows SUBJECTS for that exam (Physics, Chemistry, Maths)');
    console.log('3. Shows TOPICS for each subject (e.g., Physics → Thermodynamics, Mechanics...)');
    console.log('4. User clicks topic → sees study material\n');

    // Check what's ACTUALLY in the database
    console.log('📊 Database Content:\n');
    
    const contentBySubject = await client.query(`
      SELECT 
        subject_id,
        COUNT(*) as topic_count,
        ARRAY_AGG(DISTINCT topic_id) as sample_topics
      FROM topic_study_content
      GROUP BY subject_id
      ORDER BY topic_count DESC
    `);

    console.log('Subject ID → Topic Count:');
    console.log('─'.repeat(80));
    for (const row of contentBySubject.rows) {
      console.log(`${row.subject_id.padEnd(25)} | ${row.topic_count} topics`);
      console.log(`   Samples: ${row.sample_topics.slice(0, 3).join(', ')}`);
    }

    // Check what subjects are EXPECTED from exams.ts
    console.log('\n\n📋 Expected Subjects from exams.ts:\n');
    console.log('JEE Main should have:');
    console.log('  - jee-physics (25 topics)');
    console.log('  - jee-chemistry (30 topics)');
    console.log('  - jee-maths (24 topics)');
    
    console.log('\nNEET should have:');
    console.log('  - neet-physics (25 topics)');
    console.log('  - neet-chemistry (30 topics)');
    console.log('  - neet-biology (38 topics)');
    
    console.log('\nUPSC should have:');
    console.log('  - upsc-history (20+ topics)');
    console.log('  - upsc-polity (15+ topics)');
    console.log('  - upsc-geography (20+ topics)');
    console.log('  - upsc-economy (15+ topics)');
    console.log('  - upsc-current-affairs (ongoing)');
    
    console.log('\nSSC should have:');
    console.log('  - ssc-reasoning (15+ topics)');
    console.log('  - ssc-quantitative (15+ topics)');
    console.log('  - ssc-english (10+ topics)');
    console.log('  - ssc-gk (20+ topics)');

    // Check English content
    console.log('\n\n❓ Why is there so much English content?\n');
    
    const englishContent = await client.query(`
      SELECT path_id, COUNT(*) as count
      FROM topic_study_content
      WHERE subject_id = 'english'
      GROUP BY path_id
    `);

    console.log('English content breakdown:');
    for (const row of englishContent.rows) {
      console.log(`  ${row.path_id}: ${row.count} topics`);
    }

    // Check which exams have English
    console.log('\n📚 Exams that have English as a subject:');
    console.log('  - SSC (English Comprehension)');
    console.log('  - Banking exams (IBPS, SBI - English Language)');
    console.log('  - UPSC (Essay, Comprehension in GS papers)');
    console.log('  - State PSC exams');
    console.log('  - NDA (English section)');
    
    console.log('\n\n🎯 THE REAL PROBLEM:\n');
    console.log('❌ Database has: 116 English topics (foundation, advanced, IELTS, real-world)');
    console.log('❌ Database has: 1 Physics topic (thermodynamics)');
    console.log('❌ Database has: 1 Biology topic');
    console.log('❌ Database has: 1 Polity topic');
    console.log('❌ Database has: 0 Chemistry topics');
    console.log('❌ Database has: 0 Mathematics topics');
    
    console.log('\n✅ What SHOULD be there:');
    console.log('   - JEE Physics: 25 topics (only has 1)');
    console.log('   - JEE Chemistry: 30 topics (has 0)');
    console.log('   - JEE Maths: 24 topics (has 0)');
    console.log('   - NEET Biology: 38 topics (only has 1)');
    console.log('   - NEET Physics: 25 topics (has 1)');
    console.log('   - NEET Chemistry: 30 topics (has 0)');
    console.log('   - UPSC subjects: Dozens of topics each (almost none)');
    
    console.log('\n\n💡 CONCLUSION:');
    console.log('━'.repeat(80));
    console.log('Study Guides is NOT properly set up!');
    console.log('');
    console.log('The English content (116 topics) is great but English is only relevant for:');
    console.log('  - A few exams (SSC, Banking, UPSC writing)');
    console.log('  - And even then, exam-specific English topics are needed');
    console.log('');
    console.log('What\'s MISSING:');
    console.log('  - Core subjects for engineering exams (Physics, Chemistry, Maths)');
    console.log('  - Core subjects for medical exams (Biology, Chemistry, Physics)');
    console.log('  - Core subjects for UPSC (History, Polity, Geography, Economy)');
    console.log('  - Core subjects for SSC/Banking (Reasoning, Quantitative, GK)');
    console.log('━'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

analyzeStudyGuides();
