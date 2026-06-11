/**
 * IELTS Reading Scraper
 * Extracts reading questions from official IELTS practice test PDFs
 *
 * Target: 300+ questions from 15+ official IELTS reading test papers
 * Format: 3 passages per test × 40 questions = 600 questions available
 * Goal: Extract 300+ with <2% data quality issues
 */

import axios from 'axios';

export interface IELTSPassage {
  passageNumber: 1 | 2 | 3;
  title: string;
  content: string;
  wordCount: number;
  questionRange: [number, number]; // e.g., [1, 13]
}

export interface IELTSQuestion {
  passageNumber: 1 | 2 | 3;
  questionNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank' | 'heading-match';
  questionText: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  year: number;
  testNumber: number;
  sourceUrl: string;
}

interface ExtractionResult {
  passages: IELTSPassage[];
  questions: IELTSQuestion[];
  rawText: string;
  pageCount: number;
  status: 'success' | 'partial' | 'error';
}

class IELTSReadingScraper {
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

  /**
   * Extract text from PDF buffer
   * Returns page-by-page text for analysis
   */
  async extractPdfText(pdfBuffer: Buffer): Promise<string> {
    try {
      // Dynamic import to avoid ESM/CommonJS issues
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (err) {
      throw new Error(`PDF parsing failed: ${(err as Error).message}`);
    }
  }

  /**
   * Download a PDF from URL
   * Returns buffer ready for extraction
   */
  async downloadPdf(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': this.userAgent,
        },
        timeout: 30000,
      });
      return Buffer.from(response.data);
    } catch (err) {
      throw new Error(`Download failed for ${url}: ${(err as Error).message}`);
    }
  }

  /**
   * Extract IELTS Reading structure from raw PDF text
   * IELTS Reading has predictable format:
   * - Passage 1 (300-400 words)
   * - Questions 1-13/14 (mix of MCQ, T/F, matching)
   * - Passage 2 (similar)
   * - Questions 14/15-26/27 (similar)
   * - Passage 3 (similar)
   * - Questions 27/28-40 (similar)
   */
  private parseIELTSReadingStructure(
    pdfText: string,
    year: number,
    testNumber: number,
    sourceUrl: string
  ): ExtractionResult {
    const lines = pdfText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const passages: IELTSPassage[] = [];
    const questions: IELTSQuestion[] = [];

    // Heuristic: Find passages by looking for substantial text blocks
    // IELTS passages typically start after "READING" or "Reading" and end before "Questions"
    let currentPassage = '';
    let passageCount = 0;
    let inPassage = false;
    let currentQuestionNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

      // Detect passage boundaries (heuristic)
      if (
        line.match(/^(Questions?|QUESTIONS?|\d+\.)/) &&
        line.length < 100 &&
        currentPassage.length > 200
      ) {
        // End of passage
        if (currentPassage.trim().length > 200) {
          passageCount++;
          const passage: IELTSPassage = {
            passageNumber: (passageCount % 3 === 1 ? 1 : passageCount % 3 === 2 ? 2 : 3) as 1 | 2 | 3,
            title: `IELTS Reading Passage ${passageCount}`,
            content: currentPassage.trim(),
            wordCount: currentPassage.split(/\s+/).length,
            questionRange: [currentQuestionNumber + 1, currentQuestionNumber + 14],
          };
          passages.push(passage);
        }
        currentPassage = '';
        inPassage = false;
      }

      // Accumulate passage text
      if (inPassage && line.length > 10 && !line.match(/^\d+\.|^[A-D]$/)) {
        currentPassage += ' ' + line;
      } else if (
        !inPassage &&
        line.length > 50 &&
        line.length < 200 &&
        line.split(/\s+/).length > 8 &&
        !line.match(/READING|QUESTIONS?|ANSWERS?/i)
      ) {
        // Start of passage
        inPassage = true;
        currentPassage = line;
      }
    }

    // Simple question extraction heuristic
    // Questions are typically numbered 1-40 with answer options A-D or T/F/NG
    let qNum = 1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect question lines (start with number)
      if (line.match(/^\d+\.\s/) && qNum <= 40) {
        const questionText = line.replace(/^\d+\.\s*/, '').trim();

        if (questionText.length > 5) {
          // Determine difficulty based on question type and position
          let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
          if (qNum <= 13) difficulty = 'easy'; // First passage usually easier
          else if (qNum >= 28) difficulty = 'hard'; // Third passage harder
          else difficulty = 'medium';

          // Determine question type
          let questionType: 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank' | 'heading-match' =
            'multiple-choice';
          if (questionText.match(/True|False|Not Given/i)) questionType = 'true-false';
          else if (questionText.match(/Match|heading|^[A-D]$/i)) questionType = 'matching';
          else if (questionText.includes('___') || questionText.includes('blank')) questionType = 'fill-blank';

          // Extract answer if available (typically on next few lines)
          let correctAnswer: string | number = 'A'; // Default
          if (i + 1 < lines.length) {
            const nextLines = lines.slice(i + 1, i + 5).join(' ');
            const answerMatch = nextLines.match(/^(?:Answer|Ans)[?:]?\s*([A-D]|True|False|Not Given)/i);
            if (answerMatch) {
              correctAnswer = answerMatch[1];
            }
          }

          const question: IELTSQuestion = {
            passageNumber: (Math.ceil((qNum % 40) / 13) as 1 | 2 | 3) || 3,
            questionNumber: qNum,
            questionType,
            questionText,
            options:
              questionType === 'true-false'
                ? ['True', 'False', 'Not Given']
                : questionType === 'multiple-choice'
                ? ['A', 'B', 'C', 'D']
                : undefined,
            correctAnswer,
            difficulty,
            year,
            testNumber,
            sourceUrl,
          };

          questions.push(question);
          qNum++;
        }
      }
    }

    return {
      passages,
      questions,
      rawText: pdfText,
      pageCount: pdfText.split(/\f/).length,
      status: questions.length > 30 ? 'success' : 'partial',
    };
  }

  /**
   * Calibrate question difficulty based on vocabulary and syntax
   */
  private calibrateDifficulty(questionText: string, passageContent: string): 'easy' | 'medium' | 'hard' {
    // Complex vocabulary indicators
    const complexWords = [
      'ephemeral',
      'ubiquitous',
      'esoteric',
      'paradigm',
      'phenomenon',
      'oscillate',
      'ameliorate',
      'obstreperous',
    ];
    const hasComplexVocab = complexWords.some(word => passageContent.toLowerCase().includes(word));

    // Inference requirements
    const requiresInference = questionText.match(/infer|suggest|imply|indicate|author.*attitude/i);

    // Sentence length analysis
    const avgSentenceLength = passageContent.split(/\./).reduce((sum, s) => sum + s.split(/\s+/).length, 0) / passageContent.split(/\./).length;

    if (hasComplexVocab && requiresInference && avgSentenceLength > 20) return 'hard';
    if (requiresInference || avgSentenceLength > 15) return 'medium';
    return 'easy';
  }

  /**
   * Main scraping method for a single IELTS test PDF
   */
  async scrapeIELTSTest(
    pdfUrl: string,
    year: number,
    testNumber: number
  ): Promise<{
    passages: IELTSPassage[];
    questions: IELTSQuestion[];
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(`  Downloading IELTS ${year} Test ${testNumber}...`);
      const pdfBuffer = await this.downloadPdf(pdfUrl);

      console.log(`  Extracting text from PDF...`);
      const pdfText = await this.extractPdfText(pdfBuffer);

      console.log(`  Parsing IELTS structure...`);
      const result = this.parseIELTSReadingStructure(pdfText, year, testNumber, pdfUrl);

      // Calibrate difficulty
      result.questions.forEach(q => {
        const passage = result.passages.find(p => p.passageNumber === q.passageNumber);
        if (passage) {
          q.difficulty = this.calibrateDifficulty(q.questionText, passage.content);
        }
      });

      return {
        passages: result.passages,
        questions: result.questions,
        success: result.status === 'success' || result.status === 'partial',
        error: result.status === 'error' ? 'Failed to extract questions' : undefined,
      };
    } catch (err) {
      return {
        passages: [],
        questions: [],
        success: false,
        error: `Scraping failed: ${(err as Error).message}`,
      };
    }
  }

  /**
   * Batch scrape multiple IELTS tests
   * Returns combined results with deduplication
   */
  async scrapeMultipleTests(
    testUrls: Array<{ url: string; year: number; testNumber: number }>
  ): Promise<{
    totalQuestions: number;
    totalParsed: number;
    duplicates: number;
    questions: IELTSQuestion[];
    errors: string[];
  }> {
    const allQuestions: IELTSQuestion[] = [];
    const seenQuestions = new Set<string>();
    let duplicates = 0;
    const errors: string[] = [];

    for (const test of testUrls) {
      console.log(`\nScraping: IELTS ${test.year} Test ${test.testNumber}`);
      const result = await this.scrapeIELTSTest(test.url, test.year, test.testNumber);

      if (!result.success) {
        errors.push(`Test ${test.testNumber}: ${result.error}`);
        continue;
      }

      for (const q of result.questions) {
        // Deduplicate by passage + question text
        const key = `${q.passageNumber}||${q.questionText.substring(0, 50)}`;
        if (!seenQuestions.has(key)) {
          seenQuestions.add(key);
          allQuestions.push(q);
        } else {
          duplicates++;
        }
      }
    }

    return {
      totalQuestions: allQuestions.length + duplicates,
      totalParsed: allQuestions.length,
      duplicates,
      questions: allQuestions,
      errors,
    };
  }
}

