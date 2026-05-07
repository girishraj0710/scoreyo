#!/usr/bin/env node

/**
 * PrepGenie - GitHub Dataset Converter
 * Converts downloaded GitHub exam JSON to PrepGenie CSV format
 */

const fs = require('fs');
const path = require('path');

function convertNIMCETtoCSV(jsonData, examId) {
  const questions = [];

  jsonData.sections.forEach(section => {
    section.questions.forEach(q => {
      // Map correct_opt_id to correct_answer (0-3)
      const correctOptId = q.correct_opt_id;
      const correctIndex = q.options.findIndex(opt => opt.opt_id === correctOptId);

      questions.push({
        question: q.question_text.replace(/\n/g, ' '),
        option_a: q.options[0]?.text || '',
        option_b: q.options[1]?.text || '',
        option_c: q.options[2]?.text || '',
        option_d: q.options[3]?.text || '',
        correct_answer: correctIndex,
        explanation: q.explanation || '',
        difficulty: jsonData.difficulty || 'medium',
        exam_id: examId,
        subject_id: section.section_name.toLowerCase().replace(/\s+/g, '-'),
        topic: section.section_name,
        year: '2025',
        source_detail: `GitHub: AdithSuresh2004/exam-questions (${jsonData.exam_name})`,
        source_type: 'community',
        verified: false
      });
    });
  });

  return questions;
}

function toCSV(questions) {
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

  return header + rows.join('\n');
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║      PrepGenie - GitHub Dataset Converter                     ║
╚═══════════════════════════════════════════════════════════════╝
`);

  const repoPath = '/tmp/exam-questions';

  if (!fs.existsSync(repoPath)) {
    console.error('❌ Repository not found. Clone first:');
    console.error('   cd /tmp && git clone https://github.com/AdithSuresh2004/exam-questions.git');
    process.exit(1);
  }

  // Find all JSON files
  const jsonFiles = [];
  function findJSON(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        findJSON(fullPath);
      } else if (file.endsWith('.json')) {
        jsonFiles.push(fullPath);
      }
    });
  }

  findJSON(repoPath);
  console.log(`✅ Found ${jsonFiles.length} JSON files\n`);

  const outputDir = '.agents/artifacts/github-datasets';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalQuestions = 0;

  jsonFiles.forEach(jsonPath => {
    console.log(`📄 Processing: ${path.basename(jsonPath)}`);

    try {
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const examId = jsonData.exam_id || path.basename(jsonPath, '.json');

      const questions = convertNIMCETtoCSV(jsonData, examId);
      console.log(`   ✅ Converted ${questions.length} questions`);

      const csvPath = path.join(outputDir, `${examId}.csv`);
      const csv = toCSV(questions);
      fs.writeFileSync(csvPath, csv);
      console.log(`   💾 Saved: ${csvPath}\n`);

      totalQuestions += questions.length;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  });

  console.log(`
✨ Conversion complete!

📊 Summary:
   Files processed:  ${jsonFiles.length}
   Total questions:  ${totalQuestions}
   Output directory: ${outputDir}

📝 Next step:
   Import to database:
   node scripts/import-questions.js ${outputDir}/*.csv

🎉 Done!
`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
