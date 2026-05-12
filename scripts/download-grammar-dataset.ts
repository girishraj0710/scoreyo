#!/usr/bin/env node
/**
 * Download Grammar Q&A Dataset from HuggingFace
 * Source: Teravee/1000_english-grammar-dataset (71,052 questions)
 *
 * Purpose: Pattern analysis ONLY - we'll create original questions
 * License: Unknown - using for research/pattern study only
 */

import https from 'https';
import * as fs from 'fs';
import * as path from 'path';

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  Grammar Dataset Downloader - Pattern Analysis              ║');
console.log('║  Source: Teravee/1000_english-grammar-dataset               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

const OUTPUT_DIR = path.join(__dirname, '..', '.agents', 'datasets');
const SAMPLE_SIZE = 1000; // Download 1000 samples for pattern analysis

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface GrammarQA {
  instruction: string;
  question: string;
  answer: string;
}

async function downloadDataset(): Promise<GrammarQA[]> {
  console.log(`📥 Downloading ${SAMPLE_SIZE} grammar Q&A samples...\n`);

  const allSamples: GrammarQA[] = [];
  const pageSize = 100;

  for (let offset = 0; offset < SAMPLE_SIZE; offset += pageSize) {
    const url = `https://datasets-server.huggingface.co/rows?dataset=Teravee%2F1000_english-grammar-dataset&config=default&split=train&offset=${offset}&length=${pageSize}`;

    const page = await new Promise<GrammarQA[]>((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const samples = json.rows.map((item: any) => item.row);
            resolve(samples);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });

    allSamples.push(...page);
    console.log(`   ✅ Downloaded ${allSamples.length}/${SAMPLE_SIZE} samples...`);

    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allSamples;
}

function analyzePatterns(samples: GrammarQA[]) {
  console.log('\n📊 Analyzing grammar patterns...\n');

  // Extract topics from instructions
  const topics: { [key: string]: number } = {};
  const mistakePatterns: string[] = [];
  const questionTypes: { [key: string]: number } = {};

  samples.forEach(sample => {
    const instruction = sample.instruction.toLowerCase();

    // Count topics
    if (instruction.includes('tense')) topics['tenses'] = (topics['tenses'] || 0) + 1;
    if (instruction.includes('article')) topics['articles'] = (topics['articles'] || 0) + 1;
    if (instruction.includes('preposition')) topics['prepositions'] = (topics['prepositions'] || 0) + 1;
    if (instruction.includes('pronoun')) topics['pronouns'] = (topics['pronouns'] || 0) + 1;
    if (instruction.includes('passive')) topics['passive voice'] = (topics['passive voice'] || 0) + 1;
    if (instruction.includes('conditional')) topics['conditionals'] = (topics['conditionals'] || 0) + 1;
    if (instruction.includes('modal')) topics['modals'] = (topics['modals'] || 0) + 1;
    if (instruction.includes('phrasal verb')) topics['phrasal verbs'] = (topics['phrasal verbs'] || 0) + 1;
    if (instruction.includes('idiom')) topics['idioms'] = (topics['idioms'] || 0) + 1;
    if (instruction.includes('punctuation')) topics['punctuation'] = (topics['punctuation'] || 0) + 1;
    if (instruction.includes('spelling')) topics['spelling'] = (topics['spelling'] || 0) + 1;

    // Identify mistake patterns
    if (instruction.includes('difference between')) {
      const match = instruction.match(/difference between ["']([^"']+)["'] and ["']([^"']+)["']/);
      if (match) {
        mistakePatterns.push(`${match[1]} vs ${match[2]}`);
      }
    }

    // Question types
    if (instruction.includes('difference')) questionTypes['comparison'] = (questionTypes['comparison'] || 0) + 1;
    if (instruction.includes('correct')) questionTypes['correction'] = (questionTypes['correction'] || 0) + 1;
    if (instruction.includes('meaning')) questionTypes['meaning'] = (questionTypes['meaning'] || 0) + 1;
    if (instruction.includes('use') || instruction.includes('usage')) questionTypes['usage'] = (questionTypes['usage'] || 0) + 1;
  });

  return { topics, mistakePatterns, questionTypes };
}

async function main() {
  try {
    // Download samples
    const samples = await downloadDataset();

    // Save raw data
    const rawPath = path.join(OUTPUT_DIR, 'grammar-qa-samples.json');
    fs.writeFileSync(rawPath, JSON.stringify(samples, null, 2));
    console.log(`\n💾 Saved ${samples.length} samples to: ${rawPath}`);

    // Analyze patterns
    const analysis = analyzePatterns(samples);

    // Save analysis
    const analysisPath = path.join(OUTPUT_DIR, 'grammar-pattern-analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`💾 Saved pattern analysis to: ${analysisPath}\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 PATTERN ANALYSIS SUMMARY\n');

    console.log('Top Topics:');
    Object.entries(analysis.topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([topic, count]) => {
        console.log(`   ${topic}: ${count} questions`);
      });

    console.log('\nQuestion Types:');
    Object.entries(analysis.questionTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} questions`);
      });

    console.log('\nCommon Confusions (first 10):');
    analysis.mistakePatterns.slice(0, 10).forEach(pattern => {
      console.log(`   - ${pattern}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ Pattern analysis complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Review pattern analysis in .agents/datasets/');
    console.log('   2. Use insights to create original questions');
    console.log('   3. Focus on most common mistake patterns');
    console.log('   4. Create 1,200 questions based on these insights\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
