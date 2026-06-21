export const meta = {
  name: 'generate-foundation-33-topics',
  description: 'Generate study materials for 33 revised Foundation English topics',
  phases: [
    { title: 'Generate', detail: 'Create study content for 33 topics in parallel' },
  ],
};

// 33 revised Foundation topics
const topics = [
  // Module 1: Alphabet & Phonics (3)
  { id: 'alphabet-basics', title: 'English Alphabet', module: 1 },
  { id: 'phonics-vowels', title: 'Vowels & Consonants', module: 1 },
  { id: 'pronunciation-basics', title: 'Pronunciation Fundamentals', module: 1 },

  // Module 2: Basic Grammar (6)
  { id: 'parts-of-speech', title: 'Parts of Speech', module: 2 },
  { id: 'nouns-detailed', title: 'Nouns Mastery', module: 2 },
  { id: 'pronouns-detailed', title: 'Pronouns Complete', module: 2 },
  { id: 'articles', title: 'Articles (a, an, the)', module: 2 },
  { id: 'adjectives', title: 'Adjectives & Comparisons', module: 2 },
  { id: 'verbs-basics', title: 'Verbs - Action Words', module: 2 },

  // Module 3: Essential Tenses (8)
  { id: 'present-simple-complete', title: 'Present Simple Tense', module: 3 },
  { id: 'present-continuous-complete', title: 'Present Continuous Tense', module: 3 },
  { id: 'past-simple-complete', title: 'Past Simple Tense', module: 3 },
  { id: 'past-continuous-complete', title: 'Past Continuous Tense', module: 3 },
  { id: 'future-tenses', title: 'Future Tenses', module: 3 },
  { id: 'present-perfect-complete', title: 'Present Perfect Tense', module: 3 },
  { id: 'past-perfect', title: 'Past Perfect Tense', module: 3 },
  { id: 'tense-comparison', title: 'All Tenses Comparison', module: 3 },

  // Module 4: Modals & Voice (3)
  { id: 'modal-verbs', title: 'Modal Verbs', module: 4 },
  { id: 'passive-voice', title: 'Passive Voice', module: 4 },
  { id: 'active-passive-conversion', title: 'Voice Conversion Practice', module: 4 },

  // Module 5: Advanced Structures (4)
  { id: 'reported-speech', title: 'Direct & Indirect Speech', module: 5 },
  { id: 'conditionals', title: 'Conditionals', module: 5 },
  { id: 'relative-clauses', title: 'Relative Clauses', module: 5 },
  { id: 'sentence-types', title: 'Sentence Types', module: 5 },

  // Module 6: Connecting Ideas (2)
  { id: 'conjunctions-connectors', title: 'Conjunctions & Connectors', module: 6 },
  { id: 'time-sequence', title: 'Time Sequence Words', module: 6 },

  // Module 7: Vocabulary Building (4)
  { id: 'essential-vocabulary', title: 'Essential 1000 Words', module: 7 },
  { id: 'synonyms-antonyms', title: 'Synonyms & Antonyms', module: 7 },
  { id: 'phrasal-verbs', title: 'Common Phrasal Verbs', module: 7 },
  { id: 'idioms-expressions', title: 'Idioms & Expressions', module: 7 },

  // Module 8: Practical English (3)
  { id: 'common-mistakes', title: 'Common Mistakes for Indian Learners', module: 8 },
  { id: 'speaking-basics', title: 'Daily Conversations', module: 8 },
  { id: 'writing-basics', title: 'Basic Writing Skills', module: 8 },
];

