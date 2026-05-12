#!/usr/bin/env node
/**
 * Test IELTS & TOEFL Topic Availability
 * Verifies all IELTS/TOEFL topics have questions mapped
 * Date: May 12, 2026
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Topic mappings from API
const topicMapping: Record<string, string> = {
  'ielts-reading': 'reading-comprehension',
  'ielts-writing': 'writing-skills',
  'ielts-listening': 'reading-comprehension',
  'ielts-speaking': 'idioms',
  'toefl-integrated': 'reading-comprehension',
  'academic-vocabulary': 'academic-vocabulary',
};

const topicNames: Record<string, string> = {
  'ielts-reading': 'IELTS Reading',
  'ielts-writing': 'IELTS Writing',
  'ielts-listening': 'IELTS Listening',
  'ielts-speaking': 'IELTS Speaking',
  'toefl-integrated': 'TOEFL Integrated Tasks',
  'academic-vocabulary': 'Academic Vocabulary',
};

async function testTopics() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║         IELTS & TOEFL Topic Availability Test               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  let allPassed = true;

  for (const [frontendTopic, dbTopic] of Object.entries(topicMapping)) {
    const name = topicNames[frontendTopic];

    // Check questions in all paths
    const result = await client.execute(
      'SELECT path_id, level, COUNT(*) as count FROM english_questions WHERE topic_id = ? GROUP BY path_id, level',
      [dbTopic]
    );

    const totalCount = result.rows.reduce((sum, row) => sum + (row.count as number), 0);

    if (totalCount > 0) {
      console.log(`✅ ${name}`);
      console.log(`   Topic: ${frontendTopic} → ${dbTopic}`);
      console.log(`   Total: ${totalCount} questions`);

      // Show distribution
      const pathCounts = new Map<string, number>();
      for (const row of result.rows) {
        const pathCount = pathCounts.get(row.path_id as string) || 0;
        pathCounts.set(row.path_id as string, pathCount + (row.count as number));
      }

      for (const [pathId, count] of pathCounts.entries()) {
        console.log(`   - ${pathId}: ${count} questions`);
      }
      console.log('');
    } else {
      console.log(`❌ ${name}`);
      console.log(`   Topic: ${frontendTopic} → ${dbTopic}`);
      console.log(`   ERROR: No questions found!\n`);
      allPassed = false;
    }
  }

  console.log('─'.repeat(64));

  if (allPassed) {
    console.log('✅ All IELTS/TOEFL topics have questions available!');
  } else {
    console.log('❌ Some topics are missing questions. Please check the mappings.');
  }

  console.log('\n');
  await client.close();

  return allPassed;
}

testTopics().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
