#!/usr/bin/env node

/**
 * Generate Mock Test Questions for ALL Exams from mock-test-config.ts
 * Uses Together AI (FREE $5 credit)
 * Generates exactly what your app needs!
 */

const fs = require('fs');
const path = require('path');

// Read Together AI API key
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const TOGETHER_API_KEY = envContent.match(/TOGETHER_API_KEY=(.+)/)?.[1]?.trim();

if (!TOGETHER_API_KEY) {
  console.error('❌ TOGETHER_API_KEY not found');
  process.exit(1);
}

// Read mock test configs from the actual config file
const configPath = path.join(__dirname, '..', 'src', 'lib', 'mock-test-config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract all mock test configs
const mockTestRegex = /{[^}]*examId:\s*"([^"]+)"[^}]*examName:\s*"([^"]+)"[^}]*testNumber:\s*(\d+)[^}]*totalQuestions:\s*(\d+)[^}]*timeLimitMinutes:\s*(\d+)[^}]*sections:\s*\[([^\]]+)\][^}]*}/g;

const mockTests = [];
let match;

while ((match = mockTestRegex.exec(configContent)) !== null) {
  const examId = match[1];
  const examName = match[2];
  const testNumber = parseInt(match[3]);
  const totalQuestions = parseInt(match[4]);
  const timeLimit = parseInt(match[5]);
  const sectionsStr = match[6];

  // Parse sections
  const sections = [];
  const sectionRegex = /{[^}]*subjectId:\s*"([^"]+)"[^}]*subjectName:\s*"([^"]+)"[^}]*questionCount:\s*(\d+)[^}]*}/g;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(sectionsStr)) !== null) {
    sections.push({
      subjectId: sectionMatch[1],
      subjectName: sectionMatch[2],
      questionCount: parseInt(sectionMatch[3])
    });
  }

  mockTests.push({
    examId,
    examName,
    testNumber,
    totalQuestions,
    timeLimit,
    sections
  });
}

console.log(`✅ Loaded ${mockTests.length} mock tests from config\n`);

// Group by exam
const examGroups = {};
mockTests.forEach(test => {
  if (!examGroups[test.examId]) {
    examGroups[test.examId] = [];
  }
  examGroups[test.examId].push(test);
});

const uniqueExams = Object.keys(examGroups).length;
const totalQuestions = mockTests.reduce((sum, test) => sum + test.totalQuestions, 0);

console.log(`📊 Summary:`);
console.log(`   - ${uniqueExams} unique exams`);
console.log(`   - ${mockTests.length} total mock tests`);
console.log(`   - ${totalQuestions} total questions to generate\n`);

// Generate question using Together AI
async function generateQuestion(examName, subjectName, difficulty = 'medium') {
  const prompt = `Generate a high-quality ${difficulty} multiple choice question for ${examName} exam.

Subject: ${subjectName}
Difficulty: ${difficulty}

Requirements:
- Question should match real ${examName} exam pattern
- Provide exactly 4 options (A, B, C, D)
- Mark the correct answer (0-3)
- Provide a clear, educational explanation (100+ words with reasoning)
- IMPORTANT: Do NOT use LaTeX, special symbols, or backslashes
- Use plain text only (write "alpha" not "\\alpha", write "degree" not "°")
- Use simple formatting (no complex math notation)

Return ONLY valid JSON in this exact format (no markdown, no extra text, no escape characters):
{
  "question": "Clear question text here in plain English",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed step-by-step explanation in plain English"
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
      const error = await response.text();
      throw new Error(`API error ${response.status}: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.question || !parsed.options || parsed.options.length !== 4) {
      throw new Error('Invalid format');
    }

    return parsed;
  } catch (error) {
    console.error(`  ⚠️  Error: ${error.message}`);
    return null;
  }
}

// Generate all questions for one mock test
async function generateMockTest(mockTest) {
  console.log(`\n📝 ${mockTest.examName} - Test #${mockTest.testNumber} (${mockTest.totalQuestions} questions)...`);

  const allQuestions = [];
  const batchSize = 10; // Process 10 at a time to avoid rate limits

  for (const section of mockTest.sections) {
    console.log(`  📚 ${section.subjectName} (${section.questionCount} questions)...`);

    const requests = [];
    for (let i = 0; i < section.questionCount; i++) {
      requests.push({
        examName: mockTest.examName,
        subjectName: section.subjectName,
        subjectId: section.subjectId
      });
    }

    // Process in batches
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const promises = batch.map(req =>
        generateQuestion(req.examName, req.subjectName)
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
            difficulty: 'medium',
            exam_id: mockTest.examId,
            subject_id: batch[idx].subjectId,
            topic: section.subjectName,
            year: 'AI Generated 2026',
            source_detail: 'Together AI - Qwen 2.5 7B',
            source_type: 'ai-practice',
            verified: false,
          });
          process.stdout.write('.');
        }
      });

      // Small delay between batches
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(` ✅`);
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
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  PrepGenie - Generate ALL Mock Tests with Together AI       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();
  let totalGenerated = 0;
  const examOutputs = {};

  // Process each exam
  for (const examId of Object.keys(examGroups)) {
    const tests = examGroups[examId];
    const allQuestionsForExam = [];

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Exam: ${tests[0].examName} (${tests.length} tests)`);
    console.log('='.repeat(60));

    for (const test of tests) {
      const questions = await generateMockTest(test);
      allQuestionsForExam.push(...questions);
      totalGenerated += questions.length;
    }

    // Save all questions for this exam
    const filepath = saveToCSV(allQuestionsForExam, examId);
    examOutputs[examId] = {
      name: tests[0].examName,
      tests: tests.length,
      questions: allQuestionsForExam.length,
      file: filepath
    };

    console.log(`\n  ✅ ${tests[0].examName}: ${allQuestionsForExam.length} questions saved`);
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ALL MOCK TESTS GENERATED!                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📊 Final Summary:`);
  console.log(`   - Total exams: ${Object.keys(examOutputs).length}`);
  console.log(`   - Total tests: ${mockTests.length}`);
  console.log(`   - Total questions: ${totalGenerated}`);
  console.log(`   - Time taken: ${Math.floor(duration / 60)}m ${duration % 60}s`);
  console.log(`   - Output: .agents/artifacts/mock-test-questions/\n`);

  console.log(`📁 Generated files:`);
  Object.values(examOutputs).forEach(output => {
    console.log(`   - ${output.name}: ${output.questions} questions`);
  });

  console.log(`\n📦 Next step: Import to database`);
  console.log(`   node scripts/import-all-mock-tests.js\n`);
}

main().catch(console.error);
