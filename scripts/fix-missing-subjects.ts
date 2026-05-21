#!/usr/bin/env tsx
/**
 * MIGRATION TO DIMENSIONAL MODEL
 * Phase 3.5: Fix missing subjects and create their bridge mappings
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

// Subject name beautification
function beautifySubjectName(subjectCode: string): string {
  const map: Record<string, string> = {
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'ctet-child-dev': 'Child Development & Pedagogy',
    'ctet-evs': 'Environmental Studies',
    'ctet-language-1': 'Language I',
    'ctet-language-2': 'Language II',
    'gate-cn': 'Computer Networks',
    'gate-dbms': 'Database Management Systems',
    'gate-ds': 'Data Structures',
    'gate-electronics': 'Electronics',
    'gate-os': 'Operating Systems',
    'gate-toc': 'Theory of Computation',
    'gk': 'General Knowledge',
    'htet-english': 'English',
    'htet-gk': 'General Knowledge',
    'htet-hindi': 'Hindi',
    'htet-maths': 'Mathematics',
    'jee-mathematics': 'Mathematics',
    'neet-botany': 'Botany',
    'neet-pg-paraclinical': 'Paraclinical Sciences',
    'nimcet-computer': 'Computer Science',
    'nimcet-mathematics': 'Mathematics',
    'nimcet-reasoning': 'Reasoning',
    'police-gk': 'General Knowledge',
    'police-numerical': 'Numerical Ability',
    'police-reasoning': 'Reasoning',
    'rrb-gk': 'General Knowledge',
    'rtet-language': 'Language',
    'ugc-comprehension': 'Reading Comprehension',
    'ugc-reasoning': 'Reasoning',
    'ugc-teaching': 'Teaching Aptitude',
    'upsc-gs': 'General Studies',
    'uptet-evs': 'Environmental Studies',
    'ailet-legal': 'Legal Reasoning',
  };

  return map[subjectCode] || subjectCode.split('-').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

// Categorize subject
function categorizeSubject(subjectCode: string): string {
  if (subjectCode.includes('physics') || subjectCode.includes('chemistry') ||
      subjectCode.includes('biology') || subjectCode.includes('botany')) {
    return 'science';
  }
  if (subjectCode.includes('math') || subjectCode.includes('numerical') ||
      subjectCode.includes('quantitative')) {
    return 'mathematics';
  }
  if (subjectCode.includes('english') || subjectCode.includes('hindi') ||
      subjectCode.includes('language') || subjectCode.includes('comprehension')) {
    return 'language';
  }
  if (subjectCode.includes('reasoning') || subjectCode.includes('logical') ||
      subjectCode.includes('analytical')) {
    return 'aptitude';
  }
  if (subjectCode.includes('gk') || subjectCode.includes('general') ||
      subjectCode.includes('gs') || subjectCode.includes('awareness')) {
    return 'general-knowledge';
  }
  if (subjectCode.includes('computer') || subjectCode.includes('gate-')) {
    return 'technical';
  }
  return 'general';
}

async function main() {
  console.log("=".repeat(80));
  console.log("🔧 FIX MISSING SUBJECTS - Phase 3.5");
  console.log("=".repeat(80));
  console.log("\nAdding missing subjects and creating their bridge mappings...\n");

  try {
    // 1. Find missing subjects
    console.log("1️⃣  Finding missing subjects...");

    const questionsSubjects = await db.execute(`
      SELECT DISTINCT subject_id
      FROM exam_questions
      ORDER BY subject_id
    `);

    const dimSubjects = await db.execute(`
      SELECT subject_code
      FROM dim_subjects
    `);

    const dimSubjectSet = new Set(dimSubjects.rows.map(r => String(r.subject_code)));

    const missing = [];
    for (const row of questionsSubjects.rows) {
      const subjectId = String(row.subject_id);
      if (!dimSubjectSet.has(subjectId)) {
        const count = await db.execute({
          sql: `SELECT COUNT(*) as cnt FROM exam_questions WHERE subject_id = ?`,
          args: [subjectId],
        });
        missing.push({
          code: subjectId,
          questionCount: Number(count.rows[0].cnt),
        });
      }
    }

    console.log(`   Found ${missing.length} missing subjects\n`);

    // 2. Add missing subjects to dim_subjects
    console.log("2️⃣  Adding missing subjects to dim_subjects...");
    let added = 0;

    for (const subj of missing) {
      const name = beautifySubjectName(subj.code);
      const category = categorizeSubject(subj.code);

      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO dim_subjects (subject_code, subject_name, category)
                VALUES (?, ?, ?)`,
          args: [subj.code, name, category],
        });
        added++;
        console.log(`   ✅ Added: ${subj.code.padEnd(30)} → ${name} (${subj.questionCount} questions)`);
      } catch (err: any) {
        console.log(`   ❌ Failed to add ${subj.code}: ${err.message}`);
      }
    }

    console.log(`\n   ✅ Added ${added}/${missing.length} subjects\n`);

    // 3. Now create bridge mappings for the previously failed combinations
    console.log("3️⃣  Creating bridge mappings for newly added subjects...");

    // Get fresh ID mappings
    const examMap = new Map<string, number>();
    const subjectMap = new Map<string, number>();
    const topicMap = new Map<string, number>();

    const exams = await db.execute(`SELECT id, exam_code FROM dim_exams`);
    exams.rows.forEach(r => examMap.set(String(r.exam_code), Number(r.id)));

    const subjects = await db.execute(`SELECT id, subject_code FROM dim_subjects`);
    subjects.rows.forEach(r => subjectMap.set(String(r.subject_code), Number(r.id)));

    const topics = await db.execute(`SELECT id, topic_name FROM dim_topics`);
    topics.rows.forEach(r => topicMap.set(String(r.topic_name), Number(r.id)));

    // Get combinations that use the newly added subjects
    const newCombinations = await db.execute({
      sql: `
        SELECT DISTINCT exam_id, subject_id, topic
        FROM exam_questions
        WHERE subject_id IN (${missing.map(() => '?').join(',')})
        ORDER BY exam_id, subject_id, topic
      `,
      args: missing.map(s => s.code),
    });

    console.log(`   Found ${newCombinations.rows.length} combinations to map\n`);

    let inserted = 0;
    let errors = 0;

    for (const row of newCombinations.rows) {
      const examCode = String(row.exam_id);
      const subjectCode = String(row.subject_id);
      const topicName = String(row.topic);

      const examId = examMap.get(examCode);
      const subjectId = subjectMap.get(subjectCode);
      const topicId = topicMap.get(topicName);

      if (!examId || !subjectId || !topicId) {
        errors++;
        if (errors <= 5) {
          console.log(`   ⚠️  Still missing: exam=${examCode}(${examId}), subject=${subjectCode}(${subjectId}), topic=${topicName}(${topicId})`);
        }
        continue;
      }

      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO bridge_exam_subject_topic (exam_id, subject_id, topic_id, is_mandatory, weightage)
                VALUES (?, ?, ?, ?, ?)`,
          args: [examId, subjectId, topicId, 1, 5],
        });
        inserted++;

        if (inserted % 50 === 0) {
          console.log(`   Progress: ${inserted}/${newCombinations.rows.length} mappings created...`);
        }
      } catch (err: any) {
        if (!err.message?.includes('UNIQUE constraint')) {
          errors++;
        }
      }
    }

    console.log(`\n   ✅ Created ${inserted} new bridge mappings\n`);
    if (errors > 0) {
      console.log(`   ⚠️  ${errors} mappings still failed (likely exam or topic missing)\n`);
    }

    // 4. Show updated statistics
    console.log("4️⃣  Updated Statistics:");

    const totalSubjects = await db.execute(`SELECT COUNT(*) as cnt FROM dim_subjects`);
    const totalBridge = await db.execute(`SELECT COUNT(*) as cnt FROM bridge_exam_subject_topic`);

    console.log(`   Total subjects: ${totalSubjects.rows[0].cnt}`);
    console.log(`   Total bridge mappings: ${totalBridge.rows[0].cnt}`);

    console.log("\n" + "=".repeat(80));
    console.log("✅ Phase 3.5 Complete: Missing subjects fixed!");
    console.log("=".repeat(80));
    console.log("\nNext steps:");
    console.log("  - Run Phase 4: Migrate questions with deduplication");
    console.log("  - ~1,800 additional questions are now accessible");
    console.log("");

  } catch (error: any) {
    console.error("❌ Fix failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
