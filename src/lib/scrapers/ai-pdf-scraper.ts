/**
 * AI-Powered PDF Question Scraper
 * Uses OpenRouter (Gemini) to intelligently extract questions from PDFs
 *
 * This approach is more reliable than regex parsing for:
 * - Complex formatting
 * - Mathematical equations
 * - Diagrams and figures
 * - Multi-language content
 */

import type { ScrapedQuestion } from './ncert-scraper';
import { fetchPDF } from './pdf-fetcher';

/**
 * Use AI to extract questions from PDF text
 * This leverages your existing OpenRouter setup
 */
export async function extractQuestionsWithAI(
  pdfText: string,
  subject: string,
  chapter: string,
  classNum: number
): Promise<ScrapedQuestion[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://scoreyo.in',
        'X-Title': 'Scoreyo NCERT Scraper',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting educational content from NCERT textbooks.
Your task is to identify and extract ONLY Multiple Choice Questions (MCQs).

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Include the correct answer (if provided in the text)
3. Include explanation/solution (if provided in the text)
4. Clean up formatting (remove line breaks, normalize spaces)
5. Mark questions with diagrams/figures as [DIAGRAM REQUIRED]

Return ONLY valid JSON array with this exact structure:
[
  {
    "question": "Full question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 2,
    "explanation": "Detailed explanation if available, otherwise empty string",
    "hasDiagram": false
  }
]

If no MCQs are found, return empty array: []
Do NOT include any text outside the JSON array.`,
          },
          {
            role: 'user',
            content: `Extract all MCQs from this NCERT ${subject} Class ${classNum} - ${chapter} content:

---START OF CONTENT---
${pdfText.slice(0, 50000)}
---END OF CONTENT---

Focus on the "Multiple Choice Questions" or "MCQ" section.
Skip "Very Short Answer", "Short Answer", "Long Answer" questions.`,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent extraction
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse the JSON response
    let parsed: any[];
    try {
      // Remove markdown code blocks if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      return [];
    }

    // Convert to ScrapedQuestion format
    const questions: ScrapedQuestion[] = parsed
      .filter(q => q.question && q.options?.length === 4)
      .map((q, index) => ({
        question: q.question.trim(),
        options: q.options.map((opt: string) => opt.trim()),
        correctAnswer: q.correctAnswer ?? -1, // -1 if answer not provided
        explanation: q.explanation?.trim() || '',
        subject: subject.toLowerCase(),
        topic: chapter,
        difficulty: determineDifficultyFromPosition(index, parsed.length),
        source: `NCERT Class ${classNum} ${capitalizeSubject(subject)} - ${chapter}`,
        examRelevance: getExamRelevance(subject, classNum),
      }));

    return questions;
  } catch (error) {
    console.error('AI extraction failed:', error);
    return [];
  }
}

/**
 * Process a full NCERT chapter (fetch + extract + save)
 */
export async function processNCERTChapter(
  subject: 'physics' | 'chemistry' | 'biology' | 'mathematics',
  classNum: 11 | 12,
  chapterNum: number
): Promise<{ success: boolean; questionsExtracted: number; error?: string }> {
  try {
    // Fetch the PDF
    const pdfUrl = getNCERTUrl(subject, classNum, chapterNum);
    console.log(`📥 Fetching: ${pdfUrl}`);

    const buffer = await fetchPDF(pdfUrl);
    console.log(`   ✅ Downloaded ${(buffer.length / 1024).toFixed(0)} KB`);

    // Convert PDF to text
    const pdfText = await extractTextFromPDF(buffer);
    console.log(`   📄 Extracted ${pdfText.length} characters of text`);
    console.log(`   📋 Preview: ${pdfText.slice(0, 500)}...`);

    if (!pdfText || pdfText.length < 100) {
      return { success: false, questionsExtracted: 0, error: 'Empty or invalid PDF' };
    }

    // Extract questions using AI
    console.log(`   🤖 Analyzing with AI (${(pdfText.length / 1000).toFixed(1)}k chars)...`);
    const questions = await extractQuestionsWithAI(
      pdfText,
      subject,
      `Chapter ${chapterNum}`,
      classNum
    );
    console.log(`   ✅ AI found ${questions.length} MCQs`);

    if (questions.length === 0) {
      return { success: true, questionsExtracted: 0, error: 'No MCQs found in this chapter' };
    }

    // Save to database
    const { saveScrapedQuestions } = await import('./ncert-scraper');
    const saved = await saveScrapedQuestions(questions);

    return { success: true, questionsExtracted: saved };
  } catch (error: any) {
    return { success: false, questionsExtracted: 0, error: error.message };
  }
}

/**
 * Get NCERT PDF URL for a specific chapter
 */
function getNCERTUrl(
  subject: string,
  classNum: number,
  chapterNum: number
): string {
  const chStr = chapterNum.toString().padStart(2, '0');
  const prefix = classNum === 11 ? 'ke' : 'le'; // Class 11 = ke, Class 12 = le

  const subjectCode = {
    physics: 'ph',
    chemistry: 'ch',
    biology: 'bo',
    mathematics: 'mh',
  }[subject] || 'ph';

  // Use regular NCERT textbooks (they're available and have some MCQs)
  return `https://ncert.nic.in/textbook/pdf/${prefix}${subjectCode}1${chStr}.pdf`;
}

/**
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse exports a function, not a class
    const pdfParse = require('pdf-parse');
    const result = await pdfParse(buffer);
    return result.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return '';
  }
}

/**
 * Determine difficulty based on position in chapter
 */
function determineDifficultyFromPosition(
  questionIndex: number,
  totalQuestions: number
): 'easy' | 'medium' | 'hard' {
  const position = (questionIndex + 1) / totalQuestions;

  if (position <= 0.33) return 'easy';
  if (position <= 0.66) return 'medium';
  return 'hard';
}

/**
 * Capitalize subject name
 */
function capitalizeSubject(subject: string): string {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

/**
 * Map subject to exam relevance
 */
function getExamRelevance(subject: string, classNum: number): string[] {
  if (classNum < 11) return [];

  const relevanceMap: Record<string, string[]> = {
    physics: ['JEE', 'NEET'],
    chemistry: ['JEE', 'NEET'],
    biology: ['NEET'],
    mathematics: ['JEE'],
  };

  return relevanceMap[subject.toLowerCase()] || [];
}
