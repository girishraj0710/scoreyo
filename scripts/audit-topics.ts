#!/usr/bin/env tsx
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";
import { examCategories } from "../src/lib/exams";

const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function auditTopics() {
  console.log("🔍 TOPIC AUDIT - Analyzing current state...\n");
  
  // Get all exam-subject-topic mappings from the app config
  const expectedTopics = new Map<string, Set<string>>();
  
  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        const key = `${exam.id}|${subject.id}`;
        if (!expectedTopics.has(key)) {
          expectedTopics.set(key, new Set());
        }
        for (const topic of subject.topics) {
          expectedTopics.get(key)!.add(topic);
        }
      }
    }
  }
  
  console.log(`📚 Expected from exams.ts:`);
  console.log(`   Total exam-subject combinations: ${expectedTopics.size}`);
  let totalExpectedTopics = 0;
  expectedTopics.forEach(topics => totalExpectedTopics += topics.size);
  console.log(`   Total topics defined: ${totalExpectedTopics}\n`);
  
  // Get all normalized topics from database
  const normalizedTopics = await db.execute(`
    SELECT id, topic_name, scope, category
    FROM dim_topics
    ORDER BY topic_name
  `);
  
  console.log(`🗂️  Normalized topics in database:`);
  console.log(`   Total: ${normalizedTopics.rows.length}`);
  
  const byScope: Record<string, number> = {};
  for (const row of normalizedTopics.rows) {
    const scope = String(row.scope);
    byScope[scope] = (byScope[scope] || 0) + 1;
  }
  
  console.log(`   By scope:`, byScope);
  console.log();
  
  // Get all bridge mappings
  const bridgeMappings = await db.execute(`
    SELECT 
      e.exam_code,
      s.subject_code,
      t.topic_name,
      b.is_mandatory
    FROM bridge_exam_subject_topic b
    JOIN dim_exams e ON b.exam_id = e.id
    JOIN dim_subjects s ON b.subject_id = s.id
    JOIN dim_topics t ON b.topic_id = t.id
    ORDER BY e.exam_code, s.subject_code, t.topic_name
  `);
  
  console.log(`🔗 Bridge mappings:`);
  console.log(`   Total: ${bridgeMappings.rows.length}\n`);
  
  // Analyze mismatches
  console.log(`⚠️  ISSUES FOUND:\n`);
  
  // Sample 5 exams to show detailed analysis
  const sampleExams = ['jee-main', 'neet-ug', 'upsc-cse', 'ssc-cgl', 'cat'];
  
  for (const examId of sampleExams) {
    const examConfig = examCategories
      .flatMap(c => c.exams)
      .find(e => e.id === examId);
    
    if (!examConfig) continue;
    
    console.log(`📖 ${examConfig.name}:`);
    
    for (const subject of examConfig.subjects) {
      const expectedTopicList = subject.topics;
      
      // Get actual topics from bridge
      const actualTopicsQuery = await db.execute({
        sql: `
          SELECT DISTINCT t.topic_name
          FROM bridge_exam_subject_topic b
          JOIN dim_exams e ON b.exam_id = e.id
          JOIN dim_subjects s ON b.subject_id = s.id
          JOIN dim_topics t ON b.topic_id = t.id
          WHERE e.exam_code = ? AND s.subject_code = ?
        `,
        args: [examId, subject.id]
      });
      
      const actualTopics = actualTopicsQuery.rows.map(r => String(r.topic_name));
      
      // Find issues
      const missing = expectedTopicList.filter(t => !actualTopics.includes(t));
      const extra = actualTopics.filter(t => !expectedTopicList.includes(t));
      
      if (missing.length > 0 || extra.length > 0) {
        console.log(`  ${subject.name}:`);
        if (missing.length > 0) {
          console.log(`    ❌ Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ''}`);
        }
        if (extra.length > 0) {
          console.log(`    ⚠️  Extra: ${extra.slice(0, 3).join(', ')}${extra.length > 3 ? ` (+${extra.length - 3} more)` : ''}`);
        }
      }
    }
    console.log();
  }
  
  console.log(`\n✅ Audit complete. Ready to clean up?`);
}

auditTopics().catch(console.error);