/**
 * Sample IELTS test URLs (these are example URLs — replace with actual official sources)
 * Official sources:
 * - IELTS.org: https://www.ielts.org/book-ielts-practice-tests
 * - Cambridge: https://www.cambridgeenglish.org/exams-and-tests/ielts/
 * - IDP: https://www.idpielts.com/prepare
 *
 * In practice, PDFs should be downloaded from official sources
 */
const SAMPLE_IELTS_TEST_URLS = [
  // These are placeholder URLs — replace with actual test paper URLs
  { url: 'https://example.com/ielts-2024-test-1.pdf', year: 2024, testNumber: 1 },
  { url: 'https://example.com/ielts-2024-test-2.pdf', year: 2024, testNumber: 2 },
  { url: 'https://example.com/ielts-2023-test-1.pdf', year: 2023, testNumber: 1 },
  // Add more test URLs as needed (target: 15+ tests = 600 questions available)
];

/**
 * Main entry point for IELTS scraping
 */
export async function runIELTSScraper(
  customUrls?: Array<{ url: string; year: number; testNumber: number }>
) {
  const scraper = new IELTSReadingScraper();
  const urls = customUrls || SAMPLE_IELTS_TEST_URLS;

  console.log('🚀 Starting IELTS Reading Scraper');
  console.log(`📖 Target: ${urls.length} tests (${urls.length * 40} questions available)`);
  console.log('═'.repeat(60));

  const result = await scraper.scrapeMultipleTests(urls);

  console.log('\n📊 IELTS Scraping Results:');
  console.log('═'.repeat(60));
  console.log(`✅ Parsed: ${result.totalParsed} questions`);
  console.log(`⚠️  Duplicates: ${result.duplicates}`);
  console.log(`❌ Errors: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\nError details:');
    result.errors.forEach(e => console.log(`  - ${e}`));
  }

  // Difficulty distribution
  const difficultyDist = {
    easy: result.questions.filter(q => q.difficulty === 'easy').length,
    medium: result.questions.filter(q => q.difficulty === 'medium').length,
    hard: result.questions.filter(q => q.difficulty === 'hard').length,
  };

  console.log('\n📈 Difficulty Distribution:');
  console.log(`  Easy:   ${difficultyDist.easy} (${((difficultyDist.easy / result.totalParsed) * 100).toFixed(1)}%)`);
  console.log(`  Medium: ${difficultyDist.medium} (${((difficultyDist.medium / result.totalParsed) * 100).toFixed(1)}%)`);
  console.log(`  Hard:   ${difficultyDist.hard} (${((difficultyDist.hard / result.totalParsed) * 100).toFixed(1)}%)`);

  console.log('\n═'.repeat(60));
  console.log(`🎯 Ready to save ${result.totalParsed} questions to database`);
  console.log('📍 Next: POST /api/question-generation/save-questions\n');

  return result;
}

export default IELTSReadingScraper;
