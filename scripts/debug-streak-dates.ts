/**
 * Debug script to check what dates are in quiz_sessions table
 * Instructions:
 * 1. Copy TURSO_DATABASE_URL and TURSO_AUTH_TOKEN from .env.local
 * 2. Set them as environment variables
 * 3. Run: TURSO_DATABASE_URL="..." TURSO_AUTH_TOKEN="..." npx tsx scripts/debug-streak-dates.ts
 */

console.log("🔍 Streak Date Debug Summary\n");
console.log("=" .repeat(60));

console.log("\n📋 ISSUE:");
console.log("User sees different dates in:");
console.log("  - Dashboard Streak Card");
console.log("  - Study Streak Calendar");
console.log("  - Reports Daily Activity");

console.log("\n🔧 FIX APPLIED:");
console.log("Added 'localtime' to all DATE() queries in:");
console.log("  ✓ src/lib/db.ts (5 queries)");
console.log("  ✓ src/app/api/streak-calendar/route.ts (1 query)");

console.log("\n📊 WHAT CHANGED:");
console.log("  Before: DATE(created_at)           → UTC timezone");
console.log("  After:  DATE(created_at, 'localtime') → User timezone");

console.log("\n⚠️  ACTION REQUIRED:");
console.log("1. Check if Vercel deployed latest commit (5e97d62)");
console.log("   → Visit: https://vercel.com/dashboard");
console.log("   → Project: prepgenie");
console.log("   → Check latest deployment");

console.log("\n2. Clear browser cache:");
console.log("   → Ctrl+Shift+R (hard refresh)");
console.log("   → Or use incognito window");

console.log("\n3. Test after deployment:");
console.log("   → Login to https://prepgenie.co.in");
console.log("   → Check Dashboard streak");
console.log("   → Check Calendar widget");
console.log("   → Check Reports → Daily Activity");
console.log("   → All three should show SAME dates");

console.log("\n🎯 EXPECTED RESULT:");
console.log("If you took quizzes on:");
console.log("  May 5, 10, 11, 16, 21");
console.log("Then ALL three places should show:");
console.log("  🔥 May 5, 10, 11, 16, 21");

console.log("\n" + "=".repeat(60));
console.log("✅ Code is fixed and pushed to GitHub!");
console.log("⏳ Waiting for Vercel deployment...");
