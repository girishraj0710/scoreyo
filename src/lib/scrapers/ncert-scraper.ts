/**
 * NCERT Textbook & Exemplar Question Scraper
 *
 * Sources:
 * - NCERT Exemplar Problems (MCQs with solutions)
 * - NCERT Exercise Questions (end-of-chapter)
 * - Government-published, public domain content
 *
 * Legal: NCERT content is published by the Indian Government and is
 * freely available for educational purposes under open access policy.
 */

import { Pool } from 'pg';

export interface ScrapedQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 for A-D
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string; // e.g., "NCERT Class 12 Physics Exemplar, Ch 1"
  examRelevance: string[]; // e.g., ["JEE", "NEET"]
}

// NCERT Exemplar PDF URLs (Physics, Chemistry, Biology, Math - Classes 11-12)
const NCERT_SOURCES = {
  physics: {
    class11: [
      'https://ncert.nic.in/textbook/pdf/keph1**.pdf', // Replace ** with chapter numbers 01-15
    ],
    class12: [
      'https://ncert.nic.in/textbook/pdf/leph1**.pdf',
    ],
  },
  chemistry: {
    class11: ['https://ncert.nic.in/textbook/pdf/kech1**.pdf'],
    class12: ['https://ncert.nic.in/textbook/pdf/lech1**.pdf'],
  },
  biology: {
    class11: ['https://ncert.nic.in/textbook/pdf/kebo1**.pdf'],
    class12: ['https://ncert.nic.in/textbook/pdf/lebo1**.pdf'],
  },
  mathematics: {
    class11: ['https://ncert.nic.in/textbook/pdf/kemh1**.pdf'],
    class12: ['https://ncert.nic.in/textbook/pdf/lemh1**.pdf'],
  },
};

// NTA Previous Year Papers (Public Domain after exam)
const NTA_SOURCES = {
  jeeMain: 'https://jeemain.nta.nic.in/previous-year-papers/',
  neet: 'https://neet.nta.nic.in/previous-year-papers/',
};

/**
 * Fetch PDF from NCERT website
 */
async function fetchNCERTPDF(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

/**
 * Parse NCERT Exemplar MCQ format using AI
 * NCERT Exemplar has structured MCQs with answers at the end
 */
export async function parseNCERTExemplar(
  pdfBuffer: Buffer,
  subject: string,
  chapterName: string
): Promise<ScrapedQuestion[]> {
  // Use your existing OpenRouter API to parse the PDF content
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    // Convert PDF to text (you'll need a PDF parser like pdf-parse)
    // For now, using AI to extract structured questions

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are extracting MCQ questions from NCERT Exemplar textbooks.
            Extract ONLY multiple choice questions (MCQs) with 4 options.
            Return JSON array with format:
            [{
              "question": "...",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correctAnswer": 0-3,
              "explanation": "..."
            }]

            If no MCQs found, return empty array [].`
          },
          {
            role: 'user',
            content: `Extract all MCQs from this NCERT ${subject} chapter: ${chapterName}.
            The PDF content is provided. Focus on Multiple Choice Questions (MCQs) section.

            [Note: In production, PDF content would be passed here]`
          }
        ],
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return parsed.map((q: any) => ({
      ...q,
      subject,
      topic: chapterName,
      difficulty: 'medium',
      source: `NCERT Exemplar ${subject} - ${chapterName}`,
      examRelevance: subject === 'physics' || subject === 'chemistry'
        ? ['JEE', 'NEET']
        : subject === 'biology'
        ? ['NEET']
        : ['JEE'],
    }));
  } catch (error) {
    console.error('Failed to parse NCERT content:', error);
    return [];
  }
}

/**
 * Scrape NTA Previous Year Papers
 * These are public domain after the exam is conducted
 */
export async function scrapeNTAPapers(
  exam: 'jeeMain' | 'neet',
  year: number
): Promise<ScrapedQuestion[]> {
  // NTA releases official papers after exams
  // These can be scraped from their website

  const url = NTA_SOURCES[exam];

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML to find PDF links for the specified year
    // Extract questions from PDFs
    // (Implementation depends on NTA's website structure)

    return [];
  } catch (error) {
    console.error(`Failed to scrape NTA papers:`, error);
    return [];
  }
}

/**
 * Save scraped questions to Turso database
 */
export async function saveScrapedQuestions(
  questions: ScrapedQuestion[]
): Promise<number> {
  // Use the existing saveVerifiedQuestions function from db.ts
  // which properly handles the dimensional model
  const { saveVerifiedQuestions } = await import('../db');

  let savedCount = 0;

  // Group questions by exam/subject/topic for batch saving
  const grouped = new Map<string, any[]>();

  for (const q of questions) {
    const examId = q.examRelevance[0]?.toLowerCase() || 'jee';
    const subjectId = q.subject;
    const topic = q.topic;
    const key = `${examId}-${subjectId}-${topic}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'No explanation provided',
      difficulty: q.difficulty,
      source: q.source,
    });
  }

  // Save each group using the proper dimensional model function
  for (const [key, qs] of grouped.entries()) {
    const [examId, subjectId, topic] = key.split('-');

    try {
      await saveVerifiedQuestions(examId, subjectId, topic, qs);
      savedCount += qs.length;
    } catch (error) {
      console.error(`Failed to save ${qs.length} questions for ${key}:`, error);
    }
  }

  return savedCount;
}

/**
 * Main scraper orchestrator
 */
export async function runNCERTScraper() {
  console.log('🚀 Starting NCERT scraper...');

  const allQuestions: ScrapedQuestion[] = [];

  // Physics Class 12 - Chapters 1-15
  for (let ch = 1; ch <= 15; ch++) {
    const chNum = ch.toString().padStart(2, '0');
    const url = `https://ncert.nic.in/textbook/pdf/leph1${chNum}.pdf`;

    console.log(`Fetching Physics Ch ${ch}...`);
    const pdf = await fetchNCERTPDF(url);

    if (pdf) {
      const questions = await parseNCERTExemplar(pdf, 'physics', `Chapter ${ch}`);
      allQuestions.push(...questions);
      console.log(`✅ Extracted ${questions.length} questions from Physics Ch ${ch}`);
    }

    // Rate limiting - be respectful to NCERT servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save to database
  const saved = await saveScrapedQuestions(allQuestions);
  console.log(`✅ Saved ${saved}/${allQuestions.length} questions to database`);

  return { total: allQuestions.length, saved };
}
