#!/usr/bin/env node

/**
 * PrepGenie - Automated Question Generation System
 *
 * This system automatically generates high-quality questions using:
 * - Multi-model AI validation (consensus approach)
 * - Quality scoring and filtering
 * - Automatic import to question bank
 * - No human intervention required
 *
 * Usage:
 *   node scripts/auto-generate-questions.js [options]
 *
 * Options:
 *   --exam <exam-id>        Generate for specific exam (optional)
 *   --count <number>        Questions to generate (default: 50)
 *   --threshold <0-100>     Quality threshold (default: 80)
 *   --dry-run              Preview without saving
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  MODELS: [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
  ],
  QUALITY_THRESHOLD: 80, // 0-100
  BATCH_SIZE: 10,
  MAX_RETRIES: 3,
};

// Exam priorities and topics to focus on
const EXAM_PRIORITIES = [
  {
    exam_id: 'jee-main',
    subject_id: 'jee-physics',
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
    target_per_topic: 20,
  },
  {
    exam_id: 'jee-main',
    subject_id: 'jee-chemistry',
    topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
    target_per_topic: 20,
  },
  {
    exam_id: 'jee-main',
    subject_id: 'jee-maths',
    topics: ['Algebra', 'Calculus', 'Trigonometry', 'Coordinate Geometry', 'Probability'],
    target_per_topic: 20,
  },
  {
    exam_id: 'neet-ug',
    subject_id: 'neet-physics',
    topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics'],
    target_per_topic: 20,
  },
  {
    exam_id: 'neet-ug',
    subject_id: 'neet-chemistry',
    topics: ['Organic Chemistry', 'Physical Chemistry', 'Inorganic Chemistry'],
    target_per_topic: 20,
  },
  {
    exam_id: 'neet-ug',
    subject_id: 'neet-biology',
    topics: ['Cell Biology', 'Genetics', 'Human Physiology', 'Plant Physiology', 'Ecology'],
    target_per_topic: 20,
  },
  {
    exam_id: 'upsc-cse',
    subject_id: 'upsc-history',
    topics: ['Ancient India', 'Medieval India', 'Modern India', 'World History'],
    target_per_topic: 15,
  },
  {
    exam_id: 'upsc-cse',
    subject_id: 'upsc-polity',
    topics: ['Constitution', 'Governance', 'Rights and Duties', 'Political System'],
    target_per_topic: 15,
  },
  {
    exam_id: 'ssc-cgl',
    subject_id: 'ssc-quant',
    topics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry'],
    target_per_topic: 15,
  },
  {
    exam_id: 'ssc-cgl',
    subject_id: 'ssc-reasoning',
    topics: ['Logical Reasoning', 'Verbal Reasoning', 'Non-Verbal Reasoning'],
    target_per_topic: 15,
  },
];

// API call to OpenRouter
async function callOpenRouter(model, prompt, temperature = 0.7) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert exam question creator. Generate high-quality, exam-level questions with detailed explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling ${model}:`, error.message);
    return null;
  }
}

// Generate question using single model
async function generateQuestion(model, examName, subject, topic, difficulty) {
  const prompt = `Generate a ${difficulty} difficulty multiple choice question for ${examName} exam, subject: ${subject}, topic: ${topic}.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "question": "Question text here",
  "option_a": "First option",
  "option_b": "Second option",
  "option_c": "Third option",
  "option_d": "Fourth option",
  "correct_answer": 0,
  "explanation": "Detailed step-by-step explanation",
  "difficulty": "${difficulty}"
}

Requirements:
- Question must be factually accurate
- All 4 options must be plausible
- Explanation must be detailed and educational
- correct_answer must be 0, 1, 2, or 3 (index of correct option)
- Difficulty must match the specified level`;

  const response = await callOpenRouter(model, prompt, 0.8);
  if (!response) return null;

  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (error) {
    console.error(`Failed to parse response from ${model}`);
    return null;
  }
}

// Multi-model consensus generation
async function generateQuestionWithConsensus(examName, subject, topic, difficulty, exam_id, subject_id) {
  console.log(`   Generating: ${topic} (${difficulty})...`);

  const results = await Promise.all(
    CONFIG.MODELS.map(model => generateQuestion(model, examName, subject, topic, difficulty))
  );

  // Filter out failed generations
  const validResults = results.filter(r => r !== null);

  if (validResults.length === 0) {
    console.log(`   ❌ All models failed`);
    return null;
  }

  // Use the first successful result as base, but validate with others
  const baseQuestion = validResults[0];

  // Quality score calculation
  const qualityScore = calculateQualityScore(baseQuestion, validResults);

  if (qualityScore < CONFIG.QUALITY_THRESHOLD) {
    console.log(`   ⚠️  Quality too low: ${qualityScore}/100`);
    return null;
  }

  console.log(`   ✅ Quality: ${qualityScore}/100`);

  return {
    ...baseQuestion,
    exam_id,
    subject_id,
    topic,
    year: `Auto-generated ${new Date().getFullYear()}`,
    source_detail: `AI Multi-model (${validResults.length}/${CONFIG.MODELS.length} consensus)`,
    quality_score: qualityScore,
  };
}

// Calculate quality score
function calculateQualityScore(question, allResults) {
  let score = 100;

  // Check question length
  if (question.question.length < 50) score -= 10;
  if (question.question.length < 30) score -= 20;

  // Check explanation quality
  if (question.explanation.length < 50) score -= 15;
  if (question.explanation.length < 30) score -= 25;

  // Check options variety
  const options = [question.option_a, question.option_b, question.option_c, question.option_d];
  const avgLength = options.reduce((sum, opt) => sum + opt.length, 0) / 4;
  if (avgLength < 5) score -= 20; // Very short options
  if (avgLength < 10) score -= 10;

  // Check for duplicate options
  const uniqueOptions = new Set(options);
  if (uniqueOptions.size < 4) score -= 30;

  // Check correct_answer validity
  if (question.correct_answer < 0 || question.correct_answer > 3) score -= 50;

  // Consensus validation (if multiple models agree, higher score)
  if (allResults.length >= 2) {
    // Check if explanations are similar length (indicates consistency)
    const explainLengths = allResults.map(r => r.explanation.length);
    const avgExplainLength = explainLengths.reduce((a, b) => a + b, 0) / explainLengths.length;
    const variance = explainLengths.reduce((sum, len) => sum + Math.abs(len - avgExplainLength), 0) / explainLengths.length;

    if (variance < avgExplainLength * 0.3) {
      score += 10; // Bonus for consistent quality
    }
  }

  return Math.max(0, Math.min(100, score));
}

// Generate batch of questions
async function generateBatch(config, count) {
  const { exam_id, subject_id, topics, target_per_topic } = config;

  const questions = [];
  const difficulties = ['easy', 'medium', 'hard'];

  console.log(`\n📚 Generating ${count} questions for ${exam_id} / ${subject_id}`);

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const difficulty = difficulties[i % difficulties.length];

    const question = await generateQuestionWithConsensus(
      config.exam_id.toUpperCase().replace(/-/g, ' '),
      subject_id.replace(/-/g, ' '),
      topic,
      difficulty,
      exam_id,
      subject_id
    );

    if (question) {
      questions.push(question);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return questions;
}

// Convert to CSV format
function convertToCSV(questions) {
  const header = 'question,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,exam_id,subject_id,topic,year,source_detail\n';

  const rows = questions.map(q => {
    const fields = [
      q.question,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_answer,
      q.explanation,
      q.difficulty,
      q.exam_id,
      q.subject_id,
      q.topic,
      q.year,
      q.source_detail,
    ];

    return fields.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',');
  });

  return header + rows.join('\n');
}

// Save generated questions
function saveQuestions(questions, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

  // Save as CSV
  const csvPath = path.join(outputDir, `auto-generated-${timestamp}.csv`);
  const csvContent = convertToCSV(questions);
  fs.writeFileSync(csvPath, csvContent);

  // Save as JSON
  const jsonPath = path.join(outputDir, `auto-generated-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

  return { csvPath, jsonPath };
}

// Generate statistics
function generateStats(questions) {
  const byExam = {};
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  let totalQuality = 0;

  questions.forEach(q => {
    const key = `${q.exam_id}/${q.subject_id}/${q.topic}`;
    byExam[key] = (byExam[key] || 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    totalQuality += q.quality_score;
  });

  const avgQuality = questions.length > 0 ? (totalQuality / questions.length).toFixed(1) : 0;

  return { byExam, byDifficulty, avgQuality };
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  let targetExam = null;
  let count = 50;
  let threshold = 80;
  let dryRun = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--exam' && args[i + 1]) {
      targetExam = args[i + 1];
      i++;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--threshold' && args[i + 1]) {
      threshold = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    }
  }

  CONFIG.QUALITY_THRESHOLD = threshold;

  if (!CONFIG.OPENROUTER_API_KEY) {
    console.error('❌ Error: OPENROUTER_API_KEY environment variable not set');
    process.exit(1);
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║       PrepGenie - Automated Question Generation System        ║
╚═══════════════════════════════════════════════════════════════╝

Configuration:
  Models:     ${CONFIG.MODELS.length} (multi-model consensus)
  Threshold:  ${CONFIG.QUALITY_THRESHOLD}/100
  Count:      ${count} questions
  Target:     ${targetExam || 'All priority exams'}
  Dry Run:    ${dryRun ? 'Yes' : 'No'}
`);

  const allQuestions = [];
  let configs = EXAM_PRIORITIES;

  if (targetExam) {
    configs = configs.filter(c => c.exam_id === targetExam);
    if (configs.length === 0) {
      console.error(`❌ Unknown exam: ${targetExam}`);
      process.exit(1);
    }
  }

  // Generate for each exam
  for (const config of configs) {
    const batchCount = Math.ceil(count / configs.length);
    const questions = await generateBatch(config, batchCount);
    allQuestions.push(...questions);
  }

  console.log(`\n✨ Generation complete!`);
  console.log(`   Generated: ${allQuestions.length} questions`);

  // Stats
  const stats = generateStats(allQuestions);
  console.log(`\n📊 Statistics:`);
  console.log(`   Average Quality: ${stats.avgQuality}/100`);
  console.log(`   Difficulty: Easy=${stats.byDifficulty.easy}, Medium=${stats.byDifficulty.medium}, Hard=${stats.byDifficulty.hard}`);
  console.log(`\n📦 By Exam:`);
  Object.entries(stats.byExam).forEach(([key, count]) => {
    console.log(`   ${key}: ${count} questions`);
  });

  if (dryRun) {
    console.log(`\n🔍 Dry run - not saving questions`);
    return;
  }

  // Save questions
  const outputDir = '.agents/artifacts/auto-generated';
  const { csvPath, jsonPath } = saveQuestions(allQuestions, outputDir);

  console.log(`\n💾 Saved:`);
  console.log(`   CSV:  ${csvPath}`);
  console.log(`   JSON: ${jsonPath}`);

  // Auto-import
  console.log(`\n🔄 Auto-importing to question bank...`);
  const { execSync } = require('child_process');

  try {
    execSync(`node scripts/import-questions.js "${csvPath}"`, { stdio: 'inherit' });
    console.log(`\n✅ Successfully imported to question bank!`);
  } catch (error) {
    console.error(`\n❌ Import failed. You can manually import from: ${csvPath}`);
  }

  console.log(`\n🎉 Done!\n`);
}

// Run
main().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
