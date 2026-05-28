/**
 * PDF Parser for Educational Content
 * Extracts questions from NCERT, NTA, and other government PDFs
 */

export interface ParsedPDFContent {
  text: string;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    pageCount?: number;
  };
}

/**
 * Parse PDF using external API or library
 * Note: In production, use pdf-parse npm package or a PDF API
 */
export async function parsePDF(pdfBuffer: Buffer): Promise<ParsedPDFContent> {
  // Option 1: Use pdf-parse library (needs to be installed)
  // const pdfParse = require('pdf-parse');
  // const data = await pdfParse(pdfBuffer);
  // return { text: data.text, metadata: data.info };

  // Option 2: Use external PDF parsing API (more reliable for complex PDFs)
  // For MVP, we'll use OpenRouter's vision capabilities to read PDF pages

  return {
    text: '',
    metadata: {},
  };
}

/**
 * Extract MCQs from text using pattern matching
 * NCERT Exemplar follows predictable formats:
 *
 * Multiple Choice Questions:
 * 1.1 Question text here?
 * (a) Option A
 * (b) Option B
 * (c) Option C
 * (d) Option D
 *
 * Answer: (c)
 */
export function extractMCQsFromText(text: string): Array<{
  question: string;
  options: string[];
  answer?: string;
}> {
  const questions: Array<{
    question: string;
    options: string[];
    answer?: string;
  }> = [];

  // Split by question numbers (e.g., "1.1", "1.2", "2.1")
  const questionBlocks = text.split(/\d+\.\d+\s+/);

  for (const block of questionBlocks) {
    if (block.trim().length < 20) continue;

    // Extract question text (before first option)
    const questionMatch = block.match(/^(.*?)(?=\(a\)|\(A\))/s);
    if (!questionMatch) continue;

    const questionText = questionMatch[1].trim();

    // Extract options (a), (b), (c), (d)
    const optionMatches = block.matchAll(/\(([a-dA-D])\)\s*([^\n(]+)/g);
    const options: string[] = [];

    for (const match of optionMatches) {
      options.push(match[2].trim());
    }

    if (options.length !== 4) continue; // Must have exactly 4 options

    // Extract answer if present
    const answerMatch = block.match(/Answer[:\s]+\(([a-dA-D])\)/i);
    const answer = answerMatch ? answerMatch[1].toLowerCase() : undefined;

    questions.push({
      question: questionText,
      options,
      answer,
    });
  }

  return questions;
}

/**
 * Extract explanations from NCERT Exemplar "Solutions" section
 */
export function extractExplanations(text: string): Map<string, string> {
  const explanations = new Map<string, string>();

  // NCERT Exemplar has "Solutions" section at the end
  const solutionsMatch = text.match(/SOLUTIONS([\s\S]*)/i);
  if (!solutionsMatch) return explanations;

  const solutionsText = solutionsMatch[1];

  // Extract solution blocks (e.g., "1.1 Solution text...")
  const solutionBlocks = solutionsText.split(/(\d+\.\d+)\s+/);

  for (let i = 1; i < solutionBlocks.length; i += 2) {
    const questionNum = solutionBlocks[i];
    const explanation = solutionBlocks[i + 1]?.trim().split(/\n\n/)[0]; // First paragraph

    if (explanation) {
      explanations.set(questionNum, explanation);
    }
  }

  return explanations;
}

/**
 * Clean and normalize question text
 */
export function cleanQuestionText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\[\s*Figure\s*\d+\.\d+\s*\]/gi, '[diagram]') // Replace figure references
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * Determine difficulty based on NCERT chapter progression
 */
export function determineDifficulty(
  chapterNumber: number,
  questionNumber: string
): 'easy' | 'medium' | 'hard' {
  // Early chapters = easier
  if (chapterNumber <= 5) return 'easy';
  if (chapterNumber <= 10) return 'medium';

  // Question numbering: 1.1-1.5 easy, 1.6-1.15 medium, 1.16+ hard
  const qNum = parseFloat(questionNumber.split('.')[1] || '0');
  if (qNum <= 5) return 'easy';
  if (qNum <= 15) return 'medium';
  return 'hard';
}

/**
 * Map NCERT subjects to PrepGenie exam relevance
 */
export function getExamRelevance(subject: string, classNum: number): string[] {
  const relevance: string[] = [];

  if (classNum >= 11) {
    if (subject === 'physics' || subject === 'chemistry') {
      relevance.push('JEE', 'NEET');
    } else if (subject === 'biology') {
      relevance.push('NEET');
    } else if (subject === 'mathematics') {
      relevance.push('JEE');
    }
  }

  return relevance;
}
