#!/usr/bin/env tsx
import './load-env';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  console.log('\n📊 Checking section content (where UI renders from)...\n');
  console.log('='.repeat(60));

  const result = await pool.query(
    `SELECT topic_id, title, content
     FROM topic_study_content
     WHERE topic_id = 'parts-of-speech'
     LIMIT 1`
  );

  const row = result.rows[0];
  const contentObj = row.content; // Already parsed by pg library

  console.log(`\n📄 ${row.topic_id}`);
  console.log(`   Title: ${row.title}`);
  console.log(`   Number of sections: ${contentObj.sections?.length || 0}`);

  if (contentObj.sections && contentObj.sections.length > 0) {
    const firstSection = contentObj.sections[0];
    console.log(`\n   First Section:`);
    console.log(`   - Title: "${firstSection.title}"`);
    console.log(`   - Content (first 200 chars): "${firstSection.content?.substring(0, 200)}..."`);

    // Check for emojis
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[📖📚🎯✅❌⚠️💡🔍📝🧪🎓📊⭐🏆🌟💪]/gu.test(firstSection.content || '');
    console.log(`   - Emoji check: ${hasEmojis ? '❌ HAS EMOJIS' : '✅ Clean'}`);
  }

  console.log('\n' + '='.repeat(60));

  await pool.end();
}

test();
