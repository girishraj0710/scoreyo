/**
 * Manual Database Export Script
 *
 * Usage: npx tsx scripts/export-backup.ts
 *
 * Exports critical tables to JSON for manual backup
 * Store these exports in a separate location (S3, Google Drive, etc.)
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

async function exportBackup() {
  const timestamp = new Date().toISOString().split("T")[0];
  const backupDir = path.join(process.cwd(), "backups", timestamp);

  console.log("📦 Exporting PrepGenie Database...\n");
  console.log(`📁 Backup directory: ${backupDir}\n`);

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Tables to export
  const criticalTables = [
    { name: "users", priority: "critical" },
    { name: "subscriptions", priority: "critical" },
    { name: "quiz_sessions", priority: "high" },
    { name: "quiz_attempts", priority: "high" },
    { name: "user_mastery", priority: "medium" },
    { name: "fact_exam_questions", priority: "medium" },
  ];

  try {
    for (const table of criticalTables) {
      console.log(`📥 Exporting ${table.name}...`);

      const result = await db.execute(`SELECT * FROM ${table.name}`);
      const rows = result.rows.map((row) => {
        const obj: any = {};
        for (let i = 0; i < result.columns.length; i++) {
          obj[result.columns[i]] = row[i];
        }
        return obj;
      });

      const filePath = path.join(backupDir, `${table.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));

      console.log(`   ✅ ${rows.length} rows exported to ${table.name}.json`);
    }

    // Create metadata file
    const metadata = {
      timestamp: new Date().toISOString(),
      database: process.env.TURSO_DATABASE_URL,
      tables: criticalTables.map((t) => t.name),
      exportedBy: "PrepGenie Backup Script",
    };

    fs.writeFileSync(
      path.join(backupDir, "metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    console.log("\n✅ Export complete!");
    console.log(`\n📍 Backup location: ${backupDir}`);
    console.log("\n🔐 Next steps:");
    console.log("   1. Compress the backup:");
    console.log(`      tar -czf backup-${timestamp}.tar.gz ${backupDir}`);
    console.log("   2. Upload to secure storage (S3, Google Drive, etc.)");
    console.log("   3. Delete local backup after upload");
    console.log("   4. Verify backup can be restored");
  } catch (error) {
    console.error("\n❌ Export failed:", error);
    process.exit(1);
  }
}

exportBackup();
