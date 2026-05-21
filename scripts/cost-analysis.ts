#!/usr/bin/env tsx

console.log("\n💰 COST ANALYSIS & OPTIMIZATION\n");
console.log("=".repeat(80));

// Actual results from last run
const lastRun = {
  questionsGenerated: 7564,
  costUSD: 5,
  topicsProcessed: 850
};

const costPerQuestion = lastRun.costUSD / lastRun.questionsGenerated;
const costPerTopic = lastRun.costUSD / lastRun.topicsProcessed;

console.log("📊 LAST RUN ANALYSIS:");
console.log(`   Questions generated: ${lastRun.questionsGenerated}`);
console.log(`   Total cost: $${lastRun.costUSD}`);
console.log(`   Cost per question: $${costPerQuestion.toFixed(5)} (${(costPerQuestion * 100).toFixed(3)}¢)`);
console.log(`   Cost per topic: $${costPerTopic.toFixed(4)}`);

console.log("\n" + "=".repeat(80));

// Calculate costs for remaining work
const remaining = {
  upPolice: 411,
  nda: 348,
  delhiPolice: 348,
  ugcNet: 312,
  cat: 245,
  xat: 202,
  licAao: 143,
  cds: 111,
  kcet: 26,
  ibpsClerk: 21
};

const totalNeeded = Object.values(remaining).reduce((a, b) => a + b, 0);
const estimatedCost = totalNeeded * costPerQuestion;

console.log("🎯 REMAINING WORK:");
console.log(`   Total questions needed: ${totalNeeded}`);
console.log(`   Estimated cost at current rate: $${estimatedCost.toFixed(2)}`);

console.log("\n" + "=".repeat(80));

// Model pricing comparison (OpenRouter approximate costs per 1M tokens)
const models = [
  { name: "gemini-2.0-flash-lite", input: 0.0375, output: 0.15, quality: "Good", speed: "Fast" },
  { name: "gemini-flash-1.5-8b", input: 0.0375, output: 0.15, quality: "Good", speed: "Fast" },
  { name: "gemini-flash-1.5", input: 0.075, output: 0.30, quality: "Better", speed: "Fast" },
  { name: "gemini-pro-1.5", input: 1.25, output: 5.00, quality: "Best", speed: "Slower" },
];

console.log("💡 MODEL OPTIONS (Cost per 1M tokens):\n");
models.forEach(m => {
  console.log(`   ${m.name.padEnd(25)} $${m.input.toFixed(4)} in / $${m.output.toFixed(4)} out`);
  console.log(`   ${"".padEnd(25)} Quality: ${m.quality.padEnd(7)} Speed: ${m.speed}`);
  console.log();
});

console.log("=".repeat(80));

// Calculate approximate tokens per question
const avgPromptTokens = 300; // Estimate
const avgResponseTokens = 800; // Estimate (15 questions × ~50 tokens each)
const questionsPerBatch = 15;

const tokensPerBatch = avgPromptTokens + avgResponseTokens;
const batchesNeeded = Math.ceil(totalNeeded / questionsPerBatch);
const totalTokensNeeded = batchesNeeded * tokensPerBatch;

console.log("\n📝 TOKEN ESTIMATION:");
console.log(`   Tokens per batch: ~${tokensPerBatch}`);
console.log(`   Batches needed: ${batchesNeeded}`);
console.log(`   Total tokens: ~${(totalTokensNeeded / 1000).toFixed(1)}K`);

console.log("\n" + "=".repeat(80));

console.log("\n💰 COST PROJECTIONS FOR REMAINING 2,167 QUESTIONS:\n");

// Calculate cost for each model
const currentModel = models[1]; // gemini-flash-1.5-8b
const inputCost = (avgPromptTokens * batchesNeeded / 1_000_000) * currentModel.input;
const outputCost = (avgResponseTokens * batchesNeeded / 1_000_000) * currentModel.output;
const totalModelCost = inputCost + outputCost;

console.log(`   Using ${currentModel.name}:`);
console.log(`   Estimated: $${totalModelCost.toFixed(2)} - $${(totalModelCost * 1.5).toFixed(2)}`);
console.log(`   (Based on ~${(totalTokensNeeded / 1000).toFixed(0)}K tokens)`);

console.log("\n" + "=".repeat(80));

console.log("\n✅ RECOMMENDATIONS:\n");
console.log("   1. Continue with gemini-flash-1.5-8b (current model)");
console.log("      - Proven quality (95%+ pass rate)");
console.log(`      - Estimated cost: $${(estimatedCost * 0.8).toFixed(2)} - $${estimatedCost.toFixed(2)}`);
console.log("");
console.log("   2. Use Ollama (FREE) but slower");
console.log("      - Cost: $0");
console.log("      - Quality: ~60% pass rate");
console.log("      - Time: 2-3 days");
console.log("");
console.log("   3. Hybrid approach");
console.log("      - Use verified for critical exams (UP Police, NDA, Delhi Police)");
console.log("      - Use Ollama for others");
console.log(`      - Estimated cost: $${(estimatedCost * 0.4).toFixed(2)} - $${(estimatedCost * 0.6).toFixed(2)}`);
console.log("");
console.log("=".repeat(80));
