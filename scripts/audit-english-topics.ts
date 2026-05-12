#!/usr/bin/env node
/**
 * Audit English Topics - Compare frontend topics vs database questions
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Extract all topics from curriculum file
function extractTopicsFromCurriculum(): string[] {
  const curriculumPath = path.join(__dirname, '..', 'src', 'lib', 'english-curriculum-complete.ts');
  const content = fs.readFileSync(curriculumPath, 'utf8');

  const topics: string[] = [];
  const regex = /id:\s*["']([^"']+)["']/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    // Filter out module IDs, only keep topic IDs
    if (!id.startsWith('module-') && !['foundation', 'competitive-exam', 'ielts-toefl', 'real-world'].includes(id)) {
      topics.push(id);
    }
  }

  return [...new Set(topics)]; // Remove duplicates
}

(async () => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║        English Topics Audit - Frontend vs Database          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Get all topics from frontend curriculum
  const frontendTopics = extractTopicsFromCurriculum();
  console.log(`📋 Frontend Topics: ${frontendTopics.length} topics found\n`);

  // Get all topics from database
  const dbResult = await client.execute(
    "SELECT DISTINCT topic_id, COUNT(*) as count FROM english_questions WHERE path_id = 'foundation' GROUP BY topic_id ORDER BY topic_id"
  );

  const dbTopics = new Map<string, number>();
  dbResult.rows.forEach(row => {
    dbTopics.set(row.topic_id as string, row.count as number);
  });

  console.log(`💾 Database Topics: ${dbTopics.size} topics with questions\n`);

  // Find missing topics (in frontend but not in database)
  const missingTopics: string[] = [];
  const availableTopics: Array<{topic: string, count: number}> = [];

  frontendTopics.forEach(topic => {
    if (dbTopics.has(topic)) {
      availableTopics.push({ topic, count: dbTopics.get(topic)! });
    } else {
      missingTopics.push(topic);
    }
  });

  // Print available topics
  console.log('✅ AVAILABLE TOPICS (Questions in Database):');
  console.log('═══════════════════════════════════════════════════════════════\n');
  availableTopics.forEach(({ topic, count }) => {
    console.log(`  ✓ ${topic.padEnd(40)} ${count}Q`);
  });

  console.log('\n');
  console.log('❌ MISSING TOPICS (No Questions in Database):');
  console.log('═══════════════════════════════════════════════════════════════\n');
  missingTopics.forEach(topic => {
    console.log(`  ✗ ${topic}`);
  });

  console.log('\n');
  console.log('📊 SUMMARY:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Frontend Topics:    ${frontendTopics.length}`);
  console.log(`  Database Topics:    ${dbTopics.size}`);
  console.log(`  Available Topics:   ${availableTopics.length} (${Math.round(availableTopics.length/frontendTopics.length*100)}%)`);
  console.log(`  Missing Topics:     ${missingTopics.length} (${Math.round(missingTopics.length/frontendTopics.length*100)}%)`);
  console.log(`  Total Questions:    ${Array.from(dbTopics.values()).reduce((a,b) => a+b, 0)}Q`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Extra topics in database (not in frontend)
  const extraDbTopics: string[] = [];
  dbTopics.forEach((count, topic) => {
    if (!frontendTopics.includes(topic)) {
      extraDbTopics.push(topic);
    }
  });

  if (extraDbTopics.length > 0) {
    console.log('⚠️  EXTRA DATABASE TOPICS (Not in Frontend):');
    console.log('═══════════════════════════════════════════════════════════════\n');
    extraDbTopics.forEach(topic => {
      console.log(`  ! ${topic.padEnd(40)} ${dbTopics.get(topic)}Q`);
    });
    console.log('\n');
  }

  // Suggest topic mappings
  console.log('💡 SUGGESTED TOPIC MAPPINGS:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const suggestions: Record<string, string> = {};

  missingTopics.forEach(missing => {
    // Try to find similar database topics
    const normalized = missing.toLowerCase();

    dbTopics.forEach((count, dbTopic) => {
      const dbNormalized = dbTopic.toLowerCase();

      // Check for partial matches
      if (normalized.includes('writing') && dbNormalized.includes('writing')) {
        suggestions[missing] = dbTopic;
      } else if (normalized.includes('tense') && dbNormalized.includes('tense')) {
        suggestions[missing] = dbTopic;
      } else if (normalized.includes('verb') && dbNormalized.includes('verb')) {
        suggestions[missing] = dbTopic;
      } else if (normalized.includes('noun') && dbNormalized.includes('noun')) {
        suggestions[missing] = dbTopic;
      } else if (normalized.includes(dbNormalized) || dbNormalized.includes(normalized)) {
        suggestions[missing] = dbTopic;
      }
    });
  });

  if (Object.keys(suggestions).length > 0) {
    console.log('  Consider mapping these frontend topics to database topics:\n');
    Object.entries(suggestions).forEach(([frontend, database]) => {
      console.log(`  "${frontend}" → "${database}" (${dbTopics.get(database)}Q)`);
    });
  } else {
    console.log('  No obvious mappings found. May need to create new questions.');
  }

  console.log('\n');
})();
