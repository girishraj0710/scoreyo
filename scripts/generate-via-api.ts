#!/usr/bin/env ts-node
/**
 * Generate Questions via API
 * Calls the Next.js API endpoint which has database access
 */

// Use native fetch (Node 18+)
const fetch = globalThis.fetch;

const API_URL = process.env.API_URL || 'http://localhost:3000';

const TARGETS = [
  // IELTS
  { exam: 'IELTS', subject: 'Reading', topic: 'Academic Reading', count: 50, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Reading', topic: 'General Training', count: 50, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 1', count: 25, difficulty: 'mixed' as const },
  { exam: 'IELTS', subject: 'Writing', topic: 'Task 2', count: 25, difficulty: 'mixed' as const },

  // JEE
  { exam: 'JEE', subject: 'Physics', topic: 'Mechanics', count: 30, difficulty: 'mixed' as const },
  { exam: 'JEE', subject: 'Chemistry', topic: 'Organic Chemistry', count: 35, difficulty: 'mixed' as const },
  { exam: 'JEE', subject: 'Mathematics', topic: 'Calculus', count: 35, difficulty: 'mixed' as const },

  // NEET
  { exam: 'NEET', subject: 'Biology', topic: 'Cell Biology', count: 40, difficulty: 'mixed' as const },
  { exam: 'NEET', subject: 'Chemistry', topic: 'Inorganic Chemistry', count: 40, difficulty: 'mixed' as const },

  // UPSC
  { exam: 'UPSC', subject: 'Polity', topic: 'Indian Constitution', count: 25, difficulty: 'mixed' as const },
  { exam: 'UPSC', subject: 'History', topic: 'Modern India', count: 25, difficulty: 'mixed' as const },

  // SSC
  { exam: 'SSC', subject: 'Reasoning', topic: 'Logical Reasoning', count: 25, difficulty: 'mixed' as const },
  { exam: 'SSC', subject: 'Quantitative', topic: 'Arithmetic', count: 25, difficulty: 'mixed' as const },
];

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  AI QUESTION GENERATION VIA API                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`📋 Targets: ${TARGETS.length}`);
  console.log(`📊 Total Questions: ${TARGETS.reduce((sum, t) => sum + t.count, 0)}\n`);

  let totalGenerated = 0;
  let totalSaved = 0;
  let totalFailed = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];

    console.log(`\n${'='.repeat(70)}`);
    console.log(`Task ${i + 1}/${TARGETS.length}: ${target.exam} - ${target.subject} - ${target.topic}`);
    console.log('='.repeat(70));

    try {
      const response = await fetch(`${API_URL}/api/admin/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });

      const data = await response.json() as any;

      if (data.success) {
        console.log(`✅ Generated: ${data.generated}`);
        console.log(`💾 Saved: ${data.saved}`);
        console.log(`❌ Failed: ${data.failed}`);

        totalGenerated += data.generated;
        totalSaved += data.saved;
        totalFailed += data.failed;
      } else {
        console.log(`❌ Task failed: ${data.error}`);
        if (data.message) console.log(`   Message: ${data.message}`);
        totalFailed += target.count;
      }

      // Rate limiting
      if (i < TARGETS.length - 1) {
        console.log('\n⏳ Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (err) {
      console.log(`❌ Request failed: ${(err as Error).message}`);
      totalFailed += target.count;
    }
  }

  // Final summary
  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  FINAL SUMMARY                                                 ║');
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  Generated: ${totalGenerated} questions`);
  console.log(`║  Saved:     ${totalSaved} questions`);
  console.log(`║  Failed:    ${totalFailed} questions`);
  console.log(`║  Success:   ${((totalSaved / (totalSaved + totalFailed)) * 100).toFixed(1)}%`);
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('✅ Generation complete!\n');

  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
