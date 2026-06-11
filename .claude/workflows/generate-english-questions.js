export const meta = {
  name: 'generate-english-questions',
  description: 'Generate exam-authentic IELTS/TOEFL questions with passages using Claude Sonnet',
  phases: [
    { title: 'Generate IELTS Passages', detail: 'Academic reading with official question types' },
    { title: 'Generate TOEFL Passages', detail: 'Comprehensive reading passages' },
    { title: 'Validate & Save', detail: 'Quality check and save to JSON' },
  ],
};

// IELTS Academic Reading - Official Question Type Distribution
const IELTS_PASSAGES = [
  { topic: 'Science and Technology - Artificial Intelligence', difficulty: 'medium', questionTypes: ['multiple-choice', 'true-false-not-given', 'matching-headings'] },
  { topic: 'Science and Technology - Climate Science', difficulty: 'hard', questionTypes: ['sentence-completion', 'matching-information', 'summary-completion'] },
  { topic: 'History and Culture - Ancient Civilizations', difficulty: 'medium', questionTypes: ['multiple-choice', 'yes-no-not-given', 'matching-features'] },
  { topic: 'History and Culture - Modern Society', difficulty: 'hard', questionTypes: ['diagram-labeling', 'short-answer', 'matching-sentence-endings'] },
  { topic: 'Environment and Nature - Biodiversity', difficulty: 'medium', questionTypes: ['true-false-not-given', 'summary-completion', 'multiple-choice'] },
  { topic: 'Environment and Nature - Conservation', difficulty: 'hard', questionTypes: ['matching-headings', 'sentence-completion', 'table-completion'] },
  { topic: 'Education and Society - Learning Methods', difficulty: 'medium', questionTypes: ['yes-no-not-given', 'matching-information', 'multiple-choice'] },
  { topic: 'Education and Society - Social Psychology', difficulty: 'hard', questionTypes: ['summary-completion', 'matching-features', 'short-answer'] },
  { topic: 'Business and Economics - Global Trade', difficulty: 'medium', questionTypes: ['multiple-choice', 'sentence-completion', 'matching-headings'] },
  { topic: 'Business and Economics - Innovation', difficulty: 'hard', questionTypes: ['true-false-not-given', 'flow-chart-completion', 'matching-information'] },
];

// TOEFL Reading - Official Question Type Distribution
const TOEFL_PASSAGES = [
  { topic: 'Natural Sciences - Biology', difficulty: 'medium', questionTypes: ['factual', 'negative-factual', 'inference', 'vocabulary'] },
  { topic: 'Natural Sciences - Geology', difficulty: 'hard', questionTypes: ['rhetorical-purpose', 'sentence-insertion', 'prose-summary', 'inference'] },
  { topic: 'Social Sciences - Anthropology', difficulty: 'medium', questionTypes: ['factual', 'vocabulary', 'reference', 'inference'] },
  { topic: 'Social Sciences - Psychology', difficulty: 'hard', questionTypes: ['negative-factual', 'rhetorical-purpose', 'sentence-insertion', 'inference'] },
  { topic: 'Arts and Humanities - Literature', difficulty: 'medium', questionTypes: ['factual', 'vocabulary', 'inference', 'prose-summary'] },
  { topic: 'Arts and Humanities - Architecture', difficulty: 'hard', questionTypes: ['rhetorical-purpose', 'sentence-insertion', 'factual', 'inference'] },
  { topic: 'Technology and Innovation - Computing', difficulty: 'medium', questionTypes: ['factual', 'vocabulary', 'negative-factual', 'inference'] },
  { topic: 'Technology and Innovation - Engineering', difficulty: 'hard', questionTypes: ['sentence-insertion', 'rhetorical-purpose', 'prose-summary', 'inference'] },
  { topic: 'History - World Events', difficulty: 'medium', questionTypes: ['factual', 'reference', 'vocabulary', 'inference'] },
  { topic: 'History - Cultural Development', difficulty: 'hard', questionTypes: ['negative-factual', 'rhetorical-purpose', 'sentence-insertion', 'inference'] },
];

const IELTS_PROMPT_TEMPLATE = (topic, difficulty, questionTypes) => `You are an official IELTS test creator with deep knowledge of Cambridge IELTS exam patterns.

Generate ONE complete IELTS Academic Reading passage with questions.

**Topic:** ${topic}
**Difficulty:** ${difficulty}
**Required Question Types:** ${questionTypes.join(', ')}

**Passage Requirements:**
- Length: 650-850 words (strict IELTS standard)
- Academic register with formal vocabulary
- Include specific facts, statistics, dates, names, locations
- Clear paragraph structure with topic sentences
- Use academic hedging language (may, could, suggests, indicates)
- Include citations or references to studies/research
- Natural flow with cohesive devices

**Question Requirements:**
- Generate 13 questions total (IELTS standard per passage)
- Use EXACT question types: ${questionTypes.join(', ')}
- Questions must follow official IELTS format exactly
- Cover different skills: skimming, scanning, detail, inference, vocabulary
- Questions should appear in passage order
- Difficulty progression: easier questions first, harder at end

**For each question type:**
- **Multiple Choice:** Question + 4 options (A-D), only one correct
- **True/False/Not Given:** Statement + classification based on passage
- **Yes/No/Not Given:** Statement about author's claims/views
- **Matching Headings:** List of headings (i-viii) to match with paragraphs
- **Sentence Completion:** Partial sentence, complete from passage (max 3 words)
- **Summary Completion:** Gap-fill summary with word bank or from passage
- **Matching Information:** Match statements to paragraphs (A, B, C...)
- **Short Answer:** Direct questions, answer from passage (max 3 words)

Return ONLY valid JSON (no markdown):
{
  "exam": "IELTS",
  "title": "Passage title",
  "passage": "Full 650-850 word passage...",
  "wordCount": 750,
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "multiple-choice",
      "question": "According to the passage, what is the main...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A",
      "explanation": "The passage states in paragraph 2: '...' This directly supports option A.",
      "passageReference": "Paragraph 2, lines 15-17"
    },
    {
      "questionNumber": 2,
      "questionType": "true-false-not-given",
      "statement": "The research was conducted in 2020.",
      "correctAnswer": "TRUE",
      "explanation": "Line 23 explicitly states 'The study, conducted in 2020...'",
      "passageReference": "Paragraph 3, line 23"
    }
  ]
}`;

