export const meta = {
  name: 'generate-foundation-24-missing',
  description: 'Generate study materials for 24 missing Foundation English topics (reuse existing 9)',
  phases: [
    { title: 'Generate', detail: 'Create study content for 24 topics in parallel' },
  ],
};

// Only the 24 topics that DON'T exist in database yet
const topics = [
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

log(`Generating study materials for ${topics.length} missing Foundation English topics...`);
log('(9 topics already exist: Modules 1 & 2)');

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

CONTEXT:
${topic.id === 'present-simple-complete' ? 'This is a MERGED topic covering: affirmative (I play), third person (He plays), negative (I don\'t play), and questions (Do you play?)' : ''}
${topic.id === 'present-continuous-complete' ? 'This is a MERGED topic covering: affirmative (I am studying), negative (I\'m not studying), and questions (Are you studying?)' : ''}
${topic.id === 'past-simple-complete' ? 'This is a MERGED topic covering: affirmative (I went), regular/irregular verbs, negative (I didn\'t go), and questions (Did you go?)' : ''}
${topic.id === 'past-continuous-complete' ? 'This is a MERGED topic covering: structure (was/were + V-ing), while/when usage' : ''}
${topic.id === 'future-tenses' ? 'This is a MERGED topic covering: will, going to, and their differences' : ''}
${topic.id === 'present-perfect-complete' ? 'This is a MERGED topic covering: has/have + V3, time markers (ever, never, already, yet, just), for/since' : ''}
${topic.id === 'modal-verbs' ? 'This is a MERGED topic covering: can/could, may/might, must/should, will/would' : ''}
${topic.id === 'passive-voice' ? 'This is a MERGED topic covering: passive in all tenses' : ''}
${topic.id === 'reported-speech' ? 'This is a MERGED topic covering: statements AND questions' : ''}
${topic.id === 'conditionals' ? 'This is a MERGED topic covering: Zero, First, Second, Third conditionals' : ''}
${topic.id === 'relative-clauses' ? 'This is a MERGED topic covering: Defining AND Non-defining clauses' : ''}

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

4. For MERGED topics, cover ALL sub-aspects comprehensively in the 5 cards.

5. Return valid JSON matching the schema exactly.

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
  reused: 9,
  sql: sqlStatements
};
