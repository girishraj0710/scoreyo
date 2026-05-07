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

// Exam configurations
const EXAMS = {
  'jee-main': {
    name: 'JEE Main',
    subjects: [
      { id: 'jee-physics', name: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electricity'] },
      { id: 'jee-chemistry', name: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry'] },
      { id: 'jee-maths', name: 'Mathematics', topics: ['Algebra', 'Calculus', 'Trigonometry'] },
    ],
  },
  'neet-ug': {
    name: 'NEET UG',
    subjects: [
      { id: 'neet-physics', name: 'Physics', topics: ['Mechanics', 'Optics'] },
      { id: 'neet-chemistry', name: 'Chemistry', topics: ['Organic Chemistry', 'Inorganic Chemistry'] },
      { id: 'neet-biology', name: 'Biology', topics: ['Cell Biology', 'Genetics', 'Human Physiology'] },
    ],
  },
  'upsc-cse': {
    name: 'UPSC CSE',
    subjects: [
      { id: 'upsc-history', name: 'History', topics: ['Ancient India', 'Modern India'] },
      { id: 'upsc-polity', name: 'Polity', topics: ['Constitution', 'Governance'] },
    ],
  },
  'ssc-cgl': {
    name: 'SSC CGL',
    subjects: [
      { id: 'ssc-quant', name: 'Quantitative Aptitude', topics: ['Arithmetic', 'Algebra'] },
      { id: 'ssc-reasoning', name: 'Reasoning', topics: ['Logical Reasoning', 'Verbal Reasoning'] },
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
