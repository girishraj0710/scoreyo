#!/usr/bin/env node

/**
 * PrepGenie - Generate Mock Test Questions with Together AI
 *
 * FREE $5 credit covers all 11,210 questions!
 * Fast: 600 RPM = 20 minutes total
 * Quality: Llama 3.1 8B (excellent for MCQs)
 *
 * Usage:
 *   node scripts/generate-with-together-ai.js <exam-id> <num-tests>
 *
 * Example:
 *   node scripts/generate-with-together-ai.js jee-main 10
 */

const fs = require('fs');
const path = require('path');

// Read Together AI API key
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const TOGETHER_API_KEY = envContent.match(/TOGETHER_API_KEY=(.+)/)?.[1]?.trim();

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found in .env.local');
  console.error('\n📝 Please add your Together AI API key:');
  console.error('   1. Sign up: https://api.together.xyz/signup');
  console.error('   2. Get API key from dashboard');
  console.error('   3. Add to .env.local: TOGETHER_API_KEY=your_key_here\n');
  process.exit(1);
}

// Mock test configurations (same as before)
const MOCK_TESTS = {
  'jee-main': {
    name: 'JEE Main',
    questionsPerTest: 75,
    subjects: [
      { id: 'physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'] },
      { id: 'chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'mathematics', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors'] },
    ],
    difficulty: 'hard',
  },
  'jee-advanced': {
    name: 'JEE Advanced',
    questionsPerTest: 75,
    subjects: [
      { id: 'physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'] },
      { id: 'chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'mathematics', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors'] },
    ],
    difficulty: 'hard',
  },
  'neet': {
    name: 'NEET',
    questionsPerTest: 180,
    subjects: [
      { id: 'physics', name: 'Physics', count: 45, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics'] },
      { id: 'chemistry', name: 'Chemistry', count: 45, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'biology', name: 'Biology', count: 45, topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology'] },
      { id: 'botany', name: 'Botany', count: 45, topics: ['Plant Physiology', 'Plant Anatomy', 'Plant Taxonomy'] },
    ],
    difficulty: 'hard',
  },
  'gate-cs': {
    name: 'GATE Computer Science',
    questionsPerTest: 65,
    subjects: [
      { id: 'ds', name: 'Data Structures', count: 10, topics: ['Arrays', 'Trees', 'Graphs', 'Hashing'] },
      { id: 'algorithms', name: 'Algorithms', count: 10, topics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy'] },
      { id: 'os', name: 'Operating Systems', count: 10, topics: ['Process Management', 'Memory Management', 'Deadlock'] },
      { id: 'dbms', name: 'DBMS', count: 10, topics: ['SQL', 'Normalization', 'Transactions'] },
      { id: 'cn', name: 'Computer Networks', count: 10, topics: ['TCP/IP', 'Routing', 'Network Security'] },
      { id: 'toc', name: 'Theory of Computation', count: 5, topics: ['Automata', 'Grammar', 'Turing Machine'] },
    ],
    difficulty: 'hard',
  },
  'upsc-cse': {
    name: 'UPSC CSE Prelims',
    questionsPerTest: 100,
    subjects: [
      { id: 'gs', name: 'General Studies', count: 100, topics: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs', 'Science & Tech'] },
    ],
    difficulty: 'medium',
  },
  'ssc-cgl': {
    name: 'SSC CGL',
    questionsPerTest: 100,
    subjects: [
      { id: 'reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Blood Relations'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'] },
      { id: 'english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography', 'Science'] },
    ],
    difficulty: 'medium',
  },
  'cat': {
    name: 'CAT',
    questionsPerTest: 66,
    subjects: [
      { id: 'varc', name: 'Verbal Ability', count: 22, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
      { id: 'dilr', name: 'Data Interpretation & Logical Reasoning', count: 22, topics: ['Data Interpretation', 'Logical Reasoning', 'Puzzles'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 22, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number System'] },
    ],
    difficulty: 'hard',
  },
  'sbi-po': {
    name: 'SBI PO',
    questionsPerTest: 100,
    subjects: [
      { id: 'reasoning', name: 'Reasoning', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic', 'Simplification'] },
      { id: 'english', name: 'English', count: 30, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
    ],
    difficulty: 'medium',
  },
  'ibps-po': {
    name: 'IBPS PO',
    questionsPerTest: 100,
    subjects: [
      { id: 'reasoning', name: 'Reasoning', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic', 'Simplification'] },
      { id: 'english', name: 'English', count: 30, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
    ],
    difficulty: 'medium',
  },
};

// Generate single question
async function generateQuestion(exam, subject, topic, difficulty) {
  const prompt = `Generate a high-quality ${difficulty} multiple choice question for ${exam.name} exam.

Subject: ${subject.name}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- Question should match real ${exam.name} exam pattern and difficulty
- Provide exactly 4 options (A, B, C, D)
- Mark the correct answer (0-3)
- Provide a clear, educational explanation (100+ words)
- Use proper formatting with numbers, equations where needed
- Make it challenging but fair
- Include step-by-step solution in explanation

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "question": "Clear question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed step-by-step explanation with reasoning"
}`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate
    if (!parsed.question || !parsed.options || parsed.options.length !== 4) {
      throw new Error('Invalid question format');
    }

    return {
      question: parsed.question,
      option_a: parsed.options[0],
      option_b: parsed.options[1],
      option_c: parsed.options[2],
      option_d: parsed.options[3],
      correct_answer: parsed.correctAnswer || 0,
      explanation: parsed.explanation || 'Detailed explanation provided.',
      difficulty,
      exam_id: exam.id,
      subject_id: subject.id,
      topic: topic,
      year: 'AI Generated 2026',
      source_detail: 'Together AI - Llama 3.1 8B',
      source_type: 'ai-practice',
      verified: false,
    };
  } catch (error) {
    console.error(`  ⚠️  Error: ${error.message}`);
    return null;
  }
}

// Generate with batching (50 parallel requests)
async function generateMockTest(examId, testNumber) {
  const exam = { ...MOCK_TESTS[examId], id: examId };
  console.log(`\n📝 Generating ${exam.name} Mock Test #${testNumber}...`);

  const allQuestions = [];
  const batchSize = 50; // Together AI allows 600 RPM

  for (const subject of exam.subjects) {
    console.log(`  📚 ${subject.name} (${subject.count} questions)...`);

    const questionsPerTopic = Math.ceil(subject.count / subject.topics.length);
    const requests = [];

    // Build all requests for this subject
    for (const topic of subject.topics) {
      for (let i = 0; i < questionsPerTopic && requests.length < subject.count; i++) {
        requests.push({ exam, subject, topic, difficulty: exam.difficulty });
      }
    }

    // Process in batches
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const promises = batch.map(req =>
        generateQuestion(req.exam, req.subject, req.topic, req.difficulty)
      );

      const results = await Promise.all(promises);
      const validQuestions = results.filter(q => q !== null);
      allQuestions.push(...validQuestions);

      process.stdout.write(`.`.repeat(validQuestions.length));

      // Small delay between batches
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(` ✅ ${subject.name} complete`);
  }

  return allQuestions;
}

// Save to CSV
function saveToCSV(questions, examId) {
  const outputDir = path.join(__dirname, '..', '.agents', 'artifacts', 'mock-test-questions');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${examId}-mock-tests.csv`;
  const filepath = path.join(outputDir, filename);

  // CSV header
  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';

  let csv = header;
  questions.forEach(q => {
    csv += [
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.option_a.replace(/"/g, '""')}"`,
      `"${q.option_b.replace(/"/g, '""')}"`,
      `"${q.option_c.replace(/"/g, '""')}"`,
      `"${q.option_d.replace(/"/g, '""')}"`,
      q.correct_answer,
      `"${q.explanation.replace(/"/g, '""')}"`,
      q.difficulty,
      q.exam_id,
      q.subject_id,
      `"${q.topic.replace(/"/g, '""')}"`,
      q.year,
      `"${q.source_detail.replace(/"/g, '""')}"`,
      q.source_type,
      q.verified
    ].join(',') + '\n';
  });

  fs.writeFileSync(filepath, csv);
  return filepath;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  PrepGenie - Together AI Question Generator                 ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    console.log('Usage: node scripts/generate-with-together-ai.js <exam-id> <num-tests>\n');
    console.log('Available exams:');
    Object.keys(MOCK_TESTS).forEach(id => {
      const exam = MOCK_TESTS[id];
      console.log(`  - ${id}: ${exam.name} (${exam.questionsPerTest} questions/test)`);
    });
    console.log('\nExample:');
    console.log('  node scripts/generate-with-together-ai.js jee-main 10\n');
    process.exit(1);
  }

  const examId = args[0];
  const numTests = parseInt(args[1]);

  if (!MOCK_TESTS[examId]) {
    console.error(`❌ Unknown exam: ${examId}`);
    console.error('Available: ' + Object.keys(MOCK_TESTS).join(', '));
    process.exit(1);
  }

  const exam = MOCK_TESTS[examId];
  const totalQuestions = exam.questionsPerTest * numTests;

  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log(`║  Generating ${exam.name} Mock Tests with Together AI       `);
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Plan:`);
  console.log(`   - ${numTests} mock tests`);
  console.log(`   - ${exam.questionsPerTest} questions per test`);
  console.log(`   - Total: ${totalQuestions} questions`);
  console.log(`   - Estimated time: ~${Math.ceil(totalQuestions / 600)} minutes (600 RPM)`);
  console.log(`   - Model: Llama 3.1 8B Turbo (FREE)\n`);

  const startTime = Date.now();
  const allQuestions = [];

  for (let i = 1; i <= numTests; i++) {
    const questions = await generateMockTest(examId, i);
    allQuestions.push(...questions);
  }

  const filepath = saveToCSV(allQuestions, examId);
  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ GENERATION COMPLETE!                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Summary:`);
  console.log(`   - Generated: ${allQuestions.length} questions`);
  console.log(`   - Time taken: ${Math.floor(duration / 60)}m ${duration % 60}s`);
  console.log(`   - Output: ${filepath}`);
  console.log(`\n📦 Next step: Import to database`);
  console.log(`   node scripts/import-questions.js ${filepath}\n`);
}

main().catch(console.error);
