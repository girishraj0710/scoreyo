#!/usr/bin/env tsx
import './load-env';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  console.log('\n📊 Checking cleaned content in database...\n');
  console.log('='.repeat(60));

  const result = await pool.query(
    `SELECT topic_id, title,
     LEFT(overview, 150) as overview_sample,
     CASE
       WHEN overview ~ '[📖📚🎯✅❌⚠️💡🔍📝🧪🎓📊⭐🏆🌟💪]' THEN 'HAS EMOJIS ❌'
       ELSE 'Clean ✅'
     END as emoji_check
     FROM topic_study_content
     WHERE topic_id IN ('parts-of-speech', 'present-simple', 'articles')
     ORDER BY topic_id`
  );

  for (const row of result.rows) {
    console.log(`\n📄 ${row.topic_id}`);
    console.log(`   Title: ${row.title}`);
    console.log(`   Status: ${row.emoji_check}`);
    console.log(`   Overview: "${row.overview_sample}..."`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Checked ${result.rows.length} materials\n`);

  await pool.end();
}

test();
