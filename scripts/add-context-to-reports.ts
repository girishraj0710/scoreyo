#!/usr/bin/env tsx
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function addContextColumns() {
  console.log("Adding exam_id and subject_id columns to question_reports...");

  try {
    // Add exam_id column
    await db.execute(`
      ALTER TABLE question_reports
      ADD COLUMN exam_id TEXT
    `);
    console.log("✅ Added exam_id column");
  } catch (error: any) {
    if (error.message?.includes("duplicate column")) {
      console.log("⚠️  exam_id column already exists");
    } else {
      throw error;
    }
  }

  try {
    // Add subject_id column
    await db.execute(`
      ALTER TABLE question_reports
      ADD COLUMN subject_id TEXT
    `);
    console.log("✅ Added subject_id column");
  } catch (error: any) {
    if (error.message?.includes("duplicate column")) {
      console.log("⚠️  subject_id column already exists");
    } else {
      throw error;
    }
  }

  console.log("\n✅ Schema update complete!");
  console.log("\nNote: Existing reports will have NULL exam_id/subject_id.");
  console.log("New reports will capture the context when submitted.");
}

addContextColumns().catch(console.error);
