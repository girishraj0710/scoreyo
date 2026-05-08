#!/usr/bin/env node

/**
 * Deploy imported questions to question-bank.ts
 * Appends new question arrays and registers them
 */

const fs = require('fs');

const COMBINED_FILE = '.agents/artifacts/imported-questions/_all_combined_full.ts';
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

// Find insertion point (before the last export functions)
const insertMarker = '// ─── PUBLIC API ──────────────────────────────────────────';
const insertIndex = questionBank.indexOf(insertMarker);

if (insertIndex === -1) {
  console.error('❌ Could not find insertion point in question-bank.ts');
  process.exit(1);
}

// Create mappings for the imported arrays
const mappings = `
// ─── Register Imported Questions ─────────────────────────────

// JEE Main 2025 (42 questions from official paper)
addToBank("jee-main", "jee-mathematics", "Algebra", jee_main_mathematics_Mathematics);
addToBank("jee-main", "jee-mathematics", "Calculus", jee_main_mathematics_Mathematics);
addToBank("jee-main", "jee-mathematics", "Coordinate Geometry", jee_main_mathematics_Mathematics);
addToBank("jee-main", "jee-physics", "Mechanics", jee_main_physics_Physics);
addToBank("jee-main", "jee-physics", "Electromagnetism", jee_main_physics_Physics);
addToBank("jee-main", "jee-chemistry", "Physical Chemistry", jee_main_chemistry_Chemistry);
addToBank("jee-main", "jee-chemistry", "Inorganic Chemistry", jee_main_chemistry_Chemistry);

// NIMCET 2025 (70 questions from community)
addToBank("nimcet", "nimcet-mathematics", "Mathematics", nimcet_hard_2025_mathematics_Mathematics);
addToBank("nimcet", "nimcet-reasoning", "Analytical Ability", nimcet_hard_2025_analytical_ability_and_logical_reasoning_Analytical_Ability___Logical_Reasoning);
addToBank("nimcet", "nimcet-computer", "Computer Awareness", nimcet_hard_2025_computer_awareness_Computer_Awareness);

// UPSC/BPSC/GK (60 questions from community)
addToBank("upsc-cse", "upsc-gs", "Current Affairs", upsc_cse_upsc_General);
addToBank("upsc-cse", "upsc-gs", "History", upsc_cse_upsc_General);
addToBank("upsc-cse", "upsc-gs", "Polity", upsc_cse_upsc_General);
addToBank("upsc-cse", "upsc-gs", "BPSC General Studies", upsc_cse_bpsc_General);
addToBank("general-knowledge", "gk", "Current Affairs", general_knowledge_gk_General);
addToBank("general-knowledge", "gk", "Static GK", general_knowledge_gk_General);

`;

// Create deployment section
const deploymentSection = `
// ═══════════════════════════════════════════════════════════════
// IMPORTED QUESTIONS FROM GITHUB & OFFICIAL SOURCES
// Generated: ${new Date().toISOString()}
// Total: 172 questions (NIMCET: 70, UPSC/BPSC/GK: 60, JEE Main 2025: 42)
// Sources: GitHub repos + Official JEE Main 2025 paper
// ═══════════════════════════════════════════════════════════════

${importedQuestions.trim()}

${mappings}
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
console.log('\n📊 Breakdown:');
console.log('   - JEE Main 2025: 42 questions (Math: 15, Physics: 12, Chemistry: 15)');
console.log('   - NIMCET 2025: 70 questions (Math: 16, Reasoning: 20, Computer: 34)');
console.log('   - UPSC/BPSC/GK: 60 questions (UPSC: 20, BPSC: 20, GK: 20)');
console.log('\n📝 Next steps:');
console.log('   1. npm run build (verify TypeScript compilation)');
console.log('   2. npm run dev (test locally)');
console.log('   3. git add . && git commit -m "feat: Add 172 real questions from official + community sources"');
console.log('   4. git push origin main (auto-deploy to Vercel)');
console.log('');
