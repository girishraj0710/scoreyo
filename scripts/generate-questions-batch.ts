#!/usr/bin/env tsx
/**
 * STREAM B: Question Generation
 * Generates Week 1 - 530 Critical Priority Questions
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

interface QuestionBatch {
  topicId: string;
  topicName: string;
  pathId: string;
  level: string;
  count: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
}

interface GeneratedQuestion {
  path_id: string;
  topic_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
  level: string;
}

function getTopicGuidelines(topic: string): string {
  const guidelines: Record<string, string> = {
    "Pronunciation": `
FOCUS AREAS:
- Minimal pairs (ship/sheep, bad/bed, cat/cut, etc.)
- Stress patterns (PHOtograph vs phoTOgraphy)
- Sound recognition (vowel sounds: /ɪ/ vs /iː/, consonants: /θ/ vs /ð/)
- Silent letters (knife, psychology, column)
- Common Indian English pronunciation issues (v/w confusion, th sounds)

QUESTION TYPES:
1. "Which word has a different vowel sound?"
2. "Where is the stress in this word?"
3. "Which word does NOT have a silent letter?"
4. "Which pair rhymes?"

INDIAN CONTEXT:
- Address v/w confusion (very/wary, west/vest)
- Address th sounds (think/sink, this/dis)
- Address r pronunciation (rolling r)
`,
    "Pronouns": `
FOCUS AREAS:
- Subject pronouns (I, you, he, she, it, we, they)
- Object pronouns (me, you, him, her, it, us, them)
- Possessive adjectives (my, your, his, her, its, our, their)
- Possessive pronouns (mine, yours, his, hers, ours, theirs)
- Reflexive pronouns (myself, yourself, himself, herself, itself, ourselves, themselves)
- Relative pronouns (who, whom, whose, which, that)
- Demonstrative pronouns (this, that, these, those)

QUESTION TYPES:
1. Fill in the blank with correct pronoun
2. Identify pronoun error in sentence
3. Choose between who/whom, which/that
4. Reflexive vs intensive pronoun usage

COMMON ERRORS:
- "Myself will do it" (incorrect - should be "I will do it")
- "Between you and I" (incorrect - should be "Between you and me")
- "Who did you give it to?" vs "To whom did you give it?"
`,
    "Adjectives": `
FOCUS AREAS:
- Degrees of comparison (positive, comparative, superlative)
- Order of adjectives (opinion-size-age-shape-color-origin-material-purpose)
- Adjective vs Adverb (quick/quickly, good/well)
- Comparative structures (as...as, more...than, less...than)
- Irregular comparatives (good-better-best, bad-worse-worst)

QUESTION TYPES:
1. Correct order of adjectives: "a beautiful large old Italian touring car"
2. Choose correct comparative/superlative form
3. Identify adjective vs adverb error
4. Complete comparison: "as tall as", "taller than", "the tallest"

COMMON ERRORS:
- "more better" (double comparative)
- "most beautifulest" (double superlative)
- "He runs very fastly" (incorrect adverb form)
`,
    "Nouns": `
FOCUS AREAS:
- Countable vs Uncountable nouns
- Singular vs Plural (regular and irregular)
- Collective nouns (team, family, police - singular or plural?)
- Proper vs Common nouns
- Abstract vs Concrete nouns
- Noun forms (verb→noun: decide→decision, adjective→noun: happy→happiness)

QUESTION TYPES:
1. Identify countable/uncountable noun
2. Choose correct plural form
3. Collective noun verb agreement
4. Convert verb/adjective to noun form

COMMON ERRORS:
- "informations" (information is uncountable)
- "furnitures" (furniture is uncountable)
- "The team are playing" vs "The team is playing" (both can be correct depending on context)
`,
    "Verbs": `
FOCUS AREAS:
- Action verbs vs State verbs
- Transitive vs Intransitive verbs
- Auxiliary verbs (be, have, do) vs Main verbs
- Modal verbs (can, could, may, might, must, should, will, would)
- Verb forms (base, past simple, past participle, present participle/gerund)
- Phrasal verbs (basic level: get up, put on, take off)

QUESTION TYPES:
1. Identify action vs state verb
2. Choose correct verb form
3. Transitive verb + object requirement
4. Modal verb meaning/usage

COMMON ERRORS:
- "I am knowing the answer" (know is a state verb, not used in continuous)
- "She must to go" (incorrect - "She must go")
- Using continuous tense with state verbs
`
  };

  return guidelines[topic] || `
GENERAL GUIDELINES:
- Create clear, unambiguous questions
- Use Indian context (RBI, UPSC, Indian names, places)
- Ensure only ONE correct answer
- Make distractors plausible but definitively wrong
- Explain why correct answer is right AND why others are wrong
`;
}

async function generateQuestionBatch(batch: QuestionBatch): Promise<GeneratedQuestion[]> {
  const prompt = `You are creating authentic competitive exam questions for Indian students preparing for English grammar.

TOPIC: ${batch.topicName}
PATH: ${batch.pathId}
CAMBRIDGE LEVEL: ${batch.level}
COUNT: ${batch.count}
DIFFICULTY DISTRIBUTION:
- Easy: ${batch.difficultyDistribution.easy} questions
- Medium: ${batch.difficultyDistribution.medium} questions
- Hard: ${batch.difficultyDistribution.hard} questions

${getTopicGuidelines(batch.topicName)}

Create EXACTLY ${batch.count} multiple-choice questions in this EXACT JSON format:

[
  {
    "question": "Clear, grammatically perfect question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Detailed explanation (50-100 words): Why the correct answer is right, and why each wrong option is incorrect. Teach the concept, don't just confirm.",
    "difficulty": "easy",
    "level": "${batch.level}"
  },
  {
    "question": "Next question...",
    "options": ["...", "...", "...", "..."],
    "correct_answer": 2,
    "explanation": "...",
    "difficulty": "medium",
    "level": "${batch.level}"
  }
]

CRITICAL REQUIREMENTS:
1. PROGRESSIVE DIFFICULTY: First ${batch.difficultyDistribution.easy} questions = "easy", next ${batch.difficultyDistribution.medium} = "medium", last ${batch.difficultyDistribution.hard} = "hard"
2. PLAUSIBLE DISTRACTORS: Wrong options must look reasonable to someone who doesn't fully understand the concept
3. ONLY ONE CORRECT ANSWER: Verify that only the marked option is defensibly correct
4. DETAILED EXPLANATIONS: 50-100 words explaining the rule/concept, why correct is right, why each wrong option is wrong
5. INDIAN CONTEXT: Use Indian names (Rahul, Priya, Amit, Sneha), places (Delhi, Mumbai, Bangalore), institutions (RBI, UPSC, IIT)
6. NO AMBIGUITY: Question must have only one interpretation
7. GRAMMAR-PERFECT: Every sentence (question + options) must be grammatically flawless
8. VARIETY: Don't repeat the same sentence structure 10 times; vary question formats

QUESTION FORMAT VARIETY:
- Fill in the blank: "The book on the table _____ mine." (is/are/was/were)
- Error identification: "Which word is pronounced differently?"
- Best option: "Choose the correct sentence:"
- Transformation: "Convert to passive voice:"
- Context-based: Short scenario + question

OUTPUT: Valid JSON array ONLY. No markdown fences, no preamble, no comments, no trailing commas. Pure JSON starting with [ and ending with ].`;

  const { text } = await generateText({
    model: openrouter("google/gemini-2.0-flash-exp:free"),
    prompt,
    temperature: 0.8,
    maxTokens: 12000,
  });

  // Extract JSON from response
  let jsonStr = text.trim();

  // Remove markdown fences if present
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```\n?$/g, "");
  }

  // Find JSON array boundaries
  const start = jsonStr.indexOf("[");
  const end = jsonStr.lastIndexOf("]") + 1;

  if (start === -1 || end === 0) {
    throw new Error(`No JSON array found in response. Response preview: ${jsonStr.substring(0, 200)}`);
  }

  jsonStr = jsonStr.substring(start, end);

  // Parse JSON
  const questions = JSON.parse(jsonStr);

  // Add metadata
  return questions.map((q: any) => ({
    path_id: batch.pathId,
    topic_id: batch.topicId,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    level: q.level,
  }));
}

// Week 1 Question Batches
const week1Batches: QuestionBatch[] = [
  {
    topicId: "pronunciation",
    topicName: "Pronunciation",
    pathId: "foundation",
    level: "A1",
    count: 100,
    difficultyDistribution: { easy: 40, medium: 50, hard: 10 }
  },
  {
    topicId: "pronouns-detailed",
    topicName: "Pronouns",
    pathId: "foundation",
    level: "A2",
    count: 100,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 }
  },
  {
    topicId: "adjectives",
    topicName: "Adjectives",
    pathId: "foundation",
    level: "A2",
    count: 100,
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 }
  },
  {
    topicId: "nouns-detailed",
    topicName: "Nouns",
    pathId: "foundation",
    level: "A2",
    count: 115,
    difficultyDistribution: { easy: 35, medium: 60, hard: 20 }
  },
  {
    topicId: "verbs-basics",
    topicName: "Verbs",
    pathId: "foundation",
    level: "A2",
    count: 115,
    difficultyDistribution: { easy: 35, medium: 60, hard: 20 }
  }
];

async function main() {
  console.log("📝 STREAM B: Question Generation Starting...\n");
  console.log(`Target: ${week1Batches.reduce((sum, b) => sum + b.count, 0)} questions across ${week1Batches.length} topics\n`);

  // Ensure output directory exists
  await mkdir("content-generated/questions", { recursive: true });

  const allQuestions: GeneratedQuestion[] = [];
  const batchResults: Array<{ topic: string; status: string; count?: number; error?: string }> = [];

  for (let i = 0; i < week1Batches.length; i++) {
    const batch = week1Batches[i];
    const progress = `[${i + 1}/${week1Batches.length}]`;

    console.log(`${progress} Generating: ${batch.topicName} (${batch.count} questions)...`);
    console.log(`   Difficulty: ${batch.difficultyDistribution.easy}E + ${batch.difficultyDistribution.medium}M + ${batch.difficultyDistribution.hard}H`);

    try {
      const questions = await generateQuestionBatch(batch);

      if (questions.length !== batch.count) {
        console.warn(`⚠️  Expected ${batch.count} questions, got ${questions.length}`);
      }

      allQuestions.push(...questions);

      console.log(`✅ Generated: ${questions.length} questions for ${batch.topicName}`);
      console.log(`   Sample Q: ${questions[0].question.substring(0, 60)}...`);
      console.log();

      batchResults.push({
        topic: batch.topicName,
        status: 'success',
        count: questions.length
      });

      // Rate limit: 3 seconds between batches (larger batches need more processing time)
      if (i < week1Batches.length - 1) {
        console.log("⏳ Waiting 3 seconds (rate limit)...\n");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error: any) {
      console.error(`❌ Error generating ${batch.topicName}:`, error.message);
      batchResults.push({
        topic: batch.topicName,
        status: 'error',
        error: error.message
      });
    }
  }

  // Save all questions to single file
  const outputFile = join("content-generated/questions", "week1-batch.json");
  await writeFile(outputFile, JSON.stringify(allQuestions, null, 2), 'utf-8');

  // Save individual topic files for easier review
  const topicGroups: Record<string, GeneratedQuestion[]> = {};
  allQuestions.forEach(q => {
    if (!topicGroups[q.topic_id]) topicGroups[q.topic_id] = [];
    topicGroups[q.topic_id].push(q);
  });

  for (const [topicId, questions] of Object.entries(topicGroups)) {
    const topicFile = join("content-generated/questions", `${topicId}.json`);
    await writeFile(topicFile, JSON.stringify(questions, null, 2), 'utf-8');
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 STREAM B WEEK 1 SUMMARY");
  console.log("=".repeat(60));

  const successful = batchResults.filter(r => r.status === 'success');
  const failed = batchResults.filter(r => r.status === 'error');
  const totalGenerated = successful.reduce((sum, r) => sum + (r.count || 0), 0);

  console.log(`✅ Successful Batches: ${successful.length}/${week1Batches.length}`);
  console.log(`❌ Failed Batches: ${failed.length}/${week1Batches.length}`);
  console.log(`📝 Total Questions: ${totalGenerated}`);
  console.log(`💰 Estimated Cost: $${(totalGenerated * 0.01).toFixed(2)}`);

  if (failed.length > 0) {
    console.log("\n⚠️  Failed Batches (need retry):");
    failed.forEach(f => console.log(`   - ${f.topic}: ${f.error}`));
  }

  console.log("\n📁 Output Location: content-generated/questions/");
  console.log("   - week1-batch.json (all questions)");
  console.log(`   - ${Object.keys(topicGroups).length} individual topic files`);
  console.log("\n🔍 Next Step: Quality review (sample 10% = ~" + Math.ceil(totalGenerated * 0.1) + " questions)");
  console.log("=".repeat(60) + "\n");
}

main().catch(console.error);
