#!/usr/bin/env node

/**
 * PrepGenie - FREE Question Generation with Ollama (Local AI)
 *
 * Uses Ollama - completely free, runs on your computer, no API costs!
 *
 * Setup (one-time):
 *   1. Install Ollama: https://ollama.ai
 *   2. Pull models: ollama pull llama3.2
 *   3. Run this script anytime you want questions!
 *
 * Usage:
 *   node scripts/generate-with-ollama.js --exam jee-main --count 100
 *
 * Run every few months to add more questions. No limits!
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Ollama is installed
function checkOllama() {
  try {
    execFileSync('ollama', ['list'], { encoding: 'utf8' });
    return true;
  } catch (error) {
    return false;
  }
}

// Call Ollama locally
async function callOllama(model, prompt) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error calling Ollama:`, error.message);
    return null;
  }
}

// Generate question
async function generateQuestion(model, examName, subject, topic, difficulty, exam_id, subject_id) {
  const prompt = `Generate a ${difficulty} difficulty multiple choice question for ${examName} exam, subject: ${subject}, topic: ${topic}.

Return ONLY valid JSON (no markdown, no explanation):
{
  "question": "Question text here",
  "option_a": "First option",
  "option_b": "Second option",
  "option_c": "Third option",
  "option_d": "Fourth option",
  "correct_answer": 0,
  "explanation": "Detailed step-by-step explanation",
  "difficulty": "${difficulty}"
}

Requirements:
- Question must be factually accurate
- All 4 options must be plausible
- Explanation must be detailed (at least 50 words)
- correct_answer must be 0, 1, 2, or 3`;

  console.log(`   Generating: ${topic} (${difficulty})...`);

  const response = await callOllama(model, prompt);
  if (!response) return null;

  try {
    // Extract JSON from response
    let jsonText = response.trim();

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`   ⚠️  No valid JSON found`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate
    if (!parsed.question || !parsed.option_a || !parsed.option_b ||
        !parsed.option_c || !parsed.option_d || parsed.correct_answer === undefined) {
      console.log(`   ⚠️  Missing required fields`);
      return null;
    }

    console.log(`   ✅ Generated successfully`);

    return {
      ...parsed,
      exam_id,
      subject_id,
      topic,
      year: `Local AI Generated ${new Date().getFullYear()}`,
      source_detail: `Ollama ${model}`,
    };
  } catch (error) {
    console.log(`   ❌ Failed to parse: ${error.message}`);
    return null;
  }
}

// Exam configurations - ALL EXAMS
const EXAMS = {
  'jee-main': {
    name: 'JEE Main',
    subjects: [
      { id: 'jee-physics', name: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics', 'Modern Physics'] },
      { id: 'jee-chemistry', name: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
      { id: 'jee-maths', name: 'Mathematics', topics: ['Algebra', 'Calculus', 'Trigonometry', 'Coordinate Geometry'] },
    ],
  },
  'jee-advanced': {
    name: 'JEE Advanced',
    subjects: [
      { id: 'jee-adv-physics', name: 'Physics', topics: ['Mechanics', 'Electromagnetism', 'Modern Physics'] },
      { id: 'jee-adv-chemistry', name: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
      { id: 'jee-adv-maths', name: 'Mathematics', topics: ['Algebra', 'Calculus', 'Coordinate Geometry'] },
    ],
  },
  'neet-ug': {
    name: 'NEET UG',
    subjects: [
      { id: 'neet-physics', name: 'Physics', topics: ['Mechanics', 'Optics', 'Electricity', 'Thermodynamics'] },
      { id: 'neet-chemistry', name: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'] },
      { id: 'neet-biology', name: 'Biology', topics: ['Cell Biology', 'Genetics', 'Human Physiology', 'Plant Physiology', 'Ecology'] },
    ],
  },
  'neet-pg': {
    name: 'NEET PG',
    subjects: [
      { id: 'neet-pg-medicine', name: 'Medicine', topics: ['Internal Medicine', 'Pathology', 'Pharmacology'] },
      { id: 'neet-pg-surgery', name: 'Surgery', topics: ['General Surgery', 'Orthopedics'] },
    ],
  },
  'upsc-cse': {
    name: 'UPSC CSE',
    subjects: [
      { id: 'upsc-history', name: 'History', topics: ['Ancient India', 'Medieval India', 'Modern India', 'World History'] },
      { id: 'upsc-polity', name: 'Polity', topics: ['Constitution', 'Governance', 'Political System'] },
      { id: 'upsc-geography', name: 'Geography', topics: ['Physical Geography', 'Indian Geography', 'World Geography'] },
      { id: 'upsc-economy', name: 'Economy', topics: ['Indian Economy', 'Economic Development', 'Government Budgeting'] },
    ],
  },
  'gate': {
    name: 'GATE CS',
    subjects: [
      { id: 'gate-cs', name: 'Computer Science', topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks'] },
      { id: 'gate-aptitude', name: 'General Aptitude', topics: ['Verbal Ability', 'Numerical Ability'] },
      { id: 'gate-engineering-math', name: 'Engineering Mathematics', topics: ['Linear Algebra', 'Calculus', 'Probability'] },
    ],
  },
  'ssc-cgl': {
    name: 'SSC CGL',
    subjects: [
      { id: 'ssc-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry'] },
      { id: 'ssc-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Verbal Reasoning', 'Non-Verbal Reasoning'] },
      { id: 'ssc-english', name: 'English', topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'ssc-gk', name: 'General Knowledge', topics: ['History', 'Geography', 'Current Affairs', 'Science'] },
    ],
  },
  'ssc-chsl': {
    name: 'SSC CHSL',
    subjects: [
      { id: 'ssc-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra'] },
      { id: 'ssc-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Verbal Reasoning'] },
      { id: 'ssc-english', name: 'English', topics: ['Grammar', 'Vocabulary'] },
      { id: 'ssc-gk', name: 'General Knowledge', topics: ['Current Affairs', 'General Science'] },
    ],
  },
  'ibps-po': {
    name: 'IBPS PO',
    subjects: [
      { id: 'ibps-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Data Interpretation'] },
      { id: 'ibps-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Puzzles'] },
      { id: 'ibps-english', name: 'English', topics: ['Grammar', 'Reading Comprehension'] },
      { id: 'ibps-gk', name: 'General Awareness', topics: ['Banking Awareness', 'Current Affairs'] },
    ],
  },
  'sbi-po': {
    name: 'SBI PO',
    subjects: [
      { id: 'sbi-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Data Interpretation'] },
      { id: 'sbi-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Puzzles'] },
      { id: 'sbi-english', name: 'English', topics: ['Grammar', 'Reading Comprehension'] },
      { id: 'sbi-gk', name: 'General Awareness', topics: ['Banking Awareness', 'Current Affairs'] },
    ],
  },
  'cat': {
    name: 'CAT',
    subjects: [
      { id: 'cat-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra', 'Geometry'] },
      { id: 'cat-varc', name: 'Verbal Ability & RC', topics: ['Reading Comprehension', 'Verbal Ability'] },
      { id: 'cat-dilr', name: 'Data Interpretation & LR', topics: ['Data Interpretation', 'Logical Reasoning'] },
    ],
  },
  'xat': {
    name: 'XAT',
    subjects: [
      { id: 'xat-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra'] },
      { id: 'xat-verbal', name: 'Verbal Ability', topics: ['Reading Comprehension', 'Grammar'] },
      { id: 'xat-decision', name: 'Decision Making', topics: ['Situational Judgment', 'Ethics'] },
    ],
  },
  'clat': {
    name: 'CLAT',
    subjects: [
      { id: 'clat-english', name: 'English', topics: ['Grammar', 'Comprehension'] },
      { id: 'clat-gk', name: 'Current Affairs & GK', topics: ['Current Affairs', 'Static GK'] },
      { id: 'clat-legal', name: 'Legal Reasoning', topics: ['Legal Principles', 'Case Studies'] },
      { id: 'clat-logical', name: 'Logical Reasoning', topics: ['Logical Puzzles', 'Critical Reasoning'] },
    ],
  },
  'nda': {
    name: 'NDA',
    subjects: [
      { id: 'nda-maths', name: 'Mathematics', topics: ['Algebra', 'Trigonometry', 'Calculus', 'Geometry'] },
      { id: 'nda-gat', name: 'General Ability Test', topics: ['Physics', 'Chemistry', 'General Science', 'History', 'Geography'] },
    ],
  },
  'cds': {
    name: 'CDS',
    subjects: [
      { id: 'cds-english', name: 'English', topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'cds-gk', name: 'General Knowledge', topics: ['History', 'Geography', 'Current Affairs', 'Science'] },
      { id: 'cds-maths', name: 'Elementary Mathematics', topics: ['Arithmetic', 'Algebra', 'Geometry'] },
    ],
  },
  'rrb-ntpc': {
    name: 'RRB NTPC',
    subjects: [
      { id: 'rrb-maths', name: 'Mathematics', topics: ['Arithmetic', 'Number System'] },
      { id: 'rrb-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Verbal Reasoning'] },
      { id: 'rrb-gk', name: 'General Awareness', topics: ['Current Affairs', 'General Science'] },
    ],
  },
  'ctet': {
    name: 'CTET',
    subjects: [
      { id: 'ctet-child-dev', name: 'Child Development', topics: ['Child Psychology', 'Learning Theories'] },
      { id: 'ctet-language-1', name: 'Language I', topics: ['Grammar', 'Comprehension'] },
      { id: 'ctet-language-2', name: 'Language II', topics: ['Grammar', 'Pedagogy'] },
    ],
  },
  'ca-foundation': {
    name: 'CA Foundation',
    subjects: [
      { id: 'ca-accounts', name: 'Accounting', topics: ['Basic Accounting', 'Final Accounts'] },
      { id: 'ca-law', name: 'Business Laws', topics: ['Indian Contract Act', 'Companies Act'] },
      { id: 'ca-maths', name: 'Business Mathematics', topics: ['Ratio & Proportion', 'Permutations', 'Statistics'] },
    ],
  },
};

// Convert to CSV
function convertToCSV(questions) {
  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail\n';
  const rows = questions.map(q => {
    const fields = [
      q.question, q.option_a, q.option_b, q.option_c, q.option_d,
      q.correct_answer, q.explanation, q.difficulty,
      q.exam_id, q.subject_id, q.topic, q.year, q.source_detail,
    ];
    return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
  });
  return header + rows.join('\n');
}

// Main
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║       PrepGenie - FREE Question Generation (Ollama)           ║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Check Ollama
  if (!checkOllama()) {
    console.log(`❌ Ollama not installed!

Please install Ollama first:
1. Visit: https://ollama.ai
2. Download and install
3. Run: ollama pull llama3.2
4. Then run this script again

Ollama is FREE and runs on your computer!
`);
    process.exit(1);
  }

  // Parse arguments
  const args = process.argv.slice(2);
  let examId = 'jee-main';
  let count = 20;
  let model = 'llama3.2';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--exam' && args[i + 1]) {
      examId = args[i + 1];
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--model' && args[i + 1]) {
      model = args[i + 1];
      i++;
    }
  }

  const exam = EXAMS[examId];
  if (!exam) {
    console.error(`❌ Unknown exam: ${examId}`);
    console.log(`Available: ${Object.keys(EXAMS).join(', ')}`);
    process.exit(1);
  }

  console.log(`Configuration:`);
  console.log(`  Exam:   ${exam.name}`);
  console.log(`  Count:  ${count} questions`);
  console.log(`  Model:  ${model} (local, FREE)`);
  console.log(`\n🚀 Starting generation...\n`);

  const allQuestions = [];
  const difficulties = ['easy', 'medium', 'hard'];

  // Generate questions
  for (let i = 0; i < count; i++) {
    const subject = exam.subjects[i % exam.subjects.length];
    const topic = subject.topics[i % subject.topics.length];
    const difficulty = difficulties[i % 3];

    const question = await generateQuestion(
      model,
      exam.name,
      subject.name,
      topic,
      difficulty,
      examId,
      subject.id
    );

    if (question) {
      allQuestions.push(question);
    }

    // Small delay to not overwhelm CPU
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   Generated: ${allQuestions.length} / ${count} questions`);

  if (allQuestions.length === 0) {
    console.log(`\n❌ No questions generated. Please check Ollama is running.`);
    process.exit(1);
  }

  // Save
  const outputDir = '.agents/artifacts/ollama-generated';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const csvPath = path.join(outputDir, `${examId}-${timestamp}.csv`);
  const csvContent = convertToCSV(allQuestions);
  fs.writeFileSync(csvPath, csvContent);

  console.log(`\n💾 Saved: ${csvPath}`);
  console.log(`\n📥 Auto-importing to question bank...`);

  // Auto-import
  try {
    execFileSync('node', ['scripts/import-questions.js', csvPath], { stdio: 'inherit' });
    console.log(`\n✅ Successfully imported to question bank!`);
  } catch (error) {
    console.log(`\n⚠️  Import failed. Manually import from: ${csvPath}`);
  }

  console.log(`\n🎉 Done! Run this script again anytime to generate more questions.`);
  console.log(`   Completely FREE - no API costs ever!\n`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
