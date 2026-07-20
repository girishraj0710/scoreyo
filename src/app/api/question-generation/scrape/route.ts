/**
 * Question Generation: Scrape PYQ
 * POST /api/question-generation/scrape
 *
 * Triggers scraping of IELTS/TOEFL/Cambridge questions
 * and stores them in the database with audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';

interface ScrapeRequest {
  exam?: 'IELTS' | 'TOEFL' | 'Cambridge';
  targetCount?: number;
}

interface ScrapeResponse {
  batchId: string;
  exam: string;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  questionsRequested: number;
  estimatedCompletion: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add auth check (admin only)
    // const userId = req.cookies.get('scoreyo-user-id')?.value;

    const body: ScrapeRequest = await req.json();
    const exam = body.exam || 'IELTS';
    const targetCount = body.targetCount || 500;

    console.log(`[Scraper] Starting scrape for ${exam}, target: ${targetCount} questions`);

    // Create scrape batch record
    const batchId = `batch_${Date.now()}_${exam.toLowerCase()}`;

    // Get exam ID from dim_exams
    const examRecord = await queryOne(
      'SELECT id FROM dim_exams WHERE exam_code = ?',
      [exam.toLowerCase()]
    );

    if (!examRecord) {
      return NextResponse.json(
        {
          error: `Exam not found: ${exam}`,
          message: 'Please ensure exam is registered in dim_exams table',
        },
        { status: 400 }
      );
    }

    const examId = examRecord.id;

    // Create pyq_scrape_logs entry
    await execute(
      `INSERT INTO pyq_scrape_logs (
        exam_id,
        source_url,
        source_type,
        status,
        started_at
      ) VALUES (?, ?, ?, ?, ?)`,
      [examId, `scraper:${exam}`, 'official', 'in_progress', new Date().toISOString()]
    );

    console.log(`[Scraper] Batch ${batchId} created for exam_id=${examId}`);

    // In production, would trigger async scraper job here
    // For now, return immediate response with batch tracking

    const response: ScrapeResponse = {
      batchId,
      exam,
      status: 'started',
      questionsRequested: targetCount,
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 min
      message: `Started scraping ${exam} - batch ID: ${batchId}`,
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error('[Scraper] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to start scrape',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/question-generation/scrape?batch_id=...
 * Check status of scraping batch
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batch_id');

    if (!batchId) {
      return NextResponse.json(
        { error: 'batch_id parameter required' },
        { status: 400 }
      );
    }

    // TODO: Query pyq_scrape_logs to get status

    return NextResponse.json({
      batchId,
      status: 'in_progress',
      message: 'Scraping in progress',
    });
  } catch (error) {
    console.error('[Scraper] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get scrape status' },
      { status: 500 }
    );
  }
}
