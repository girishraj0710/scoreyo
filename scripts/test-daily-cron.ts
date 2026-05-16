#!/usr/bin/env tsx
/**
 * Test Daily Seeding Cron Job Locally
 *
 * Usage: npx tsx scripts/test-daily-cron.ts
 *
 * This script tests the daily seeding logic without waiting for Vercel cron.
 */

import { runDailySeeding } from "./daily-seed-cron";

console.log("🧪 Testing Daily Seeding Cron Job (Local Test)\n");

runDailySeeding()
  .then((result) => {
    console.log("\n✅ Test completed successfully!");
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed!");
    console.error("Error:", error.message);
    process.exit(1);
  });
