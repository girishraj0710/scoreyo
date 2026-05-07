#!/usr/bin/env node

/**
 * PrepGenie - AI Explanation Generator
 *
 * Takes official questions (from PDFs) and generates detailed explanations
 * This makes the content legal: Official questions + Our AI explanations
 *
 * Usage:
 *   node scripts/generate-ai-explanations.js input.csv
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
async function generateExplanation(question, options, correctAnswer, examName, subject) {
  const prompt = `You are an expert teacher explaining ${examName} exam questions.

Question: ${question}

Options:
A) ${options[0]}
B) ${options[1]}
C) ${options[2]}
D) ${options[3]}

Correct Answer: ${['A', 'B', 'C', 'D'][correctAnswer]}

Generate a detailed, educational explanation (100-150 words) that:
1. States why the correct answer is right
2. Explains the underlying concept
3. Shows calculation/logic steps if applicable
4. Explains why other options are incorrect
5. Provides formula/rule if relevant

Return ONLY the explanation text (no JSON, no markdown, just the explanation).`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://prepgenie.co.in',
        'X-Title': 'PrepGenie Explanation Generator',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

// Parse CSV
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const question = {};
    headers.forEach((header, index) => {
      question[header] = values[index].trim().replace(/^"|"$/g, '');
    });
    questions.push(question);
  }

  return questions;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// Convert to CSV
function toCSV(questions) {
  const headers = Object.keys(questions[0]);
  const rows = questions.map(q => {
    return headers.map(h => {
      const value = String(q[h] || '');
      return `"${value.replace(/"/g, '""')}"`;
    }).join(',');
  });

  return headers.join(',') + '\n' + rows.join('\n');
}

async function main() {
  if (process.argv.length < 3) {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║      PrepGenie - AI Explanation Generator                     ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  node scripts/generate-ai-explanations.js <input-csv>

Input CSV must have:
  - question
  - option_a, option_b, option_c, option_d
  - correct_answer (0, 1, 2, or 3)
  - explanation (can be empty or "NEEDS_AI_EXPLANATION")

This will:
  1. Generate AI explanations for questions that need them
  2. Save updated CSV with explanations
  3. Mark as "Official Question + AI Explanation"

Example:
  node scripts/generate-ai-explanations.js extracted-upsc.csv
`);
    process.exit(0);
  }

  const inputPath = process.argv[2];

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║      PrepGenie - AI Explanation Generator                     ║
╚═══════════════════════════════════════════════════════════════╝

Input: ${inputPath}

🚀 Processing...
`);

  // Read CSV
  const content = fs.readFileSync(inputPath, 'utf8');
  const questions = parseCSV(content);

  console.log(`✅ Found ${questions.length} questions\n`);

  // Generate explanations
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    // Check if needs explanation
    if (q.explanation &&
        q.explanation !== 'NEEDS_AI_EXPLANATION' &&
        q.explanation.length > 20) {
      console.log(`   [${i+1}/${questions.length}] ⏭️  Skipping (has explanation)`);
      skipped++;
      continue;
    }

    // Check if has correct answer
    const correctAnswer = parseInt(q.correct_answer);
    if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      console.log(`   [${i+1}/${questions.length}] ⚠️  Skipping (no correct answer set)`);
      skipped++;
      continue;
    }

    console.log(`   [${i+1}/${questions.length}] 🤖 Generating explanation...`);

    const explanation = await generateExplanation(
      q.question,
      [q.option_a, q.option_b, q.option_c, q.option_d],
      correctAnswer,
      q.exam_id || 'Competitive Exam',
      q.subject_id || 'General'
    );

    if (explanation) {
      q.explanation = explanation;
      q.source_detail = q.source_detail.replace('NEEDS_AI_EXPLANATION', '') + ' - Explanation by AI';
      generated++;
      console.log(`   ✅ Generated`);
    } else {
      failed++;
      console.log(`   ❌ Failed`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`
✨ Complete!

📊 Summary:
   Total questions:      ${questions.length}
   Explanations generated: ${generated}
   Skipped (had explanations): ${skipped}
   Failed:               ${failed}
`);

  // Save updated CSV
  const outputPath = inputPath.replace('.csv', '-with-explanations.csv');
  const csv = toCSV(questions);
  fs.writeFileSync(outputPath, csv);

  console.log(`💾 Saved: ${outputPath}

📝 Next step:
   Import to database:
   node scripts/import-questions.js ${outputPath}

🎉 Done!
`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
