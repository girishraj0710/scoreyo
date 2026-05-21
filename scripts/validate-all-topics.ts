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

async function validateAllTopics() {
  console.log("\n✅ Validating All Topics in exams.ts...\n");
  console.log("=" .repeat(80));

  // Get all valid topics from exams.ts
  const validTopicsSet = new Set<string>();
  let totalTopics = 0;

  for (const category of examCategories) {
    for (const exam of category.exams) {
      for (const subject of exam.subjects) {
        for (const topic of subject.topics) {
          validTopicsSet.add(topic);
          totalTopics++;
        }
      }
    }
  }

  console.log(`\n📚 Topics in exams.ts:`);
  console.log(`  Total topic references: ${totalTopics}`);
  console.log(`  Unique topics: ${validTopicsSet.size}`);

  // Find invalid topics (not in exams.ts or suspicious names)
  const allTopicsResult = await db.execute("SELECT id, topic_name FROM dim_topics");
  
  const invalidTopics: Array<{id: number, name: string, reason: string}> = [];
  
  for (const row of allTopicsResult.rows) {
    const id = Number(row.id);
    const name = String(row.topic_name);
    
    // Check if invalid
    let isInvalid = false;
    let reason = "";
    
    // Empty or whitespace only
    if (name.trim() === "") {
      isInvalid = true;
      reason = "Empty string";
    }
    // Single letter
    else if (/^[A-Za-z]$/.test(name)) {
      isInvalid = true;
      reason = "Single letter";
    }
    // Just numbers
    else if (/^[0-9]+$/.test(name)) {
      isInvalid = true;
      reason = "Just numbers";
    }
    // Single letter + number (E1, E2, etc)
    else if (/^[A-Z][0-9]$/.test(name)) {
      isInvalid = true;
      reason = "Letter + number";
    }
    // Not in exams.ts and very short (<=3 chars) - likely invalid
    else if (!validTopicsSet.has(name) && name.length <= 3) {
      isInvalid = true;
      reason = "Not in exams.ts and very short";
    }
    
    if (isInvalid) {
      invalidTopics.push({ id, name, reason });
    }
  }

  console.log(`\n❌ Invalid Topics Found: ${invalidTopics.length}\n`);

  // Group by reason
  const byReason = new Map<string, typeof invalidTopics>();
  for (const topic of invalidTopics) {
    if (!byReason.has(topic.reason)) {
      byReason.set(topic.reason, []);
    }
    byReason.get(topic.reason)!.push(topic);
  }

  for (const [reason, topics] of byReason.entries()) {
    console.log(`\n  ${reason}: ${topics.length} topics`);
    topics.slice(0, 10).forEach(t => console.log(`    - ID ${t.id}: "${t.name}"`));
    if (topics.length > 10) {
      console.log(`    ... and ${topics.length - 10} more`);
    }
  }

  console.log("\n" + "=".repeat(80));
  
  return invalidTopics;
}

validateAllTopics().then(() => process.exit(0)).catch(console.error);