// JSON schema for structured output
const STUDY_CONTENT_SCHEMA = {
  type: 'object',
  required: ['topic_id', 'title', 'subtitle', 'overview', 'sections'],
  properties: {
    topic_id: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
    overview: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'order', 'cards'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          order: { type: 'number' },
          cards: {
            type: 'array',
            items: {
              type: 'object',
              required: ['title', 'definition', 'rules', 'examples'],
              properties: {
                title: { type: 'string' },
                definition: { type: 'string' },
                rules: { type: 'array', items: { type: 'string' } },
                examples: {
                  type: 'object',
                  required: ['correct', 'incorrect'],
                  properties: {
                    correct: { type: 'array', items: { type: 'string' } },
                    incorrect: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['text', 'reason'],
                        properties: {
                          text: { type: 'string' },
                          reason: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

phase('Generate');

log(`Generating study materials for ${topics.length} Foundation English topics...`);

const results = await pipeline(
  topics,

  // Stage 1: Generate content for each topic
  async (topic) => {
    const content = await agent(
      `Generate comprehensive study material for Foundation English topic: "${topic.title}" (${topic.id}).

TOPIC: ${topic.title}
MODULE: Module ${topic.module}
LEVEL: A1-B1 (CEFR)
TARGET: Indian learners, British English

REQUIREMENTS:
1. Create 6 sections:
   - Introduction (overview paragraph)
   - Core Concepts (5 concept cards)
   - Key Rules (5 rules with examples)
   - Common Mistakes (5 mistakes Indian learners make)
   - Practice Problems (5 questions with solutions)
   - Quick Revision (10 bullet points)

2. Core Concepts section MUST have 5 cards with this structure:
   - title: Brief concept name
   - definition: Clear explanation (2-3 sentences)
   - rules: Array of 3-5 rules
   - examples.correct: Array of 2-3 correct examples
   - examples.incorrect: Array of 2-3 objects with {text, reason}

3. STRICT FORMAT RULES:
   - NO emojis, NO markdown symbols (*, #, backticks)
   - NO AI clichés ("Let's dive in", "Buckle up", "Journey")
   - Use Oxford textbook tone - authoritative, calm, professional
   - British English spelling (organised, colour, realise)
   - Indian context (Mumbai, Delhi, rupees, professional scenarios)
   - Focus on Hindi L1 interference

4. Return valid JSON matching the schema exactly.

EXAMPLE OUTPUT STRUCTURE:
{
  "topic_id": "${topic.id}",
  "title": "${topic.title}",
  "subtitle": "Brief subtitle",
  "overview": "Overview paragraph explaining what students will learn",
  "sections": [
    {
      "id": "introduction",
      "title": "What is ${topic.title}?",
      "order": 1,
      "cards": []
    },
    {
      "id": "core-concepts",
      "title": "Core Concepts",
      "order": 2,
      "cards": [
        {
          "title": "Concept 1 Name",
          "definition": "Clear definition in 2-3 sentences.",
          "rules": [
            "Rule 1",
            "Rule 2",
            "Rule 3"
          ],
          "examples": {
            "correct": [
              "I go to school every day.",
              "She plays cricket on Sundays."
            ],
            "incorrect": [
              {
                "text": "I am go to school every day.",
                "reason": "Present simple does not use am/is/are with the main verb."
              }
            ]
          }
        }
      ]
    }
  ]
}

Generate complete, high-quality content now.`,
      {
        label: `Generate: ${topic.id}`,
        schema: STUDY_CONTENT_SCHEMA
      }
    );

    return { topic, content };
  }
);

// Filter out any failed generations
const successful = results.filter(Boolean);
log(`Generated ${successful.length}/${topics.length} topics successfully`);

// Return SQL for insertion
const sqlStatements = successful.map(({ topic, content }) => {
  const jsonContent = JSON.stringify(content).replace(/'/g, "''");

  return `INSERT INTO topic_study_content (
    subject_id, topic_id, path_id, title, subtitle, overview, content,
    difficulty_level, estimated_time_minutes, curriculum_standard, textbook_references
  ) VALUES (
    'english',
    '${topic.id}',
    'foundation',
    '${content.title.replace(/'/g, "''")}',
    '${content.subtitle.replace(/'/g, "''")}',
    '${content.overview.replace(/'/g, "''")}',
    '${jsonContent}'::jsonb,
    'beginner',
    120,
    'CEFR A1-B1, British Council',
    ARRAY['Oxford English Grammar', 'Cambridge Grammar in Use']
  )
  ON CONFLICT (subject_id, topic_id, path_id)
  DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    overview = EXCLUDED.overview,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;`;
}).join('\n\n');

return {
  success: true,
  generated: successful.length,
  total: topics.length,
  sql: sqlStatements
};
