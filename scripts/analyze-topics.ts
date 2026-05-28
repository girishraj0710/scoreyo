#!/usr/bin/env tsx
/**
 * Analyze topics in database to guide targeted scraping
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@libsql/client';

// Load environment variables
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.error('⚠️  Could not load .env.local file');
}

async function analyzeTopics() {
  console.log('📊 Analyzing topics in your database...\n');

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Get all topics with question counts
  const topics = await db.execute(`
    SELECT
      dt.topic_name,
      dt.category,
      COUNT(fq.id) as question_count
    FROM dim_topics dt
    LEFT JOIN fact_exam_questions fq ON dt.id = fq.topic_id
    GROUP BY dt.id, dt.topic_name, dt.category
    ORDER BY question_count ASC, dt.topic_name
  `);

  console.log(`Total topics in database: ${topics.rows.length}\n`);

  // Categorize by question count
  const needsQuestions = topics.rows.filter(t => Number(t.question_count) < 10);
  const lowQuestions = topics.rows.filter(t => Number(t.question_count) >= 10 && Number(t.question_count) < 50);
  const goodCoverage = topics.rows.filter(t => Number(t.question_count) >= 50);

  console.log('📊 Coverage Analysis:');
  console.log(`  ⚠️  Needs questions (< 10): ${needsQuestions.length} topics`);
  console.log(`  📝 Low questions (10-49): ${lowQuestions.length} topics`);
  console.log(`  ✅ Good coverage (50+): ${goodCoverage.length} topics\n`);

  // Show topics that need questions most
  console.log('⚠️  Top 20 Topics Needing Questions:\n');
  needsQuestions.slice(0, 20).forEach((topic, i) => {
    const topicName = topic.topic_name?.toString() || 'Unknown Topic';
    const category = topic.category || 'General';
    console.log(`${(i + 1).toString().padStart(2, ' ')}. ${topicName.padEnd(50, ' ')} [${category}] (${topic.question_count} Qs)`);
  });

  // Identify NCERT-relevant topics
  const ncertTopics = topics.rows.filter(t => {
    const name = t.topic_name?.toString().toLowerCase() || '';
    return name.includes('physics') || name.includes('chemistry') ||
           name.includes('biology') || name.includes('mathematics') ||
           name.includes('algebra') || name.includes('calculus') ||
           name.includes('mechanics') || name.includes('organic') ||
           name.includes('thermodynamics') || name.includes('genetics');
  });

  console.log(`\n🎓 NCERT-Relevant Topics: ${ncertTopics.length}`);
  console.log('   (Topics likely covered in NCERT textbooks)\n');

  // Show low-coverage NCERT topics
  const lowNCERT = ncertTopics.filter(t => Number(t.question_count) < 50);
  console.log('📚 NCERT Topics with Low Coverage (< 50 questions):\n');
  lowNCERT.slice(0, 20).forEach((topic, i) => {
    const topicName = topic.topic_name?.toString() || 'Unknown Topic';
    console.log(`${(i + 1).toString().padStart(2, ' ')}. ${topicName.padEnd(50, ' ')} (${topic.question_count} Qs)`);
  });

  // Save to file for scraper to use
  const targetTopics = lowNCERT.slice(0, 100).map(t => ({
    name: t.topic_name || 'Unknown',
    category: t.category || 'General',
    currentCount: t.question_count || 0,
  }));

  require('fs').writeFileSync(
    resolve(process.cwd(), 'target-topics.json'),
    JSON.stringify(targetTopics, null, 2)
  );

  console.log(`\n✅ Saved top 100 target topics to target-topics.json`);
  console.log('   Use this to guide targeted scraping!\n');
}

analyzeTopics();