const TOEFL_PROMPT_TEMPLATE = (topic, difficulty, questionTypes) => `You are an official TOEFL test creator with deep knowledge of ETS TOEFL iBT patterns.

Generate ONE complete TOEFL Reading passage with questions.

**Topic:** ${topic}
**Difficulty:** ${difficulty}
**Required Question Types:** ${questionTypes.join(', ')}

**Passage Requirements:**
- Length: 700 words (strict TOEFL standard)
- Academic register, complex sentence structures
- Include technical/academic vocabulary
- Clear topic sentences and supporting details
- Use cause-effect, compare-contrast, problem-solution structures
- Include examples and evidence

**Question Requirements:**
- Generate 10 questions (TOEFL standard per passage)
- Use EXACT question types: ${questionTypes.join(', ')}
- Follow official TOEFL format exactly
- Point value: most questions worth 1 point, prose summary worth 2
- Questions follow passage order (except prose summary at end)

**For each question type:**
- **Factual:** "According to paragraph X, which of the following is true about..."
- **Negative Factual:** "According to paragraph X, all of the following are mentioned EXCEPT..."
- **Inference:** "What can be inferred from paragraph X about..."
- **Vocabulary:** "The word 'X' in the passage is closest in meaning to..."
- **Reference:** "The word 'it' in the passage refers to..."
- **Rhetorical Purpose:** "Why does the author mention X in paragraph Y?"
- **Sentence Insertion:** "Look at the four squares [■] that indicate where the sentence could be added..."
- **Prose Summary:** "Directions: An introductory sentence... Select 3 options (2 points)"

Return ONLY valid JSON (no markdown):
{
  "exam": "TOEFL",
  "title": "Passage title",
  "passage": "Full 700 word passage...",
  "wordCount": 700,
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "factual",
      "paragraph": 2,
      "question": "According to paragraph 2, which of the following is true about X?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "B",
      "points": 1,
      "explanation": "Paragraph 2 explicitly states: '...' Therefore B is correct.",
      "passageReference": "Paragraph 2, sentence 3"
    }
  ]
}`;

phase('Generate IELTS Passages');

const ieltsResults = await pipeline(
  IELTS_PASSAGES,
  passage => agent(
    IELTS_PROMPT_TEMPLATE(passage.topic, passage.difficulty, passage.questionTypes),
    {
      label: `IELTS: ${passage.topic}`,
      phase: 'Generate IELTS Passages',
      schema: {
        type: 'object',
        required: ['exam', 'title', 'passage', 'wordCount', 'questions'],
        properties: {
          exam: { type: 'string' },
          title: { type: 'string' },
          passage: { type: 'string', minLength: 600 },
          wordCount: { type: 'number', minimum: 650, maximum: 850 },
          difficulty: { type: 'string' },
          topic: { type: 'string' },
          questions: {
            type: 'array',
            minItems: 10,
            items: {
              type: 'object',
              required: ['questionNumber', 'questionType', 'correctAnswer', 'explanation'],
            }
          }
        }
      }
    }
  )
);

phase('Generate TOEFL Passages');

const toeflResults = await pipeline(
  TOEFL_PASSAGES,
  passage => agent(
    TOEFL_PROMPT_TEMPLATE(passage.topic, passage.difficulty, passage.questionTypes),
    {
      label: `TOEFL: ${passage.topic}`,
      phase: 'Generate TOEFL Passages',
      schema: {
        type: 'object',
        required: ['exam', 'title', 'passage', 'wordCount', 'questions'],
        properties: {
          exam: { type: 'string' },
          title: { type: 'string' },
          passage: { type: 'string', minLength: 600 },
          wordCount: { type: 'number', minimum: 650, maximum: 750 },
          difficulty: { type: 'string' },
          topic: { type: 'string' },
          questions: {
            type: 'array',
            minItems: 8,
            items: {
              type: 'object',
              required: ['questionNumber', 'questionType', 'correctAnswer', 'explanation'],
            }
          }
        }
      }
    }
  )
);

phase('Validate & Save');

const allPassages = {
  ielts: ieltsResults.filter(Boolean),
  toefl: toeflResults.filter(Boolean),
  totalPassages: ieltsResults.filter(Boolean).length + toeflResults.filter(Boolean).length,
  totalQuestions:
    ieltsResults.filter(Boolean).reduce((sum, p) => sum + p.questions.length, 0) +
    toeflResults.filter(Boolean).reduce((sum, p) => sum + p.questions.length, 0),
  timestamp: new Date().toISOString(),
  generatedBy: 'Claude Sonnet 3.5',
  quality: 'Exam-authentic'
};

log(`✅ Generated ${allPassages.totalPassages} passages with ${allPassages.totalQuestions} questions`);
log(`   IELTS: ${allPassages.ielts.length} passages`);
log(`   TOEFL: ${allPassages.toefl.length} passages`);

return allPassages;
