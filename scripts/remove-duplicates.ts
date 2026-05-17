#!/usr/bin/env tsx
/**
 * Remove Duplicate Questions
 *
 * Strategy:
 * 1. Find questions with same first 80 characters (case-insensitive)
 * 2. Keep the oldest one (lower ROWID)
 * 3. Delete the duplicates
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

async function main() {
  console.log("=".repeat(80));
  console.log("🗑️  DUPLICATE QUESTION REMOVER");
  console.log("=".repeat(80));
  console.log("");

  // Step 1: Find all questions and group by similarity
  console.log("Step 1: Finding duplicates...\n");

  const allQuestions = await db.execute({
    sql: `SELECT id, question, exam_id, topic, LOWER(SUBSTR(question, 1, 80)) as question_start, ROWID
          FROM exam_questions
          ORDER BY ROWID`,
    args: [],
  });

  console.log(`Total questions: ${allQuestions.rows.length}`);

  // Group by question_start + exam_id + topic
  const groups = new Map<string, any[]>();

  for (const row of allQuestions.rows) {
    const key = `${row.exam_id}|||${row.topic}|||${row.question_start}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  }

  // Find groups with duplicates
  const duplicateGroups = Array.from(groups.values()).filter(g => g.length > 1);

  console.log(`Found ${duplicateGroups.length} groups with duplicates\n`);

  if (duplicateGroups.length === 0) {
    console.log("✅ No duplicates found!");
    return;
  }

  // Step 2: Show preview
  console.log("Preview of duplicates:\n");
  duplicateGroups.slice(0, 5).forEach((group, idx) => {
    console.log(`Group ${idx + 1}: ${group.length} duplicates`);
    console.log(`  Exam: ${group[0].exam_id}, Topic: ${group[0].topic}`);
    console.log(`  Question: ${group[0].question.substring(0, 80)}...`);
    console.log(`  IDs to keep: ${group[0].id} (oldest)`);
    console.log(`  IDs to delete: ${group.slice(1).map(q => q.id).join(", ")}`);
    console.log("");
  });

  // Step 3: Delete duplicates (keep oldest = lowest ROWID)
  console.log("Step 3: Deleting duplicates...\n");

  let totalDeleted = 0;

  for (const group of duplicateGroups) {
    // Sort by ROWID, keep first (oldest)
    group.sort((a, b) => Number(a.ROWID) - Number(b.ROWID));
    const toKeep = group[0];
    const toDelete = group.slice(1);

    for (const dup of toDelete) {
      try {
        await db.execute({
          sql: "DELETE FROM exam_questions WHERE id = ?",
          args: [dup.id],
        });
        totalDeleted++;
      } catch (err) {
        console.log(`⚠️  Failed to delete question ${dup.id}`);
      }
    }

    if ((totalDeleted % 50) === 0 && totalDeleted > 0) {
      console.log(`Deleted ${totalDeleted} duplicates so far...`);
    }
  }

  console.log("");
  console.log("=".repeat(80));
  console.log("✅ DUPLICATE REMOVAL COMPLETE");
  console.log("=".repeat(80));
  console.log(`Total duplicates deleted: ${totalDeleted}`);
  console.log(`Questions remaining: ${allQuestions.rows.length - totalDeleted}`);
  console.log("=".repeat(80));
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
