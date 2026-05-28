/**
 * Admin API: Trigger NCERT Question Scraper
 *
 * POST /api/admin/scrape
 * Body: {
 *   "action": "scrape-chapter",
 *   "subject": "physics",
 *   "class": 12,
 *   "chapter": 1,
 *   "adminKey": "your-secret-key"
 * }
 *
 * Security: Requires admin key from environment variable
 */

import { NextRequest, NextResponse } from 'next/server';
import { processNCERTChapter } from '@/lib/scrapers/ai-pdf-scraper';

const ADMIN_KEY = process.env.SCRAPER_ADMIN_KEY;

export async function POST(request: NextRequest) {
  try {
    // Fail closed if admin key not configured
    if (!ADMIN_KEY) {
      console.error("SCRAPER_ADMIN_KEY not configured - admin endpoints disabled");
      return NextResponse.json(
        { error: "Admin endpoints not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action, subject, class: classNum, chapter, adminKey } = body;

    // Security check
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate inputs
    if (!['physics', 'chemistry', 'biology', 'mathematics'].includes(subject)) {
      return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
    }

    if (![11, 12].includes(classNum)) {
      return NextResponse.json({ error: 'Only Class 11 and 12 supported' }, { status: 400 });
    }

    if (chapter < 1 || chapter > 20) {
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    // Process based on action
    if (action === 'scrape-chapter') {
      const result = await processNCERTChapter(subject, classNum, chapter);

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Extracted ${result.questionsExtracted} questions from ${subject} Class ${classNum} Chapter ${chapter}`
          : `Failed: ${result.error}`,
        data: result,
      });
    }

    if (action === 'scrape-all') {
      // Scrape all chapters for a subject
      const results = [];
      const maxChapters = subject === 'physics' ? 15 : subject === 'chemistry' ? 16 : 15;

      for (let ch = 1; ch <= maxChapters; ch++) {
        console.log(`Processing ${subject} Class ${classNum} Chapter ${ch}...`);
        const result = await processNCERTChapter(subject, classNum, ch);
        results.push({ chapter: ch, ...result });

        // Rate limiting - wait 3 seconds between chapters
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      const totalExtracted = results.reduce((sum, r) => sum + r.questionsExtracted, 0);

      return NextResponse.json({
        success: true,
        message: `Scraped all ${maxChapters} chapters. Total questions: ${totalExtracted}`,
        data: results,
      });
    }

    if (action === 'test-extraction') {
      // Test AI extraction on sample text
      const { extractQuestionsWithAI } = await import('@/lib/scrapers/ai-pdf-scraper');

      const sampleText = `
        Multiple Choice Questions

        1.1 Which of the following is a vector quantity?
        (a) Speed
        (b) Distance
        (c) Velocity
        (d) Time

        Answer: (c)

        1.2 The SI unit of force is:
        (a) Joule
        (b) Watt
        (c) Newton
        (d) Pascal

        Answer: (c)
      `;

      const questions = await extractQuestionsWithAI(sampleText, 'physics', 'Test Chapter', 12);

      return NextResponse.json({
        success: true,
        message: `Extracted ${questions.length} test questions`,
        data: questions,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Scraper API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for status/health check
export async function GET(request: NextRequest) {
  const adminKey = request.nextUrl.searchParams.get('adminKey');

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return scraper statistics
  const { createClient } = await import('@libsql/client');
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    const stats = await db.execute(`
      SELECT
        source,
        COUNT(*) as count,
        subject,
        difficulty
      FROM verified_questions
      WHERE source LIKE '%NCERT%'
      GROUP BY source, subject, difficulty
    `);

    return NextResponse.json({
      success: true,
      message: 'Scraper statistics',
      data: {
        totalNCERTQuestions: stats.rows.length,
        breakdown: stats.rows,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
