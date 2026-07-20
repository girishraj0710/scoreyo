async function testAPI() {
  const response = await fetch('https://scoreyo.in/api/study-content?subjectId=english&pathId=ielts-toefl&topicId=ielts-reading');
  const data = await response.json();
  
  if (data.studyMaterial) {
    const section1 = data.studyMaterial.content.sections[0];
    console.log('\n=== IELTS Reading - Section 1 ===');
    console.log('Title:', section1.title);
    console.log('Content blocks:', section1.content.length);
    
    section1.content.forEach((block, i) => {
      console.log(`\nBlock ${i + 1}:`);
      console.log('  Type:', block.type);
      console.log('  Keys:', Object.keys(block).join(', '));
      
      if (block.type === 'note') {
        console.log('  Note icon:', block.icon);
        console.log('  Note title:', block.title);
        console.log('  Note content:', block.content);
        console.log('  Note text:', block.text);
      }
    });
  }
}

testAPI();
