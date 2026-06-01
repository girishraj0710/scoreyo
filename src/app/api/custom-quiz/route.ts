import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  trapAlerts: string[];
  difficulty: string;
}

/**
 * POST /api/custom-quiz
 * Upload study material and generate practice questions
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 10;
    const difficulty = (formData.get('difficulty') as string) || 'medium';

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, PPTX, or TXT" },
        { status: 400 }
      );
    }

    // Extract text from file
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let extractedText: string;

    try {
      if (file.type === 'text/plain') {
        // Text file - simple conversion
        extractedText = new TextDecoder().decode(uint8Array);
      } else if (file.type === 'application/pdf') {
        // PDF - extract text using pdf-parse
        console.log('[Custom Quiz] Processing PDF file...');
        const pdfParse = await import('pdf-parse');
        const pdf = (pdfParse as any).default || pdfParse;
        const pdfData = await pdf(Buffer.from(uint8Array));
        extractedText = pdfData.text;
        console.log('[Custom Quiz] PDF text extracted:', extractedText.length, 'characters');
      } else {
        // DOCX/PPTX - for now, return error
        return NextResponse.json(
          {
            error: "DOCX/PPTX processing coming soon! For now, please use PDF or paste text",
            temporaryWorkaround: true
          },
          { status: 400 }
        );
      }
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      return NextResponse.json(
        { error: "Could not extract text from file. Please ensure the file is not corrupted." },
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 100) {
      return NextResponse.json(
        { error: "File contains too little text. Please upload a file with at least 100 characters." },
        { status: 400 }
      );
    }

    // Limit text length
    const maxWords = 50000;
    const words = extractedText.split(/\s+/).length;
    if (words > maxWords) {
      extractedText = extractedText.split(/\s+/).slice(0, maxWords).join(' ');
    }

    // Generate questions using AI
    const prompt = `You are an expert educator creating practice questions from study material.

STUDY MATERIAL:
${extractedText.slice(0, 15000)}

TASK:
Generate exactly ${numQuestions} multiple-choice questions at ${difficulty} difficulty level.

REQUIREMENTS:
1. Test understanding of KEY CONCEPTS from the material
2. Mix question types:
   - 40% Factual recall (definitions, facts)
   - 30% Conceptual understanding (why, how)
   - 30% Application (scenarios, examples)
3. Each question has exactly 4 options (A, B, C, D)
4. Include detailed explanation for correct answer
5. Add trap alerts explaining why wrong answers are tempting

OUTPUT FORMAT - Return ONLY valid JSON array, no markdown:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Detailed explanation of why this is correct",
    "trapAlerts": ["Why A is wrong", "Why C is wrong", "Why D is wrong"],
    "difficulty": "${difficulty}"
  }
]

Generate exactly ${numQuestions} high-quality questions. Return ONLY the JSON array, no other text.`;

    console.log('[Custom Quiz] Generating questions for:', file.name, 'Questions:', numQuestions);

    let questions: QuizQuestion[];

    try {
      const { text } = await generateText({
        model: openrouter("google/gemini-2.0-flash-exp:free"),
        prompt,
        maxOutputTokens: 4000,
        temperature: 0.7,
      });

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      questions = JSON.parse(jsonMatch[0]);

      // Validate questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      // Ensure we have the requested number
      questions = questions.slice(0, numQuestions);

    } catch (aiError) {
      console.error('[Custom Quiz] AI generation error:', aiError);
      return NextResponse.json(
        {
          error: "Failed to generate questions from your material. Please try again or upload different content.",
          details: aiError instanceof Error ? aiError.message : 'AI generation failed'
        },
        { status: 500 }
      );
    }

    // Return generated quiz
    return NextResponse.json({
      success: true,
      quiz: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        wordCount: words,
        questions,
        numQuestions: questions.length,
        difficulty
      }
    });

  } catch (error) {
    console.error('[Custom Quiz] Error:', error);
    return NextResponse.json(
      {
        error: "Failed to process file",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
