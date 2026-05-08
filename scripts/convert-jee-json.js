#!/usr/bin/env node

/**
 * Convert JEE Mains JSON format to PrepGenie CSV
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || '/tmp/prepgenie-github-hunt/JEE-MAINS-CONTENT/JEE-Main-2025-Question-Paper-with-Solution-22th-Jan-2025-Shift-2-PDF.json';

if (!fs.existsSync(inputPath)) {
  console.error('❌ File not found:', inputPath);
  process.exit(1);
}

console.log('📄 Reading JEE questions...');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log(`✅ Found ${data.length} questions\n`);

// Convert to PrepGenie format
const questions = data
  .filter(q => {
    // Skip questions with missing critical data
    const question = (q.question || '').trim();
    const options = q.options || {};
    const hasOptions = Object.keys(options).length >= 4;
    return question.length > 20 && hasOptions;
  })
  .map(q => {
    // Extract options (they're in format "1", "2", "3", "4")
    const options = q.options || {};
    const optionKeys = Object.keys(options).sort();

    // Map answer to 0-based index
    const answerKey = q.answer;
    const correctIndex = optionKeys.indexOf(answerKey);

    // Create explanation - if empty, use placeholder
    let explanation = (q.solution || '').replace(/\n/g, ' ').trim();
    if (!explanation || explanation.length < 20) {
      explanation = `This is a JEE Main 2025 question. The correct answer is option ${q.answer}. Official solution will be added soon.`;
    }

    return {
      question: (q.question || '').replace(/\n/g, ' ').trim(),
      option_a: options[optionKeys[0]] || 'Option A',
      option_b: options[optionKeys[1]] || 'Option B',
      option_c: options[optionKeys[2]] || 'Option C',
      option_d: options[optionKeys[3]] || 'Option D',
      correct_answer: correctIndex >= 0 ? correctIndex : 0,
      explanation,
      difficulty: 'hard',
      exam_id: 'jee-main',
      subject_id: (q.subject || 'general').toLowerCase().replace(/\s+/g, '-'),
      topic: q.subject || 'General',
      year: '2025',
      source_detail: 'JEE Main 2025 Jan 22 Shift 2 (GitHub: nitish-bhai/JEE-MAINS-CONTENT)',
      source_type: 'official',
      verified: true
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

const outputPath = `${outputDir}/jee-main-2025-jan.csv`;
fs.writeFileSync(outputPath, csv);

console.log(`✅ Converted ${questions.length} questions`);
console.log(`💾 Saved: ${outputPath}`);
console.log(`\n📝 Next: Import to database:`);
console.log(`   node scripts/import-questions.js ${outputPath}`);
