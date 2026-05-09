#!/usr/bin/env node

/**
 * PrepGenie - Generate FULL-LENGTH Mock Tests with Together AI
 *
 * REAL exam patterns with actual question counts:
 * - JEE Main: 75 questions (25 each: Physics, Chemistry, Maths)
 * - NEET: 180 questions (45 each: Physics, Chemistry, Biology, Botany)
 * - CAT: 66 questions (22 each: Quant, VARC, DILR)
 *
 * Target: 11,210+ questions across major exams
 * Cost: ~$0.80 (uses $5 free credit)
 * Time: ~2-3 hours
 */

const fs = require('fs');
const path = require('path');

// Read API key
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const TOGETHER_API_KEY = envContent.match(/TOGETHER_API_KEY=(.+)/)?.[1]?.trim();

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

// FULL-LENGTH REAL MOCK TEST CONFIGURATIONS
const FULL_MOCK_TESTS = {
  'jee-main': {
    name: 'JEE Main',
    numTests: 10,
    questionsPerTest: 75,
    timeLimit: 180,
    subjects: [
      { id: 'jee-physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics', 'Waves', 'Kinematics', 'Gravitation'] },
      { id: 'jee-chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium'] },
      { id: 'jee-maths', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors', '3D Geometry', 'Probability', 'Matrices'] },
    ],
    difficulty: 'hard',
  },
  'jee-advanced': {
    name: 'JEE Advanced',
    numTests: 10,
    questionsPerTest: 75,
    timeLimit: 180,
    subjects: [
      { id: 'jee-adv-physics', name: 'Physics', count: 25, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics', 'Waves'] },
      { id: 'jee-adv-chemistry', name: 'Chemistry', count: 25, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'] },
      { id: 'jee-adv-maths', name: 'Mathematics', count: 25, topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors', '3D Geometry'] },
    ],
    difficulty: 'hard',
  },
  'neet-ug': {
    name: 'NEET UG',
    numTests: 10,
    questionsPerTest: 180,
    timeLimit: 180,
    subjects: [
      { id: 'neet-physics', name: 'Physics', count: 45, topics: ['Mechanics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Thermodynamics', 'Waves', 'Current Electricity'] },
      { id: 'neet-chemistry', name: 'Chemistry', count: 45, topics: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Chemical Kinetics', 'Electrochemistry'] },
      { id: 'neet-biology', name: 'Biology (Zoology)', count: 45, topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology', 'Reproduction', 'Biotechnology'] },
      { id: 'neet-botany', name: 'Biology (Botany)', count: 45, topics: ['Plant Physiology', 'Plant Anatomy', 'Plant Taxonomy', 'Plant Reproduction', 'Plant Kingdom'] },
    ],
    difficulty: 'hard',
  },
  'gate-cs': {
    name: 'GATE Computer Science',
    numTests: 10,
    questionsPerTest: 65,
    timeLimit: 180,
    subjects: [
      { id: 'gate-cs', name: 'Computer Science', count: 45, topics: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Theory of Computation', 'Compiler Design', 'Digital Logic', 'Computer Organization'] },
      { id: 'gate-aptitude', name: 'General Aptitude', count: 10, topics: ['Verbal Ability', 'Numerical Ability', 'Logical Reasoning'] },
      { id: 'gate-engineering-math', name: 'Engineering Mathematics', count: 10, topics: ['Linear Algebra', 'Calculus', 'Probability', 'Graph Theory', 'Discrete Mathematics'] },
    ],
    difficulty: 'hard',
  },
  'upsc-cse': {
    name: 'UPSC CSE Prelims',
    numTests: 15,
    questionsPerTest: 100,
    timeLimit: 120,
    subjects: [
      { id: 'upsc-gs', name: 'General Studies', count: 100, topics: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs', 'Science & Technology', 'Indian Culture', 'Art & Culture', 'International Relations'] },
    ],
    difficulty: 'medium',
  },
  'ssc-cgl': {
    name: 'SSC CGL',
    numTests: 10,
    questionsPerTest: 100,
    timeLimit: 60,
    subjects: [
      { id: 'ssc-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Puzzles'] },
      { id: 'ssc-quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation', 'Number System', 'Percentage', 'Profit & Loss'] },
      { id: 'ssc-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary', 'Comprehension', 'Sentence Correction', 'Fill in the Blanks'] },
      { id: 'ssc-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography', 'Science', 'Polity', 'Economics', 'Static GK'] },
    ],
    difficulty: 'medium',
  },
  'ssc-chsl': {
    name: 'SSC CHSL',
    numTests: 5,
    questionsPerTest: 100,
    timeLimit: 60,
    subjects: [
      { id: 'ssc-reasoning', name: 'Reasoning', count: 25, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Blood Relations'] },
      { id: 'ssc-quant', name: 'Quantitative Aptitude', count: 25, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'] },
      { id: 'ssc-english', name: 'English', count: 25, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'ssc-gk', name: 'General Knowledge', count: 25, topics: ['Current Affairs', 'History', 'Geography', 'Science'] },
    ],
    difficulty: 'medium',
  },
  'sbi-po': {
    name: 'SBI PO',
    numTests: 10,
    questionsPerTest: 100,
    timeLimit: 60,
    subjects: [
      { id: 'sbi-reasoning', name: 'Reasoning Ability', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations', 'Direction Sense', 'Coding-Decoding', 'Inequality'] },
      { id: 'sbi-quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic', 'Simplification', 'Number Series', 'Quadratic Equations'] },
      { id: 'sbi-english', name: 'English Language', count: 30, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Cloze Test', 'Error Spotting'] },
    ],
    difficulty: 'medium',
  },
  'ibps-po': {
    name: 'IBPS PO',
    numTests: 10,
    questionsPerTest: 100,
    timeLimit: 60,
    subjects: [
      { id: 'ibps-reasoning', name: 'Reasoning Ability', count: 35, topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Blood Relations'] },
      { id: 'ibps-quant', name: 'Quantitative Aptitude', count: 35, topics: ['Data Interpretation', 'Arithmetic', 'Simplification'] },
      { id: 'ibps-english', name: 'English Language', count: 30, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'] },
    ],
    difficulty: 'medium',
  },
  'cat': {
    name: 'CAT',
    numTests: 10,
    questionsPerTest: 66,
    timeLimit: 120,
    subjects: [
      { id: 'cat-varc', name: 'Verbal Ability & Reading Comprehension', count: 22, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Para Jumbles', 'Critical Reasoning'] },
      { id: 'cat-dilr', name: 'Data Interpretation & Logical Reasoning', count: 22, topics: ['Data Interpretation', 'Logical Reasoning', 'Puzzles', 'Seating Arrangement', 'Data Sufficiency'] },
      { id: 'cat-quant', name: 'Quantitative Aptitude', count: 22, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number System', 'Modern Math'] },
    ],
    difficulty: 'hard',
  },
  'clat': {
    name: 'CLAT',
    numTests: 5,
    questionsPerTest: 120,
    timeLimit: 120,
    subjects: [
      { id: 'clat-english', name: 'English', count: 30, topics: ['Comprehension', 'Grammar', 'Vocabulary'] },
      { id: 'clat-gk', name: 'Current Affairs & GK', count: 30, topics: ['Current Affairs', 'Static GK', 'Legal GK'] },
      { id: 'clat-legal', name: 'Legal Reasoning', count: 30, topics: ['Legal Principles', 'Case Studies', 'Legal Aptitude'] },
      { id: 'clat-logical', name: 'Logical Reasoning', count: 30, topics: ['Syllogism', 'Analytical Reasoning', 'Critical Reasoning'] },
    ],
    difficulty: 'medium',
  },
  'nda': {
    name: 'NDA',
    numTests: 5,
    questionsPerTest: 120,
    timeLimit: 150,
    subjects: [
      { id: 'nda-maths', name: 'Mathematics', count: 60, topics: ['Algebra', 'Trigonometry', 'Calculus', 'Matrices', 'Vectors', 'Statistics'] },
      { id: 'nda-gat', name: 'General Ability Test', count: 60, topics: ['English', 'General Knowledge', 'Physics', 'Chemistry', 'Geography', 'History', 'Polity'] },
    ],
    difficulty: 'medium',
  },
  'cds': {
    name: 'CDS',
    numTests: 5,
    questionsPerTest: 100,
    timeLimit: 120,
    subjects: [
      { id: 'cds-english', name: 'English', count: 34, topics: ['Grammar', 'Vocabulary', 'Comprehension'] },
      { id: 'cds-gk', name: 'General Knowledge', count: 33, topics: ['Current Affairs', 'History', 'Geography', 'Polity', 'Science'] },
      { id: 'cds-maths', name: 'Elementary Mathematics', count: 33, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry'] },
    ],
    difficulty: 'medium',
  },
  'rrb-ntpc': {
    name: 'RRB NTPC',
    numTests: 5,
    questionsPerTest: 100,
    timeLimit: 90,
    subjects: [
      { id: 'rrb-maths', name: 'Mathematics', count: 34, topics: ['Arithmetic', 'Algebra', 'Geometry', 'Number System'] },
      { id: 'rrb-reasoning', name: 'General Intelligence & Reasoning', count: 33, topics: ['Analogies', 'Series', 'Coding-Decoding', 'Puzzles'] },
      { id: 'rrb-gk', name: 'General Awareness', count: 33, topics: ['Current Affairs', 'History', 'Geography', 'Science', 'Polity'] },
    ],
    difficulty: 'easy',
  },
};

// Calculate totals
const totalTests = Object.values(FULL_MOCK_TESTS).reduce((sum, exam) => sum + exam.numTests, 0);
const totalQuestions = Object.values(FULL_MOCK_TESTS).reduce((sum, exam) => sum + (exam.numTests * exam.questionsPerTest), 0);

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  PrepGenie - FULL-LENGTH Mock Test Generator                ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');
console.log(`📊 Target:`);
console.log(`   - ${Object.keys(FULL_MOCK_TESTS).length} major exams`);
console.log(`   - ${totalTests} full-length mock tests`);
console.log(`   - ${totalQuestions} total questions`);
console.log(`   - Estimated time: ~${Math.ceil(totalQuestions / 600 * 10)} minutes`);
console.log(`   - Cost: ~$${(totalQuestions * 0.00007).toFixed(2)} (uses $5 free credit)\n`);

// Generate question
async function generateQuestion(examName, subjectName, topic, difficulty) {
  const prompt = `Generate a high-quality ${difficulty} difficulty multiple choice question for ${examName} exam.

Subject: ${subjectName}
Topic: ${topic}

Requirements:
- Match real ${examName} exam pattern and difficulty
- Provide exactly 4 options (A, B, C, D)
- Mark correct answer (0-3)
- Detailed explanation (100+ words with step-by-step reasoning)
- CRITICAL: Use ONLY plain text (no LaTeX, no backslashes, no special symbols)
- Write "alpha" not "\\alpha", write "degree" not "°", write "squared" not "^2"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "question": "Clear question in plain English",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation in plain English"
}`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Clean up response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.question || !parsed.options || parsed.options.length !== 4) {
      throw new Error('Invalid format');
    }

    return parsed;
  } catch (error) {
    return null;
  }
}

// Generate mock test
async function generateMockTest(examConfig, testNumber) {
  console.log(`\n📝 ${examConfig.name} - Test #${testNumber}/${examConfig.numTests} (${examConfig.questionsPerTest} questions)...`);

  const allQuestions = [];
  const batchSize = 20; // Parallel requests

  for (const subject of examConfig.subjects) {
    console.log(`  📚 ${subject.name} (${subject.count} questions)...`);

    const questionsPerTopic = Math.ceil(subject.count / subject.topics.length);
    const requests = [];

    for (const topic of subject.topics) {
      for (let i = 0; i < questionsPerTopic && requests.length < subject.count; i++) {
        requests.push({ topic, subjectName: subject.name, subjectId: subject.id });
      }
    }

    // Process in batches
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const promises = batch.map(req =>
        generateQuestion(examConfig.name, req.subjectName, req.topic, examConfig.difficulty)
      );

      const results = await Promise.all(promises);

      results.forEach((result, idx) => {
        if (result) {
          allQuestions.push({
            question: result.question,
            option_a: result.options[0],
            option_b: result.options[1],
            option_c: result.options[2],
            option_d: result.options[3],
            correct_answer: result.correctAnswer || 0,
            explanation: result.explanation,
            difficulty: examConfig.difficulty,
            exam_id: examConfig.id,
            subject_id: batch[idx].subjectId,
            topic: batch[idx].topic,
            year: 'AI Generated 2026',
            source_detail: 'Together AI - Qwen 2.5 7B',
            source_type: 'ai-practice',
            verified: false,
          });
          process.stdout.write('.');
        } else {
          process.stdout.write('x');
        }
      });

      // Delay between batches
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log(` ✅`);
  }

  return allQuestions;
}

// Save to CSV
function saveToCSV(questions, examId) {
  const outputDir = path.join(__dirname, '..', '.agents', 'artifacts', 'full-mock-tests');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${examId}-full-mock-tests.csv`;
  const filepath = path.join(outputDir, filename);

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

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/generate-full-mock-tests-together.js <exam-id> <num-tests>');
    console.log('  node scripts/generate-full-mock-tests-together.js all\n');
    console.log('Available exams:');
    Object.keys(FULL_MOCK_TESTS).forEach(id => {
      const exam = FULL_MOCK_TESTS[id];
      console.log(`  ${id}: ${exam.name} (${exam.numTests} tests × ${exam.questionsPerTest} Q = ${exam.numTests * exam.questionsPerTest} total)`);
    });
    process.exit(0);
  }

  const startTime = Date.now();
  let totalGenerated = 0;
  const examsToGenerate = args[0] === 'all' ? Object.keys(FULL_MOCK_TESTS) : [args[0]];

  for (const examId of examsToGenerate) {
    const examConfig = { ...FULL_MOCK_TESTS[examId], id: examId };
    if (!examConfig.name) continue;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📋 ${examConfig.name} (${examConfig.numTests} tests × ${examConfig.questionsPerTest} Q = ${examConfig.numTests * examConfig.questionsPerTest} total)`);
    console.log('='.repeat(70));

    const allQuestions = [];
    const numTests = args[1] ? parseInt(args[1]) : examConfig.numTests;

    for (let testNum = 1; testNum <= numTests; testNum++) {
      const questions = await generateMockTest(examConfig, testNum);
      allQuestions.push(...questions);
      totalGenerated += questions.length;
    }

    const filepath = saveToCSV(allQuestions, examId);
    console.log(`\n  ✅ ${examConfig.name}: ${allQuestions.length} questions saved to ${path.basename(filepath)}`);
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ GENERATION COMPLETE!                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Summary:`);
  console.log(`   - Generated: ${totalGenerated} questions`);
  console.log(`   - Time: ${Math.floor(duration / 60)}m ${duration % 60}s`);
  console.log(`   - Output: .agents/artifacts/full-mock-tests/\n`);
}

main().catch(console.error);
