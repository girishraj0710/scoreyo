#!/usr/bin/env node

/**
 * Deploy imported questions to question-bank.ts
 * Appends new question arrays and registers them
 */

const fs = require('fs');

const COMBINED_FILE = '.agents/artifacts/imported-questions/_all_combined.ts';
const QUESTION_BANK = 'src/lib/question-bank.ts';

console.log('📦 Deploying imported questions to question bank...\n');

// Read combined imported questions
if (!fs.existsSync(COMBINED_FILE)) {
  console.error('❌ Combined file not found:', COMBINED_FILE);
  process.exit(1);
}

const importedQuestions = fs.readFileSync(COMBINED_FILE, 'utf8');

// Read current question bank
const questionBank = fs.readFileSync(QUESTION_BANK, 'utf8');

// Extract just the question array definitions (remove auto-gen header and exports)
const lines = importedQuestions.split('\n');
const arrayLines = [];
let inArray = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip header comments
  if (line.startsWith('//') && line.includes('Auto-generated')) continue;
  if (line.startsWith('//') && line.includes('Generated:')) continue;

  // Skip export statements
  if (line.includes('export {')) break;

  // Start capturing from first const declaration
  if (line.includes('const') && line.includes(': BankQuestion[]')) {
    inArray = true;
  }

  if (inArray) {
    arrayLines.push(line);
  }
}

const newQuestionArrays = arrayLines.join('\n');

// Find insertion point (before the last export functions)
const insertMarker = '// ─── PUBLIC API ──────────────────────────────────────────';
const insertIndex = questionBank.indexOf(insertMarker);

if (insertIndex === -1) {
  console.error('❌ Could not find insertion point in question-bank.ts');
  process.exit(1);
}

// Create deployment section
const deploymentSection = `
// ═══════════════════════════════════════════════════════════════
// IMPORTED QUESTIONS FROM GITHUB & OFFICIAL SOURCES
// Generated: ${new Date().toISOString()}
// Total: 172 questions (NIMCET: 70, UPSC/BPSC/GK: 60, JEE Main 2025: 42)
// ═══════════════════════════════════════════════════════════════

${newQuestionArrays}

// ─── Register Imported Questions ─────────────────────────────

// JEE Main 2025 (42 questions)
addToBank("jee-main", "jee-mathematics", "Mathematics", jee_main_mathematics_Mathematics);
addToBank("jee-main", "jee-physics", "Physics", jee_main_physics_Physics);
addToBank("jee-main", "jee-chemistry", "Chemistry", jee_main_chemistry_Chemistry);

// NIMCET 2025 (70 questions)
addToBank("nimcet", "nimcet-mathematics", "Mathematics", nimcet_hard_2025_mathematics_Mathematics);
addToBank("nimcet", "nimcet-reasoning", "Analytical Ability & Logical Reasoning", nimcet_hard_2025_analytical_ability_and_logical_reasoning_Analytical_Ability___Logical_Reasoning);
addToBank("nimcet", "nimcet-computer", "Computer Awareness", nimcet_hard_2025_computer_awareness_Computer_Awareness);

// UPSC/BPSC/General Knowledge (60 questions)
addToBank("upsc-cse", "upsc-gs", "General Studies", upsc_cse_upsc_General);
addToBank("upsc-cse", "upsc-gs", "BPSC General", upsc_cse_bpsc_General);
addToBank("general-knowledge", "gk", "General Knowledge", general_knowledge_gk_General);

`;

// Insert the new content
const updatedQuestionBank =
  questionBank.slice(0, insertIndex) +
  deploymentSection +
  '\n' +
  questionBank.slice(insertIndex);

// Write back
fs.writeFileSync(QUESTION_BANK, updatedQuestionBank);

console.log('✅ Successfully deployed 172 questions!');
console.log('\n📊 Added:');
console.log('   - JEE Main 2025: 42 questions (Math, Physics, Chemistry)');
console.log('   - NIMCET 2025: 70 questions (Math, Reasoning, Computer)');
console.log('   - UPSC/BPSC/GK: 60 questions (General Studies)');
console.log('\n📝 Next steps:');
console.log('   1. npm run build (verify TypeScript compilation)');
console.log('   2. npm run dev (test locally)');
console.log('   3. git add . && git commit -m "feat: Add 172 real questions"');
console.log('   4. git push origin main (auto-deploy to Vercel)');
console.log('');
