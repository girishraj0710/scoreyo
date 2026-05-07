#!/usr/bin/env node

/**
 * Convert Offline-Exam-Practice JSON to PrepGenie CSV
 */

const fs = require('fs');

const jsonPath = '/tmp/Offline-Exam-Practice/questions.json';

if (!fs.existsSync(jsonPath)) {
  console.error('❌ File not found. Clone first:');
  console.error('   cd /tmp && git clone https://github.com/SnakeEye-sudo/Offline-Exam-Practice.git');
  process.exit(1);
}

console.log('📄 Reading questions...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`✅ Found ${data.length} questions\n`);

// Map categories to exam IDs
const categoryMap = {
  'UPSC': 'upsc-cse',
  'BPSC': 'upsc-cse', // State PSC - similar to UPSC
  'GK': 'general-knowledge'
};

// Convert to CSV
const questions = data.map(q => {
  const examId = categoryMap[q.category] || 'general-knowledge';
  return {
    question: q.question,
    option_a: q.options[0] || '',
    option_b: q.options[1] || '',
    option_c: q.options[2] || '',
    option_d: q.options[3] || '',
    correct_answer: q.answer,
    explanation: 'NEEDS_AI_EXPLANATION',
    difficulty: 'medium',
    exam_id: examId,
    subject_id: q.category.toLowerCase(),
    topic: 'General',
    year: '2024',
    source_detail: 'GitHub: SnakeEye-sudo/Offline-Exam-Practice',
    source_type: 'community',
    verified: false
  };
});

// Write CSV
const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';
const rows = questions.map(q => {
  const fields = [
    q.question, q.option_a, q.option_b, q.option_c, q.option_d,
    q.correct_answer, q.explanation, q.difficulty,
    q.exam_id, q.subject_id, q.topic, q.year, q.source_detail,
    q.source_type, q.verified
  ];
  return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
});

const csv = header + rows.join('\n');

const outputDir = '.agents/artifacts/github-datasets';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = `${outputDir}/upsc-offline-practice.csv`;
fs.writeFileSync(outputPath, csv);

console.log(`✅ Converted ${questions.length} questions`);
console.log(`💾 Saved: ${outputPath}`);
console.log(`\n📝 Next: Generate AI explanations:`);
console.log(`   node scripts/generate-ai-explanations.js ${outputPath}`);
