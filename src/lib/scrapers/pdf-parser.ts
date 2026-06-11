/**
 * PDF Parser Utility
 * Provides helper functions for extracting structured data from PDFs
 *
 * Supports:
 * - Text extraction via pdfjs-dist (fast, searchable)
 * - OCR via Tesseract.js (for scanned PDFs)
 * - Section detection (passages, questions)
 * - Difficulty estimation
 */

import axios from 'axios';

export interface PdfExtractionOptions {
  useOcr?: boolean;
  language?: string;
  maxPages?: number;
}

export interface ExtractedSection {
  sectionName: string;
  content: string;
  startPage: number;
  endPage: number;
  confidence: number;
}

class PdfParser {
  /**
   * Extract plain text from PDF
   */
  static async extractText(pdfBuffer: Buffer, options?: PdfExtractionOptions): Promise<string> {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(pdfBuffer);

      if (options?.maxPages && data.text.split(/\f/).length > options.maxPages) {
        const pages = data.text.split(/\f/).slice(0, options.maxPages);
        return pages.join('\n\n--- PAGE BREAK ---\n\n');
      }

      return data.text;
    } catch (err) {
      throw new Error(`PDF text extraction failed: ${(err as Error).message}`);
    }
  }

  /**
   * Extract metadata from PDF
   */
  static async extractMetadata(pdfBuffer: Buffer): Promise<Record<string, any>> {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(pdfBuffer);
      return {
        numPages: data.numpages,
        producer: data.info?.Producer,
        creator: data.info?.Creator,
        creationDate: data.info?.CreationDate,
        modificationDate: data.info?.ModDate,
        title: data.info?.Title,
        subject: data.info?.Subject,
        author: data.info?.Author,
      };
    } catch (err) {
      throw new Error(`PDF metadata extraction failed: ${(err as Error).message}`);
    }
  }

  /**
   * Download PDF from URL
   */
  static async downloadPdf(url: string, timeout = 30000): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      return Buffer.from(response.data);
    } catch (err) {
      throw new Error(`Failed to download PDF: ${(err as Error).message}`);
    }
  }

  /**
   * Split text into pages
   */
  static splitIntoPages(text: string): string[] {
    return text.split(/\f|\n{4,}/).filter(p => p.trim().length > 0);
  }

  /**
   * Detect passages (substantial text blocks)
   */
  static detectPassages(text: string, minWords = 200, maxWords = 1000): ExtractedSection[] {
    const pages = this.splitIntoPages(text);
    const passages: ExtractedSection[] = [];

    pages.forEach((page, pageIndex) => {
      const lines = page.split('\n');
      let currentBlock = '';

      lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed.match(/^\d+$/) || trimmed.match(/READING|Questions?|ANSWERS?/i)) {
          if (currentBlock.length > 0) {
            const wordCount = currentBlock.split(/\s+/).length;
            if (wordCount >= minWords && wordCount <= maxWords) {
              passages.push({
                sectionName: `Passage ${passages.length + 1}`,
                content: currentBlock.trim(),
                startPage: pageIndex,
                endPage: pageIndex,
                confidence: 0.95,
              });
            }
            currentBlock = '';
          }
        } else if (trimmed.length > 20) {
          currentBlock += ' ' + trimmed;
        }
      });

      if (currentBlock.length > 0) {
        const wordCount = currentBlock.split(/\s+/).length;
        if (wordCount >= minWords && wordCount <= maxWords) {
          passages.push({
            sectionName: `Passage ${passages.length + 1}`,
            content: currentBlock.trim(),
            startPage: pageIndex,
            endPage: pageIndex,
            confidence: 0.95,
          });
        }
      }
    });

    return passages;
  }

  /**
   * Detect question blocks
   */
  static detectQuestions(text: string): Array<{ number: number; text: string }> {
    const lines = text.split('\n');
    const questions: Array<{ number: number; text: string }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^(\d+)\.\s+(.+)$/);

      if (match) {
        const [, numStr, questionText] = match;
        const num = parseInt(numStr, 10);

        if (num >= 1 && num <= 40) {
          let fullText = questionText;
          let j = i + 1;

          while (j < lines.length && !lines[j].match(/^\d+\./)) {
            const nextLine = lines[j].trim();
            if (nextLine.length > 0 && !nextLine.match(/^[A-D]$/)) {
              fullText += ' ' + nextLine;
              j++;
            } else {
              break;
            }
          }

          questions.push({ number: num, text: fullText });
        }
      }
    }

    return questions;
  }

  /**
   * Extract options (A, B, C, D)
   */
  static extractOptions(text: string): string[] {
    const options: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const match = line.match(/^([A-D])\.\s+(.+)$/);
      if (match) {
        options.push(match[2].trim());
      }
    }

    return options;
  }

  /**
   * Normalize text
   */
  static normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/­/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  /**
   * Estimate difficulty
   */
  static estimateDifficulty(text: string, questionType: string): 'easy' | 'medium' | 'hard' {
    const wordCount = text.split(/\s+/).length;
    const avgWordLength = text.split(/\s+/).reduce((sum, w) => sum + w.length, 0) / wordCount;

    const complexWords = ['ephemeral', 'ubiquitous', 'esoteric', 'paradigm', 'phenomenon'];
    const complexCount = complexWords.filter(w => text.toLowerCase().includes(w)).length;

    const sentences = text.split(/\.\s+/).length;
    const avgSentenceLength = wordCount / sentences;

    const requiresInference = /infer|suggest|imply|author.*attitude/i.test(text);

    let score = 0;
    if (avgWordLength > 5.5) score += 2;
    if (complexCount > 2) score += 3;
    if (avgSentenceLength > 20) score += 2;
    if (requiresInference) score += 2;
    if (questionType === 'true-false') score -= 1;

    if (score >= 6) return 'hard';
    if (score >= 3) return 'medium';
    return 'easy';
  }

  /**
   * Validate quality
   */
  static validateQuality(text: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!text || text.trim().length === 0) issues.push('Empty text');
    if (text.length < 50) issues.push('Text too short');

    const specialCharRatio =
      (text.match(/[^a-zA-Z0-9\s\.\,\'\"\-\(\)]/g) || []).length / text.length;
    if (specialCharRatio > 0.05) issues.push('High special character ratio');

    if (text.match(/(.)\1{5,}/)) issues.push('Excessive repeated characters');

    return { isValid: issues.length === 0, issues };
  }
}

export default PdfParser;
