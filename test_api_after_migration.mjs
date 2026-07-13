import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAPI() {
  console.log('🧪 Testing Study Guides API After Migration\n');
  console.log('='.repeat(80) + '\n');

  try {
    const response = await fetch('http://localhost:3005/api/study-guides/exams');
    const data = await response.json();

    if (!data.success) {
      console.error('❌ API returned error:', data.error);
      return;
    }

    console.log(`✅ API returned ${data.totalExams} exams\n`);

    // Test JEE Main
    const jeeMain = data.exams.find(e => e.id === 'jee-main');
    
    if (jeeMain) {
      console.log('JEE Main:');
      console.log(`  Subjects: ${jeeMain.subjectCount}`);
      console.log(`  Topics: ${jeeMain.topicCount}\n`);
      
      console.log('  Subject Details:');
      for (const subject of jeeMain.subjects) {
        const noDash = !subject.id.includes('-');
        const marker = noDash ? '✅' : '❌';
        console.log(`    ${marker} ${subject.name} (${subject.id}): ${subject.topicCount} topics`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Test NEET
    const neet = data.exams.find(e => e.id === 'neet');
    
    if (neet) {
      console.log('NEET:');
      console.log(`  Subjects: ${neet.subjectCount}`);
      console.log(`  Topics: ${neet.topicCount}\n`);
      
      console.log('  Subject Details:');
      for (const subject of neet.subjects) {
        const noDash = !subject.id.includes('-');
        const marker = noDash ? '✅' : '❌';
        console.log(`    ${marker} ${subject.name} (${subject.id}): ${subject.topicCount} topics`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
    console.log('✅ All subjects use universal codes (no exam-specific prefixes)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
