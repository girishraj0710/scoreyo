/**
 * Generate Study Materials using Claude 3.5 Sonnet
 *
 * Usage: npx tsx scripts/generate-study-materials-claude.ts
 *
 * This script generates comprehensive study materials for topics
 * using Claude 3.5 Sonnet via OpenRouter API
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

interface StudyMaterial {
  topic_id: string;
  title: string;
  content: {
    sections: Section[];
  };
}

interface Section {
  id: string;
  title: string;
  content?: string;
  points?: string[];
  items?: any[];
  mistakes?: Mistake[];
  problems?: Problem[];
}

interface Mistake {
  title: string;
  wrong: string;
  correct: string;
  explanation: string;
}

interface Problem {
  question: string;
  answer: string;
  explanation: string;
}

// Topics to generate study materials for
const TOPICS = [
  {
    topic_id: 'articles',
    title: 'Articles (A, An, The)',
    level: 'beginner',
    context: 'Definite and indefinite articles. When to use "a" vs "an" vs "the". Zero article. Common mistakes by Indian learners (Hindi has no articles). Special cases and exceptions.'
  },
  {
    topic_id: 'present-simple',
    title: 'Present Simple Tense',
    level: 'beginner',
    context: 'Usage (habits, facts, routines), formation (do/does, -s/-es ending), time expressions (always, often, usually, sometimes, never), negative and question forms. Difference from present continuous.'
  },
  {
    topic_id: 'present-continuous',
    title: 'Present Continuous Tense',
    level: 'beginner',
    context: 'Usage (actions happening now, temporary situations, future arrangements), formation (am/is/are + -ing), stative verbs (don\'t use continuous), spelling rules for -ing. Common mistakes.'
  },
  {
    topic_id: 'past-simple',
    title: 'Past Simple Tense',
    level: 'beginner',
    context: 'Usage (completed past actions, past habits), regular verbs (-ed ending), irregular verbs (list of common ones), time expressions (yesterday, last week, ago), negative and questions with "did".'
  },
  {
    topic_id: 'future-simple',
    title: 'Future Simple Tense',
    level: 'beginner',
    context: 'Usage (predictions, decisions, promises, offers), will vs going to, time expressions (tomorrow, next week, in the future), negative and question forms. Difference from present continuous for future.'
  },
];

async function generateStudyMaterial(
  topicId: string,
  title: string,
  level: string,
  context: string
): Promise<StudyMaterial | null> {
  console.log(`\n📚 Generating study material for: ${title}`);
  console.log(`   Level: ${level}`);

  const prompt = `Create comprehensive study material for: ${title}

LEVEL: ${level} (for Indian students preparing for IELTS/competitive exams)
CONTEXT: ${context}

Create a complete learning resource with EXACTLY these 6 sections:

1. INTRODUCTION (150-200 words)
   - What is this topic and why is it important?
   - Real-world relevance
   - What students will master by the end
   - Encourage and motivate learners

2. CORE CONCEPTS (8-12 flashcards)
   CRITICAL FORMAT RULES:
   - Each concept MUST start with ## header (e.g., "## Definite Article: The")
   - Use --- separator between flashcards
   - Each flashcard includes:
     * **Definition:** Clear explanation
     * **Usage Rules:** Bullet points
     * **Examples:** 3-5 real sentences
     * **Quick Tip:** Memory aid or common pattern

   Example format:
   ## Definite Article: The

   **Definition:** "The" is used when referring to a specific noun that both speaker and listener know about.

   **Usage Rules:**
   - Use "the" when the noun has been mentioned before
   - Use "the" with unique things (the sun, the moon, the President)
   - Use "the" with superlatives (the best, the tallest)
   - Use "the" with ordinal numbers (the first, the second)

   **Examples:**
   - "I saw a dog. The dog was black." (specific dog mentioned)
   - "The sun rises in the east." (unique object)
   - "She is the smartest student in class." (superlative)

   **Quick Tip:** If you're pointing to something specific and saying "that one," use "the"!

   ---

   ## Indefinite Article: A

   [Next flashcard content...]

3. KEY POINTS TO REMEMBER (10-15 bullet points)
   - Quick reference facts
   - One clear concept per point
   - Use **bold** for important terms
   - Format: "**Term**: explanation" or "**Rule**: when this happens"

   Example:
   - **"A" before consonants**: Use "a" before words starting with consonant sounds (a book, a university)
   - **"An" before vowels**: Use "an" before words starting with vowel sounds (an apple, an hour)
   - **No article for general plural nouns**: "Books are important" (not "The books")

4. COMMON MISTAKES (8-12 mistakes)
   Each mistake must have:
   - **title**: Name of the mistake
   - **wrong**: Incorrect example sentence
   - **correct**: Correct version
   - **explanation**: Why it's wrong and why the correction works (2-3 sentences)

   Focus on mistakes Indian learners make due to mother tongue interference.

5. ANNOTATED EXAMPLES (6-10 sentences)
   - Real, natural English sentences
   - Highlight the grammar point being taught
   - Explain what makes each sentence correct
   - Mix of simple and complex examples

   Format:
   {
     "sentence": "I bought **a** car. **The** car is red.",
     "explanation": "First mention uses 'a' (indefinite). Second mention uses 'the' because we now know which specific car."
   }

6. PRACTICE PROBLEMS (12-15 problems)
   Mix of question types:
   - Fill in the blanks (5 questions)
   - Error correction (3 questions)
   - Multiple choice (4 questions)
   - Sentence completion (3 questions)

   Each problem includes:
   - **question**: The exercise
   - **answer**: Complete, correct answer
   - **explanation**: Step-by-step reasoning (3-4 sentences explaining WHY)

FORMAT REQUIREMENTS:
- Core Concepts MUST use ## headers and --- separators
- Use **bold** for emphasis, not <b> tags
- Use - for bullet lists, not * or •
- Use proper JSON structure (valid syntax)
- NO HTML tags, NO markdown outside of content strings
- Keep language clear and simple (B1-B2 level English)
- Include examples relevant to Indian context where possible

Return ONLY valid JSON in this exact structure:
{
  "sections": [
    {
      "id": "introduction",
      "title": "Introduction",
      "content": "..."
    },
    {
      "id": "core-concepts",
      "title": "Core Concepts",
      "content": "## First Concept\\n\\n**Definition:**...\\n\\n---\\n\\n## Second Concept..."
    },
    {
      "id": "key-points",
      "title": "Key Points to Remember",
      "points": ["point 1", "point 2", ...]
    },
    {
      "id": "common-mistakes",
      "title": "Common Mistakes",
      "mistakes": [
        {
          "title": "...",
          "wrong": "...",
          "correct": "...",
          "explanation": "..."
        }
      ]
    },
    {
      "id": "examples",
      "title": "Annotated Examples",
      "items": [
        {
          "sentence": "...",
          "explanation": "..."
        }
      ]
    },
    {
      "id": "practice-problems",
      "title": "Practice Problems",
      "problems": [
        {
          "question": "...",
          "answer": "...",
          "explanation": "..."
        }
      ]
    }
  ]
}`;

  try {
    console.log(`⏳ Calling Claude API...`);
    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English teacher and curriculum designer with 20+ years of experience. You create clear, comprehensive, and engaging study materials that help students learn effectively. You understand the challenges faced by Indian learners and address mother tongue interference. You follow formatting instructions precisely and create valid JSON output.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 12000,
    });

    const content = response.choices[0].message.content || '';
    console.log(`✅ Received response (${content.length} chars)`);

    // Extract JSON from markdown code blocks
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    // Find JSON object
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON object found in response');
    }
    jsonStr = jsonStr.substring(start, end + 1);

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid structure: missing sections array');
    }

    const requiredSections = ['introduction', 'core-concepts', 'key-points', 'common-mistakes', 'examples', 'practice-problems'];
    const presentSections = parsed.sections.map((s: any) => s.id);
    const missing = requiredSections.filter(id => !presentSections.includes(id));

    if (missing.length > 0) {
      console.warn(`⚠️  Warning: Missing sections: ${missing.join(', ')}`);
    }

    // Verify Core Concepts formatting
    const coreConceptsSection = parsed.sections.find((s: any) => s.id === 'core-concepts');
    if (coreConceptsSection && coreConceptsSection.content) {
      const hasHeaders = coreConceptsSection.content.includes('##');
      const hasSeparators = coreConceptsSection.content.includes('---');

      if (!hasHeaders) {
        console.warn(`⚠️  Warning: Core Concepts missing ## headers`);
      }
      if (!hasSeparators) {
        console.warn(`⚠️  Warning: Core Concepts missing --- separators`);
      }

      // Count flashcards
      const cardCount = (coreConceptsSection.content.match(/##/g) || []).length;
      console.log(`   ✅ ${cardCount} flashcards in Core Concepts`);
    }

    console.log(`✅ Valid study material generated`);
    console.log(`   ${parsed.sections.length} sections`);

    return {
      topic_id: topicId,
      title: title,
      content: parsed
    };

  } catch (error: any) {
    console.error(`❌ Error generating study material for ${title}:`, error.message);
    return null;
  }
}

function generateInsertSQL(material: StudyMaterial): string {
  const contentJson = JSON.stringify(material.content).replace(/'/g, "''");
  const titleEscaped = material.title.replace(/'/g, "''");

  return `-- Generated study material for: ${material.title}
-- Run this in Supabase SQL Editor

INSERT INTO topic_study_content (topic_id, title, content)
VALUES (
  '${material.topic_id}',
  '${titleEscaped}',
  '${contentJson}'::jsonb
)
ON CONFLICT (topic_id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- Verify insertion
SELECT topic_id, title, jsonb_array_length(content->'sections') as section_count
FROM topic_study_content
WHERE topic_id = '${material.topic_id}';
`;
}

async function main() {
  console.log('🚀 Starting Study Material Generation with Claude 3.5 Sonnet\n');
  console.log('📊 Cost estimate: ~$0.10-0.20 per study material\n');

  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'scripts', 'output', `study-materials-${timestamp}`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalGenerated = 0;
  let totalCost = 0;

  for (const topic of TOPICS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📚 Topic: ${topic.title}`);
    console.log(`   ID: ${topic.topic_id}, Level: ${topic.level}`);
    console.log(`${'='.repeat(80)}`);

    const material = await generateStudyMaterial(
      topic.topic_id,
      topic.title,
      topic.level,
      topic.context
    );

    if (material) {
      totalGenerated++;

      // Estimate cost (rough: $3 per 1M input tokens, $15 per 1M output tokens)
      // Approx 3K input tokens + 12K output tokens per study material
      const costEstimate = (3000 / 1000000 * 3) + (12000 / 1000000 * 15);
      totalCost += costEstimate;

      // Save JSON
      const jsonFilename = `${topic.topic_id}.json`;
      const jsonPath = path.join(outputDir, jsonFilename);
      fs.writeFileSync(jsonPath, JSON.stringify(material.content, null, 2));
      console.log(`\n💾 Saved JSON: ${jsonFilename}`);

      // Save SQL
      const sqlFilename = `${topic.topic_id}.sql`;
      const sqlPath = path.join(outputDir, sqlFilename);
      const sql = generateInsertSQL(material);
      fs.writeFileSync(sqlPath, sql);
      console.log(`💾 Saved SQL: ${sqlFilename}`);
      console.log(`💰 Estimated cost: $${costEstimate.toFixed(4)}`);
    }

    // Delay between topics to respect rate limits
    if (TOPICS.indexOf(topic) < TOPICS.length - 1) {
      console.log('\n⏳ Waiting 5 seconds before next topic...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✨ GENERATION COMPLETE ✨`);
  console.log(`${'='.repeat(80)}`);
  console.log(`📊 Total study materials generated: ${totalGenerated}`);
  console.log(`💰 Total estimated cost: $${totalCost.toFixed(2)}`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review generated JSON files in ${outputDir}`);
  console.log(`   2. Check formatting (especially Core Concepts flashcards)`);
  console.log(`   3. Run SQL files in Supabase SQL Editor to insert materials`);
  console.log(`   4. Test on frontend: https://krakkify.in/study?examId=english&subjectId=[topic]`);
}

main().catch(console.error);
