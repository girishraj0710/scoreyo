/**
 * AI Question Generator - Fully Automated
 * Generates 300+ questions using Gemini via OpenRouter
 * Zero manual work required
 */

import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { queryAll, execute } from '@/lib/db';

interface GenerationConfig {
  exam: string;
  subject: string;
  topic: string;
  targetCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
}

interface GenerationResult {
  success: boolean;
  questionsGenerated: number;
  questionsSaved: number;
  errors: string[];
  sampleQuestions: GeneratedQuestion[];
}

export class AIQuestionGenerator {
  private apiKey: string;
  private model = 'google/gemini-2.0-flash-exp:free';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY not found in environment');
    }
  }

  /**
   * Step 1: Fetch existing questions as examples (few-shot learning)
   */
  async fetchExampleQuestions(exam: string, limit = 5): Promise<any[]> {
    try {
      const examples = await queryAll(
        `SELECT question, options, correct_answer, explanation, difficulty
         FROM fact_exam_questions
         WHERE source LIKE ?
         LIMIT ?`,
        [`%${exam.toLowerCase()}%`, limit]
      );

      console.log(`✅ Fetched ${examples.length} example questions for ${exam}`);
      return examples;
    } catch (err) {
      console.log('⚠️  No existing questions found, using built-in examples');
      return [];
    }
  }

  /**
   * Step 2: Generate questions using Gemini API
   */
  async generateQuestions(config: GenerationConfig): Promise<GeneratedQuestion[]> {
    const { exam, subject, topic, targetCount, difficulty } = config;

    console.log(`\n🤖 Generating ${targetCount} questions for ${exam} - ${subject} - ${topic}...`);

    // Fetch examples for few-shot learning
    const examples = await this.fetchExampleQuestions(exam, 3);

    // Build prompt
    const prompt = this.buildPrompt(exam, subject, topic, targetCount, difficulty, examples);

    try {
      const response = await generateText({
        model: openrouter(this.model),
        prompt,
        temperature: 0.8,
        maxTokens: 8000,
      });

      // Parse JSON response
      const questions = this.parseQuestionsFromResponse(response.text);
      console.log(`✅ Generated ${questions.length} questions`);

      return questions;
    } catch (err) {
      throw new Error(`Generation failed: ${(err as Error).message}`);
    }
  }

  /**
   * Build the AI generation prompt
   */
  private buildPrompt(
    exam: string,
    subject: string,
    topic: string,
    count: number,
    difficulty: string,
    examples: any[]
  ): string {
    const exampleText = examples.length > 0
      ? examples.map((ex, i) => `
Example ${i + 1}:
Question: ${ex.question}
Options: ${JSON.parse(ex.options || '[]').join(' | ')}
Correct Answer: ${ex.correct_answer}
Explanation: ${ex.explanation}
Difficulty: ${ex.difficulty}
`).join('\n')
      : `
Example 1:
Question: What is the primary function of mitochondria?
Options: A) Protein synthesis | B) Energy production | C) DNA replication | D) Cell division
Correct Answer: 1
Explanation: Mitochondria are known as the powerhouse of the cell, responsible for producing ATP through cellular respiration.
Difficulty: easy

Example 2:
Question: Which of the following is an example of a scalar quantity?
Options: A) Velocity | B) Force | C) Temperature | D) Acceleration
Correct Answer: 2
Explanation: Temperature is a scalar quantity as it has only magnitude and no direction, unlike velocity and force which are vectors.
Difficulty: medium
`;

    return `You are an expert question generator for ${exam} (${subject} - ${topic}).

Generate EXACTLY ${count} high-quality multiple-choice questions following the ${exam} exam pattern.

DIFFICULTY: ${difficulty === 'mixed' ? 'Mix of easy (30%), medium (50%), hard (20%)' : difficulty}

REQUIREMENTS:
1. Each question must have EXACTLY 4 options (A, B, C, D)
2. Only ONE correct answer
3. Explanation must be detailed (2-3 sentences minimum)
4. Questions must test conceptual understanding, not just memorization
5. Options must be plausible (avoid obvious wrong answers)
6. Cover diverse subtopics within ${topic}
7. Follow ${exam} exam pattern and difficulty level

EXAMPLES FROM REAL ${exam} QUESTIONS:
${exampleText}

OUTPUT FORMAT (STRICT JSON):
Return ONLY a valid JSON array, no markdown, no extra text:

[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation here...",
    "difficulty": "easy"
  },
  ...
]

IMPORTANT:
- correctAnswer is 0-indexed (0 = A, 1 = B, 2 = C, 3 = D)
- Return EXACTLY ${count} questions
- Ensure JSON is valid (no trailing commas, proper escaping)
- No markdown code blocks, just raw JSON

Generate now:`;
  }

  /**
   * Parse generated questions from AI response
   */
  private parseQuestionsFromResponse(responseText: string): GeneratedQuestion[] {
    try {
      // Strip markdown code blocks if present
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
      }

      // Find JSON array
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const questions = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      // Validate each question
      return questions.filter(q => this.validateQuestion(q));
    } catch (err) {
      throw new Error(`Failed to parse questions: ${(err as Error).message}`);
    }
  }

  /**
   * Validate question format
   */
  private validateQuestion(q: any): boolean {
    if (!q.question || typeof q.question !== 'string') return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
    if (!q.explanation || typeof q.explanation !== 'string') return false;
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) return false;
    return true;
  }

  /**
   * Step 3: Save questions to database
   */
  async saveQuestions(
    questions: GeneratedQuestion[],
    exam: string,
    subject: string,
    topic: string
  ): Promise<{ saved: number; failed: number; errors: string[] }> {
    console.log(`\n💾 Saving ${questions.length} questions to database...`);

    let saved = 0;
    let failed = 0;
    const errors: string[] = [];

    // Get or create topic
    const topicId = await this.getOrCreateTopic(exam, subject, topic);

    for (const q of questions) {
      try {
        await execute(
          `INSERT INTO fact_exam_questions (
            topic_id,
            question,
            options,
            correct_answer,
            explanation,
            difficulty,
            source,
            valid_from,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            topicId,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation,
            q.difficulty,
            `ai_generated_${exam.toLowerCase()}_2026`,
            2026,
            new Date().toISOString(),
          ]
        );
        saved++;
      } catch (err) {
        failed++;
        errors.push(`Failed to save: ${q.question.substring(0, 50)}... - ${(err as Error).message}`);
      }
    }

    console.log(`✅ Saved: ${saved}`);
    console.log(`❌ Failed: ${failed}`);

    return { saved, failed, errors };
  }

  /**
   * Get or create topic in database
   */
  private async getOrCreateTopic(exam: string, subject: string, topic: string): Promise<number> {
    try {
      // Try to find existing topic
      const existing = await queryAll(
        'SELECT id FROM dim_topics WHERE topic_name = ? LIMIT 1',
        [`${exam}_${subject}_${topic}`.toLowerCase().replace(/\s+/g, '_')]
      );

      if (existing.length > 0) {
        return existing[0].id;
      }

      // Create new topic
      await execute(
        `INSERT INTO dim_topics (topic_name, category, scope, description, keywords)
         VALUES (?, ?, ?, ?, ?)`,
        [
          `${exam}_${subject}_${topic}`.toLowerCase().replace(/\s+/g, '_'),
          `${exam}_${subject}`.toLowerCase(),
          'exam-specific',
          `${exam} ${subject} - ${topic}`,
          `${exam}, ${subject}, ${topic}`,
        ]
      );

      // Fetch newly created topic ID
      const newTopic = await queryAll(
        'SELECT id FROM dim_topics WHERE topic_name = ? LIMIT 1',
        [`${exam}_${subject}_${topic}`.toLowerCase().replace(/\s+/g, '_')]
      );

      return newTopic[0].id;
    } catch (err) {
      throw new Error(`Failed to get/create topic: ${(err as Error).message}`);
    }
  }

  /**
   * Step 4: Generate full report
   */
  generateReport(
    config: GenerationConfig,
    questions: GeneratedQuestion[],
    saveResult: { saved: number; failed: number; errors: string[] }
  ): string {
    const difficultyDist = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
    };

    return `
╔═══════════════════════════════════════════════════════════════╗
║  AI QUESTION GENERATION REPORT                                 ║
╠═══════════════════════════════════════════════════════════════╣
║  Exam: ${config.exam}
║  Subject: ${config.subject}
║  Topic: ${config.topic}
║  Target: ${config.targetCount} questions
╠═══════════════════════════════════════════════════════════════╣
║  GENERATION RESULTS                                            ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Generated: ${questions.length} questions
║  💾 Saved to DB: ${saveResult.saved}
║  ❌ Failed: ${saveResult.failed}
╠═══════════════════════════════════════════════════════════════╣
║  DIFFICULTY DISTRIBUTION                                       ║
╠═══════════════════════════════════════════════════════════════╣
║  Easy:   ${difficultyDist.easy} (${((difficultyDist.easy / questions.length) * 100).toFixed(1)}%)
║  Medium: ${difficultyDist.medium} (${((difficultyDist.medium / questions.length) * 100).toFixed(1)}%)
║  Hard:   ${difficultyDist.hard} (${((difficultyDist.hard / questions.length) * 100).toFixed(1)}%)
╠═══════════════════════════════════════════════════════════════╣
║  SAMPLE QUESTIONS (First 3)                                    ║
╠═══════════════════════════════════════════════════════════════╣
${questions.slice(0, 3).map((q, i) => `
║  Question ${i + 1}: ${q.question.substring(0, 50)}...
║  Difficulty: ${q.difficulty}
║  Options: ${q.options.length}
║  Correct: ${String.fromCharCode(65 + q.correctAnswer)}
`).join('╠═══════════════════════════════════════════════════════════════╣\n')}
╚═══════════════════════════════════════════════════════════════╝

${saveResult.errors.length > 0 ? `\n⚠️  ERRORS:\n${saveResult.errors.join('\n')}\n` : ''}
`;
  }

  /**
   * Main entry point: Generate and save questions
   */
  async run(config: GenerationConfig): Promise<GenerationResult> {
    try {
      console.log('🚀 Starting AI Question Generation Pipeline...\n');
      console.log(`📋 Configuration:`);
      console.log(`   Exam: ${config.exam}`);
      console.log(`   Subject: ${config.subject}`);
      console.log(`   Topic: ${config.topic}`);
      console.log(`   Count: ${config.targetCount}`);
      console.log(`   Difficulty: ${config.difficulty}`);

      // Generate questions
      const questions = await this.generateQuestions(config);

      // Save to database
      const saveResult = await this.saveQuestions(questions, config.exam, config.subject, config.topic);

      // Generate report
      const report = this.generateReport(config, questions, saveResult);
      console.log(report);

      return {
        success: true,
        questionsGenerated: questions.length,
        questionsSaved: saveResult.saved,
        errors: saveResult.errors,
        sampleQuestions: questions.slice(0, 5),
      };
    } catch (err) {
      console.error('❌ Generation failed:', err);
      return {
        success: false,
        questionsGenerated: 0,
        questionsSaved: 0,
        errors: [(err as Error).message],
        sampleQuestions: [],
      };
    }
  }
}

export default AIQuestionGenerator;
