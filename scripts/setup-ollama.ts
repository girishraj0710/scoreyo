#!/usr/bin/env tsx
/**
 * PrepGenie - Ollama Setup & Validation Script
 *
 * Checks Ollama installation, recommends models, and validates setup
 */

async function checkOllamaInstalled(): Promise<boolean> {
  try {
    const { execSync } = await import("child_process");
    execSync("which ollama", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function checkOllamaRunning(host: string): Promise<boolean> {
  try {
    const response = await fetch(`${host}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

async function getInstalledModels(host: string): Promise<string[]> {
  try {
    const response = await fetch(`${host}/api/tags`);
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || [];
  } catch {
    return [];
  }
}

async function main() {
  const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   PrepGenie - Ollama Setup Wizard                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

  // Step 1: Check Ollama installation
  console.log("📦 Step 1: Checking Ollama installation...");
  const installed = await checkOllamaInstalled();

  if (!installed) {
    console.log(`
❌ Ollama not found!

Please install Ollama:
  🔗 https://ollama.ai/download

Installation commands:
  • macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh
  • Windows: Download from https://ollama.ai/download

After installation, run this script again.
`);
    process.exit(1);
  }

  console.log("✅ Ollama is installed\n");

  // Step 2: Check Ollama service
  console.log("🔍 Step 2: Checking Ollama service...");
  const running = await checkOllamaRunning(OLLAMA_HOST);

  if (!running) {
    console.log(`
❌ Ollama service not running!

Start Ollama in a separate terminal:
  $ ollama serve

Then run this script again.
`);
    process.exit(1);
  }

  console.log(`✅ Ollama service is running at ${OLLAMA_HOST}\n`);

  // Step 3: Check installed models
  console.log("🤖 Step 3: Checking installed models...");
  const models = await getInstalledModels(OLLAMA_HOST);

  if (models.length === 0) {
    console.log(`
⚠️  No models installed yet.

Recommended models for question generation (choose ONE):

┌─────────────────────────────────────────────────────────────┐
│ 🏆 Best Quality (Slower, 16GB+ RAM)                         │
├─────────────────────────────────────────────────────────────┤
│   • gemma2:27b     - Google's flagship (27B params)         │
│   • llama3.1:70b   - Meta's best (70B params)               │
│                                                              │
│ ⚡ Balanced (Recommended, 8-16GB RAM)                        │
├─────────────────────────────────────────────────────────────┤
│   • gemma2:9b      - Google (9B params) ✅ DEFAULT          │
│   • llama3.1:8b    - Meta (8B params)                       │
│   • mistral:7b     - Mistral AI (7B params)                 │
│                                                              │
│ 🚀 Fast (Lower quality, 4-8GB RAM)                          │
├─────────────────────────────────────────────────────────────┤
│   • gemma2:2b      - Google (2B params)                     │
│   • llama3.2:3b    - Meta (3B params)                       │
└─────────────────────────────────────────────────────────────┘

To install a model:
  $ ollama pull gemma2:9b

After pulling, run this script again.
`);
    process.exit(1);
  }

  console.log(`✅ Found ${models.length} installed model(s):\n`);
  models.forEach((model) => {
    const recommended =
      model.includes("gemma2:9b") ||
      model.includes("llama3.1:8b") ||
      model.includes("mistral:7b");
    console.log(`   ${recommended ? "✅" : "  "} ${model}`);
  });

  // Recommend best model
  const bestModel =
    models.find((m) => m.includes("gemma2:27b")) ||
    models.find((m) => m.includes("llama3.1:70b")) ||
    models.find((m) => m.includes("gemma2:9b")) ||
    models.find((m) => m.includes("llama3.1:8b")) ||
    models.find((m) => m.includes("mistral:7b")) ||
    models[0];

  console.log(`\n🎯 Recommended model for seeding: ${bestModel}\n`);

  // Step 4: Test generation
  console.log("🧪 Step 4: Testing question generation...");

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: bestModel,
        prompt: `Generate 1 simple MCQ for JEE Main Physics on Newton's Laws.
Output format:
{"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": {"logic": "...", "formula": null, "calculation": null, "trapAlerts": [], "commonMistakes": []}}]}`,
        stream: false,
        options: { temperature: 0.8 },
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Test generation successful (${data.response.length} chars)\n`);
  } catch (error: any) {
    console.log(`❌ Test generation failed: ${error.message}\n`);
    process.exit(1);
  }

  // Success summary
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Setup Complete! Ready to seed questions               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

🎯 Quick Start:

  1. Seed ALL questions (this will take hours):
     $ npm run seed:questions

  2. Seed specific exam:
     $ npm run seed:questions jee-main

  3. Seed specific subject:
     $ npm run seed:questions jee-main jee-physics

  4. Seed specific topic:
     $ npm run seed:questions jee-main jee-physics "Kinematics"

⚙️  Configuration (optional):

  export OLLAMA_MODEL=${bestModel}        # Model to use
  export OLLAMA_HOST=${OLLAMA_HOST}  # Ollama API host
  export QUESTIONS_PER_TOPIC=30               # Questions per topic
  export BATCH_SIZE=5                         # Questions per API call

📊 Expected Output:

  • ${models.includes("gemma2:9b") ? "~1-2" : models.includes("gemma2:2b") ? "~2-4" : "~0.5-1"} minutes per topic (${OLLAMA_HOST.includes("localhost") ? "local generation" : "remote API"})
  • ~30 questions per topic
  • Difficulty: 40% easy, 40% medium, 20% hard
  • Rich explanations with formulas, traps, common mistakes

Happy seeding! 🚀
`);
}

main().catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exit(1);
});
