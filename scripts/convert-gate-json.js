#!/usr/bin/env node

/**
 * Convert GATE PYQ JSON to PrepGenie CSV
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || '/tmp/prepgenie-github-hunt/gate-pyq-data/questions.json';

if (!fs.existsSync(inputPath)) {
  console.error('❌ File not found:', inputPath);
  process.exit(1);
}

console.log('📄 Reading GATE questions...');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const questions = data.questions || data;

console.log(`✅ Found ${questions.length} questions\n`);

// Convert to PrepGenie format
const converted = questions
  .filter(q => {
    return q.question && q.options && q.options.length >= 4 && q.answer;
  })
  .map(q => {
    // Map answer (A/B/C/D to 0/1/2/3)
    const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctAnswer = Array.isArray(q.answer.correct)
      ? answerMap[q.answer.correct[0]]
      : answerMap[q.answer];

    return {
      question: q.question.text || q.question,
      option_a: q.options[0]?.text || q.options[0],
      option_b: q.options[1]?.text || q.options[1],
      option_c: q.options[2]?.text || q.options[2],
      option_d: q.options[3]?.text || q.options[3],
      correct_answer: correctAnswer !== undefined ? correctAnswer : 0,
      explanation: q.explanation || 'Official GATE question - detailed solution available on GATE Overflow',
      difficulty: 'hard',
      exam_id: 'gate-cs',
      subject_id: (q.subject || 'computer-science').toLowerCase().replace(/\s+/g, '-'),
      topic: q.topic || 'General',
      year: q.year || '2024',
      source_detail: `GATE ${q.year || '2024'} ${q.subject || 'CS'} (GitHub: shaharyar797/gate-pyq-data)`,
      source_type: 'official',
      verified: true
    };
  });

// Write CSV
const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail,source_type,verified\n';
const rows = converted.map(q => {
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

const outputPath = `${outputDir}/gate-cs-pyq.csv`;
fs.writeFileSync(outputPath, csv);

console.log(`✅ Converted ${converted.length} questions`);
console.log(`💾 Saved: ${outputPath}`);
console.log(`\n📝 Next: Import to database:`);
console.log(`   node scripts/import-questions.js ${outputPath}`);
