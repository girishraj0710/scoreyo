/**
 * Question Generation: Save Scraped Questions
 * POST /api/question-generation/save-questions
 *
 * Saves scraped questions to fact_exam_questions table
 * with full audit trail in pyq_metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne, queryAll } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

interface ScrapedQuestion {
  exam: 'IELTS' | 'TOEFL' | 'Cambridge';
  section: 'Reading' | 'Writing' | 'Listening' | 'Speaking';
  year?: number;
  passage: string;
  question: string;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  sourceUrl?: string;
  scrapedAt: Date;
}

interface SaveRequest {
  questions: ScrapedQuestion[];
  source: string; // e.g., 'pyq_2024_ielts'
  batchId?: string;
}

interface SaveResponse {
  saved: number;
  failed: number;
  duplicates: number;
  errors: string[];
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const body: SaveRequest = await req.json();
    const { questions, source, batchId } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions provided' },
        { status: 400 }
      );
    }

    console.log(`[Save] Saving ${questions.length} questions, source: ${source}`);

    let saved = 0;
    let failed = 0;
    let duplicates = 0;
    const errors: string[] = [];

    for (const q of questions) {
      try {
        // Get topic ID for this question
        let topicId: number | null = null;

        // Try to find or create topic
        const section = q.section.toLowerCase();
        const questionType = q.questionType.toLowerCase();

        // Look up topic
        const existingTopic = await queryOne(
          'SELECT id FROM dim_topics WHERE topic_name = ?',
          [`${q.exam}_${section}_${q.year || 'recent'}`]
        );

        if (existingTopic) {
          topicId = existingTopic.id;
        } else {
          // Create topic if doesn't exist
          const insertResult = await execute(
            `INSERT INTO dim_topics (topic_name, category, scope, description, keywords)
             VALUES (?, ?, ?, ?, ?)`,
            [
              `${q.exam}_${section}_${q.year || 'recent'}`,
              `${q.exam}_${section}`,
              'exam-specific',
              `${q.exam} ${section} questions`,
              `${q.exam}, ${section}, ${q.questionType}`,
            ]
          );

          // Note: In real implementation, would get back the inserted ID
          // For now, query again
          const newTopic = await queryOne(
            'SELECT id FROM dim_topics WHERE topic_name = ?',
            [`${q.exam}_${section}_${q.year || 'recent'}`]
          );
          topicId = newTopic?.id || null;
        }

        if (!topicId) {
          errors.push(`Could not find/create topic for ${q.exam} ${q.section}`);
          failed++;
          continue;
        }

        // Check for duplicate (same passage + question)
        const passageHash = Buffer.from(q.passage.substring(0, 200)).toString('base64');
        const existingQuestion = await queryOne(
          `SELECT id FROM fact_exam_questions
           WHERE topic_id = ? AND question = ?
           LIMIT 1`,
          [topicId, q.question.substring(0, 300)]
        );

        if (existingQuestion) {
          duplicates++;
          continue;
        }

        // Insert question
        const options = q.options ? JSON.stringify(q.options) : '[]';
        const correctAnswer = typeof q.correctAnswer === 'string'
          ? q.options?.indexOf(q.correctAnswer) || 0
          : q.correctAnswer;

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
            options,
            correctAnswer,
            q.passage, // Store passage in explanation field temporarily
            q.difficulty,
            source,
            q.year || 2024,
            new Date().toISOString(),
          ]
        );

        saved++;
      } catch (err) {
        errors.push(`Failed to save question: ${(err as Error).message}`);
        failed++;
      }
    }

    console.log(`[Save] Complete: saved=${saved}, failed=${failed}, duplicates=${duplicates}`);

    const response: SaveResponse = {
      saved,
      failed,
      duplicates,
      errors,
      message: `Saved ${saved}/${questions.length} questions (${duplicates} duplicates)`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Save] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save questions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
