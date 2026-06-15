#!/usr/bin/env tsx
import './load-env';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  console.log('\n📊 Checking all sections...\n');
  console.log('='.repeat(60));

  const result = await pool.query(
    `SELECT topic_id, title, content
     FROM topic_study_content
     WHERE topic_id = 'parts-of-speech'
     LIMIT 1`
  );

  const row = result.rows[0];
  const contentObj = row.content;

  console.log(`\n📄 ${row.topic_id}`);
  console.log(`   Title: ${row.title}`);
  console.log(`   Number of sections: ${contentObj.sections?.length || 0}\n`);

  if (contentObj.sections) {
    contentObj.sections.forEach((section: any, idx: number) => {
      const contentPreview = section.content?.substring(0, 100).replace(/\n/g, ' ') || '';
      console.log(`   ${idx + 1}. "${section.title}"`);
      console.log(`      Preview: ${contentPreview}...`);
      console.log(`      Length: ${section.content?.length || 0} chars\n`);
    });
  }

  console.log('='.repeat(60));

  await pool.end();
}

test();
