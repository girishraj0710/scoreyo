#!/usr/bin/env node

/**
 * PrepGenie - FAST Question Generation with OpenRouter FREE Tier
 *
 * Uses Gemini Flash 2.0 (FREE, unlimited, fast)
 * Much more reliable than local Ollama
 *
 * Usage:
 *   node scripts/generate-openrouter-parallel.js --exam jee-main --count 500
 */

const fs = require('fs');
const path = require('path');

// Read API key from .env.local
let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/OPENROUTER_API_KEY=(.+)/);
    if (match) {
      OPENROUTER_API_KEY = match[1].trim();
    }
  } catch (err) {
    // Ignore
  }
}

if (!OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY not found in .env.local');
  process.exit(1);
}

// Call OpenRouter API
async function callOpenRouter(prompt) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie Question Generator',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free', // FREE tier, try this
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`   ❌ API Error: ${error.message}`);
    return null;
  }
}

// Generate question
async function generateQuestion(examName, subject, topic, difficulty, exam_id, subject_id) {
  const prompt = `Create a ${difficulty} difficulty multiple choice question for ${examName} exam.
Subject: ${subject}
Topic: ${topic}

Return ONLY this JSON (no markdown, no explanation):
{
  "question": "the question text",
  "option_a": "first option",
  "option_b": "second option",
  "option_c": "third option",
  "option_d": "fourth option",
  "correct_answer": 2,
  "explanation": "detailed explanation with reasoning and steps"
}

Requirements:
- correct_answer must be 0, 1, 2, or 3
- All 4 options must be realistic
- Explanation should be 80+ words
- Question should be exam-level difficulty`;

  console.log(`   Generating: ${topic} (${difficulty})...`);

  const response = await callOpenRouter(prompt);
  if (!response) return null;

  try {
    // Extract JSON
    let jsonText = response.trim();

    // Remove markdown if present
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

    // Validate correct_answer is 0-3
    const correctAnswer = parseInt(parsed.correct_answer);
    if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      console.log(`   ⚠️  Invalid correct_answer: ${parsed.correct_answer}`);
      return null;
    }

    console.log(`   ✅ Generated successfully`);

    return {
      question: parsed.question,
      option_a: parsed.option_a,
      option_b: parsed.option_b,
      option_c: parsed.option_c,
      option_d: parsed.option_d,
      correct_answer: correctAnswer,
      explanation: parsed.explanation,
      difficulty,
      exam_id,
      subject_id,
      topic,
      year: `AI Generated ${new Date().getFullYear()}`,
      source_detail: `AI-Generated Practice Question (Gemini)`,
      source_type: 'ai-generated',
      verified: false,
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

// Parse existing CSV
function parseExistingCSV(filepath) {
  if (!fs.existsSync(filepath)) {
    return [];
  }

  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length <= 1) {
    return [];
  }

  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      questions.push(line);
    }
  }

  return questions;
}

// Convert to CSV rows
function questionsToCSVRows(questions) {
  return questions.map(q => {
    const fields = [
      q.question, q.option_a, q.option_b, q.option_c, q.option_d,
      q.correct_answer, q.explanation, q.difficulty,
      q.exam_id, q.subject_id, q.topic, q.year, q.source_detail,
      q.source_type, q.verified,
    ];
    return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
  });
}

// Main
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║    PrepGenie - OpenRouter Generation (FREE, FAST!)           ║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Parse arguments
  const args = process.argv.slice(2);
  let examId = 'jee-main';
  let count = 500;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--exam' && args[i + 1]) {
      examId = args[i + 1];
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1]);
      i++;
    }
  }

  const exam = EXAMS[examId];
  if (!exam) {
    console.error(`❌ Unknown exam: ${examId}`);
    console.log(`Available: ${Object.keys(EXAMS).join(', ')}`);
    process.exit(1);
  }

  // Setup output
  const outputDir = '.agents/artifacts/ollama-generated';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvPath = path.join(outputDir, `${examId}.csv`);
  const existingRows = parseExistingCSV(csvPath);
  const existingCount = existingRows.length;

  console.log(`Configuration:`);
  console.log(`  Exam:     ${exam.name}`);
  console.log(`  Count:    ${count} NEW questions`);
  console.log(`  Model:    Gemini 2.0 Flash (FREE)`);
  console.log(`  File:     ${csvPath}`);
  console.log(`  Existing: ${existingCount} questions`);
  console.log(`  Total after: ${existingCount + count} questions`);
  console.log(`\n🚀 Starting generation...\n`);

  const newQuestions = [];
  const difficulties = ['easy', 'medium', 'hard'];

  // Generate questions
  for (let i = 0; i < count; i++) {
    const subject = exam.subjects[i % exam.subjects.length];
    const topic = subject.topics[i % subject.topics.length];
    const difficulty = difficulties[i % 3];

    const question = await generateQuestion(
      exam.name,
      subject.name,
      topic,
      difficulty,
      examId,
      subject.id
    );

    if (question) {
      newQuestions.push(question);
    }

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   Generated: ${newQuestions.length} / ${count} questions`);
  console.log(`   Success rate: ${Math.round(newQuestions.length / count * 100)}%`);

  if (newQuestions.length === 0) {
    console.log(`\n❌ No questions generated. Check API key and connection.`);
    process.exit(1);
  }

  // Append to file
  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';
  const newRows = questionsToCSVRows(newQuestions);

  let csvContent;
  if (existingCount === 0) {
    csvContent = header + newRows.join('\n') + '\n';
  } else {
    csvContent = fs.readFileSync(csvPath, 'utf8');
    if (!csvContent.endsWith('\n')) {
      csvContent += '\n';
    }
    csvContent += newRows.join('\n') + '\n';
  }

  fs.writeFileSync(csvPath, csvContent);

  console.log(`\n💾 Updated: ${csvPath}`);
  console.log(`   Previous: ${existingCount} questions`);
  console.log(`   Added:    ${newQuestions.length} questions`);
  console.log(`   Total:    ${existingCount + newQuestions.length} questions`);
  console.log(`\n🎉 Done!\n`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
