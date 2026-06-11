/**
 * Admin API: Generate Questions via AI
 * POST /api/admin/generate-questions
 *
 * Generates questions using AI and saves to database
 * Runs within Next.js environment (has database access)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { execute, queryAll } from '@/lib/db';

interface GenerateRequest {
  exam: string;
  subject: string;
  topic: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { exam, subject, topic, count, difficulty } = body;

    console.log(`[Generate] ${exam} - ${subject} - ${topic} (${count} questions)`);

    // Build prompt
    const prompt = buildPrompt(exam, subject, topic, count, difficulty);

    // Generate via AI
    const response = await generateText({
      model: openrouter('openai/gpt-4o-mini'),
      prompt,
      temperature: 0.8,
      maxTokens: Math.min(8000, count * 150),
    });

    // Parse questions
    const questions = parseQuestions(response.text);
    console.log(`[Generate] Parsed ${questions.length} questions`);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No valid questions generated', rawResponse: response.text.substring(0, 500) },
        { status: 500 }
      );
    }

    // Get or create topic
    const topicId = await getOrCreateTopic(exam, subject, topic);

    // Save to database
    let saved = 0;
    const errors: string[] = [];

    for (const q of questions) {
      try {
        await execute(
          `INSERT INTO fact_exam_questions (
            topic_id, question, options, correct_answer, explanation,
            difficulty, source, valid_from, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
        errors.push(`Failed: ${q.question.substring(0, 50)}...`);
      }
    }

    return NextResponse.json({
      success: true,
      generated: questions.length,
      saved,
      failed: questions.length - saved,
      errors: errors.slice(0, 5), // First 5 errors only
    });
  } catch (error) {
    console.error('[Generate] Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}

function buildPrompt(exam: string, subject: string, topic: string, count: number, difficulty: string): string {
  return `You are an expert question generator for ${exam} (${subject} - ${topic}).

Generate EXACTLY ${count} high-quality multiple-choice questions.

DIFFICULTY: ${difficulty === 'mixed' ? 'Mix of easy (30%), medium (50%), hard (20%)' : difficulty}

REQUIREMENTS:
1. Each question must have EXACTLY 4 options (A, B, C, D)
2. Only ONE correct answer
3. Explanation must be 2-3 sentences
4. Options must be plausible
5. Follow ${exam} exam pattern

OUTPUT FORMAT (STRICT JSON):
Return ONLY a valid JSON array:

[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation...",
    "difficulty": "easy"
  }
]

IMPORTANT:
- correctAnswer is 0-indexed (0=A, 1=B, 2=C, 3=D)
- Return EXACTLY ${count} questions
- Valid JSON only (no markdown, no comments)
- All strings must be properly escaped

Generate now:`;
}

function parseQuestions(text: string): any[] {
  try {
    // Strip markdown
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    }

    // Extract JSON array
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error('[Parse] No JSON array found');
      return [];
    }

    const questions = JSON.parse(match[0]);

    // Validate
    return questions.filter((q: any) => {
      return (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        q.explanation &&
        ['easy', 'medium', 'hard'].includes(q.difficulty)
      );
    });
  } catch (err) {
    console.error('[Parse] Failed:', err);
    return [];
  }
}

async function getOrCreateTopic(exam: string, subject: string, topic: string): Promise<number> {
  const topicName = `${exam}_${subject}_${topic}`.toLowerCase().replace(/\s+/g, '_');

  // Try to find
  const existing = await queryAll('SELECT id FROM dim_topics WHERE topic_name = $1 LIMIT 1', [topicName]);

  if (existing.length > 0) {
    return existing[0].id;
  }

  // Create
  await execute(
    `INSERT INTO dim_topics (topic_name, category, scope, description, keywords)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      topicName,
      `${exam}_${subject}`.toLowerCase(),
      'exam-specific',
      `${exam} ${subject} - ${topic}`,
      `${exam}, ${subject}, ${topic}`,
    ]
  );

  // Fetch newly created
  const newTopic = await queryAll('SELECT id FROM dim_topics WHERE topic_name = $1 LIMIT 1', [topicName]);
  return newTopic[0].id;
}
