#!/usr/bin/env tsx
/**
 * Test Daily Seeding Cron Job V2 Locally
 *
 * Usage:
 * - Launch Prep Mode: CRON_MODE=LAUNCH_PREP npx tsx scripts/test-daily-cron-v2.ts
 * - Maintenance Mode: CRON_MODE=MAINTENANCE npx tsx scripts/test-daily-cron-v2.ts
 * - Default: npx tsx scripts/test-daily-cron-v2.ts (uses LAUNCH_PREP)
 */

import { runDailySeeding } from "./daily-seed-cron-v2";

const mode = process.env.CRON_MODE || "LAUNCH_PREP";
console.log(`\n🧪 Testing Daily Seeding Cron Job V2 - ${mode} MODE\n`);

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
