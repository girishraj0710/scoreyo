#!/usr/bin/env node

/**
 * Generate AI Mock Test Questions for PrepGenie
 * High-quality questions that match real exam patterns
 */

const fs = require('fs');
const path = require('path');

// Read OpenRouter API key
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKey = envContent.match(/OPENROUTER_API_KEY=(.+)/)?.[1]?.trim();

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY not found in .env.local');
  process.exit(1);
}

// Mock test configurations
const MOCK_TESTS = {
  'jee-main': {
    name: 'JEE Main',
    questionsPerTest: 75,
    numTests: 10,
    subjects: [
      { id: 'physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics'] },
      { id: 'chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'mathematics', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors'] },
    ],
    difficulty: 'hard',
    timeLimit: 180,
  },
  'neet': {
    name: 'NEET',
    questionsPerTest: 180,
    numTests: 10,
    subjects: [
      { id: 'physics', name: 'Physics', count: 45, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics'] },
      { id: 'chemistry', name: 'Chemistry', count: 45, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'biology', name: 'Biology', count: 45, topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology'] },
      { id: 'botany', name: 'Botany', count: 45, topics: ['Plant Physiology', 'Plant Anatomy', 'Plant Taxonomy'] },
    ],
    difficulty: 'hard',
    timeLimit: 180,
  },
  'upsc-cse': {
    name: 'UPSC CSE Prelims',
    questionsPerTest: 100,
    numTests: 15,
    subjects: [
      { id: 'gs', name: 'General Studies', count: 100, topics: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs', 'Science & Tech'] },
    ],
    difficulty: 'medium',
    timeLimit: 120,
  },
  'gate-cs': {
    name: 'GATE Computer Science',
    questionsPerTest: 65,
    numTests: 10,
    subjects: [
      { id: 'ds', name: 'Data Structures', count: 10, topics: ['Arrays', 'Trees', 'Graphs', 'Hashing'] },
      { id: 'algorithms', name: 'Algorithms', count: 10, topics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy'] },
      { id: 'os', name: 'Operating Systems', count: 10, topics: ['Process Management', 'Memory Management', 'Deadlock'] },
      { id: 'dbms', name: 'DBMS', count: 10, topics: ['SQL', 'Normalization', 'Transactions'] },
      { id: 'cn', name: 'Computer Networks', count: 10, topics: ['TCP/IP', 'Routing', 'Network Security'] },
      { id: 'toc', name: 'Theory of Computation', count: 10, topics: ['Automata', 'Grammar', 'Turing Machine'] },
      { id: 'aptitude', name: 'Aptitude', count: 5, topics: ['Numerical Ability', 'Logical Reasoning'] },
    ],
    difficulty: 'hard',
    timeLimit: 180,
  },
  'ssc-cgl': {
    name: 'SSC CGL',
    questionsPerTest: 100,
    numTests: 10,
    subjects: [
      { id: 'reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Blood Relations'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'] },
      { id: 'english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography', 'Science'] },
    ],
    difficulty: 'medium',
    timeLimit: 60,
  },
  'cat': {
    name: 'CAT',
    questionsPerTest: 66,
    numTests: 10,
    subjects: [
      { id: 'varc', name: 'Verbal Ability', count: 22, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
      { id: 'dilr', name: 'Data Interpretation & Logical Reasoning', count: 22, topics: ['Data Interpretation', 'Logical Reasoning', 'Puzzles'] },
      { id: 'quant', name: 'Quantitative Aptitude', count: 22, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number System'] },
    ],
    difficulty: 'hard',
    timeLimit: 120,
  },
};

async function generateQuestion(exam, subject, topic, difficulty) {
  const prompt = `Generate a high-quality ${difficulty} multiple choice question for ${exam.name} exam.

Subject: ${subject.name}
Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- Question should match real ${exam.name} exam pattern
- Provide exactly 4 options (A, B, C, D)
- Mark the correct answer
- Provide a clear, educational explanation
- Use proper formatting with numbers, equations where needed
- Make it challenging but fair

Return ONLY valid JSON in this exact format:
{
  "question": "Clear question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed step-by-step explanation",
  "topic": "${topic}"
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',  // FREE tier - try Llama
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
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
      topic: parsed.topic || topic,
      year: 'AI Generated 2026',
      source_detail: 'AI-Generated Practice Question for Mock Tests',
      source_type: 'ai-practice',
      verified: false,
    };
  } catch (error) {
    console.error(`  ⚠️  Error generating question: ${error.message}`);
    return null;
  }
}

async function generateMockTest(examId, testNumber) {
  const exam = { ...MOCK_TESTS[examId], id: examId };
  console.log(`\n📝 Generating ${exam.name} Mock Test #${testNumber}...`);

  const questions = [];

  for (const subject of exam.subjects) {
    console.log(`  📚 ${subject.name} (${subject.count} questions)...`);

    const questionsPerTopic = Math.ceil(subject.count / subject.topics.length);

    for (const topic of subject.topics) {
      for (let i = 0; i < questionsPerTopic && questions.length < subject.count * exam.subjects.indexOf(subject) + subject.count; i++) {
        const question = await generateQuestion(exam, subject, topic, exam.difficulty);

        if (question) {
          questions.push(question);
          process.stdout.write('.');
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    console.log(` ✅ ${subject.name} complete`);
  }

  return questions;
}

async function generateAllMockTests(examId, numTests = null) {
  const exam = MOCK_TESTS[examId];
  if (!exam) {
    console.error(`❌ Unknown exam: ${examId}`);
    return;
  }

  const testsToGenerate = numTests || exam.numTests;
  const allQuestions = [];

  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  Generating ${exam.name} Mock Tests                            `);
  console.log(`╚═══════════════════════════════════════════════════════════════╝`);
  console.log(`\n📊 Plan:`);
  console.log(`   - ${testsToGenerate} mock tests`);
  console.log(`   - ${exam.questionsPerTest} questions per test`);
  console.log(`   - Total: ${testsToGenerate * exam.questionsPerTest} questions`);
  console.log(`   - Time limit: ${exam.timeLimit} minutes`);

  for (let i = 1; i <= testsToGenerate; i++) {
    const questions = await generateMockTest(examId, i);
    allQuestions.push(...questions);

    console.log(`\n  ✅ Mock Test #${i} complete (${questions.length} questions)`);
    console.log(`  📊 Total so far: ${allQuestions.length} questions`);
  }

  // Save to CSV
  const outputDir = '.agents/artifacts/mock-test-questions';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';
  const rows = allQuestions.map(q => {
    const fields = [
      q.question, q.option_a, q.option_b, q.option_c, q.option_d,
      q.correct_answer, q.explanation, q.difficulty,
      q.exam_id, q.subject_id, q.topic, q.year, q.source_detail,
      q.source_type, q.verified
    ];
    return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
  });

  const csv = header + rows.join('\n');
  const outputPath = `${outputDir}/${examId}-mock-tests.csv`;
  fs.writeFileSync(outputPath, csv);

  console.log(`\n✅ Generation complete!`);
  console.log(`   Total questions: ${allQuestions.length}`);
  console.log(`   Saved to: ${outputPath}`);
  console.log(`\n📝 Next: Import to database:`);
  console.log(`   node scripts/import-questions.js ${outputPath}`);
}

// Main execution
const exam = process.argv[2];
const numTests = parseInt(process.argv[3]) || null;

if (!exam) {
  console.log('Usage: node generate-mock-test-questions.js <exam-id> [num-tests]');
  console.log('\nAvailable exams:');
  Object.entries(MOCK_TESTS).forEach(([id, config]) => {
    console.log(`  ${id.padEnd(15)} - ${config.name} (${config.questionsPerTest} q/test, ${config.numTests} tests)`);
  });
  process.exit(1);
}

generateAllMockTests(exam, numTests)
  .then(() => {
    console.log('\n🎉 Done!');
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
