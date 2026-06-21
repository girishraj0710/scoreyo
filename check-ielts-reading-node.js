const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkContent() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT content 
      FROM topic_study_content 
      WHERE subject_id = 'english' 
        AND path_id = 'ielts-toefl' 
        AND topic_id = 'ielts-reading'
    `);
    
    const content = result.rows[0].content;
    const section1 = content.sections[0];
    
    console.log('\n' + '='.repeat(80));
    console.log('IELTS Reading - Section 1 Analysis');
    console.log('='.repeat(80));
    console.log(`\nSection Title: ${section1.title}`);
    console.log(`Total blocks: ${section1.content.length}\n`);
    
    section1.content.forEach((block, i) => {
      console.log(`\nBlock ${i + 1}:`);
      console.log(`  Type: ${block.type}`);
      
      if (block.type === 'paragraph') {
        console.log(`  Text length: ${block.text?.length || 0} chars`);
        if (block.text) {
          console.log(`  Preview: ${block.text.substring(0, 150)}...`);
        }
      } else if (block.type === 'note') {
        console.log(`  Icon: ${block.icon || 'NONE'}`);
        console.log(`  Title: ${block.title || 'NONE'}`);
        console.log(`  Content: ${block.content || 'EMPTY'}`);
      } else if (block.type === 'table') {
        console.log(`  Headers: ${JSON.stringify(block.headers)}`);
        console.log(`  Rows: ${block.rows?.length || 0}`);
      }
    });
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkContent().catch(console.error);
