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
    const file = formData.get('file') as File | null;
    const pastedText = formData.get('text') as string | null;
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 10;
    const difficulty = (formData.get('difficulty') as string) || 'medium';

    let extractedText: string;

    // Check if user pasted text directly
    if (pastedText && pastedText.trim()) {
      console.log('[Custom Quiz] Using pasted text, length:', pastedText.length);
      extractedText = pastedText.trim();

      // Validate pasted text length
      if (extractedText.length < 50) {
        return NextResponse.json(
          { error: "Text too short. Please paste at least 50 characters of study material." },
          { status: 400 }
        );
      }

      if (extractedText.length > 100000) {
        return NextResponse.json(
          { error: "Text too long. Maximum 100,000 characters. Please paste a smaller section." },
          { status: 400 }
        );
      }
    }
    // Check if user uploaded a file
    else if (file) {
      console.log('[Custom Quiz] Processing file upload:', file.name, file.type);

      // Validate file
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

    try {
      if (file.type === 'text/plain') {
        // Text file - simple conversion
        extractedText = new TextDecoder().decode(uint8Array);
      } else if (file.type === 'application/pdf') {
        // PDF - extract text using pdfjs-dist (better serverless support)
        console.log('[Custom Quiz] Processing PDF file...', file.name, file.size);

        try {
          // Use pdfjs-dist which works in serverless environments
          const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

          const loadingTask = pdfjsLib.getDocument({
            data: uint8Array,
            useSystemFonts: true,
            standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/standard_fonts/',
          });

          const pdfDocument = await loadingTask.promise;
          const numPages = pdfDocument.numPages;
          console.log('[Custom Quiz] PDF has', numPages, 'pages');

          const textParts: string[] = [];

          // Extract text from each page
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            textParts.push(pageText);
          }

          extractedText = textParts.join('\n\n');
          console.log('[Custom Quiz] PDF text extracted:', extractedText.length, 'characters');

          // Check if PDF is scanned/image-based
          if (!extractedText || extractedText.trim().length < 50) {
            throw new Error('PDF appears to be scanned or has no extractable text');
          }
        } catch (pdfError: any) {
          console.error('[Custom Quiz] PDF parsing error:', pdfError?.message || pdfError);
          return NextResponse.json(
            {
              error: "Could not extract text from PDF. This might be a scanned/image-based PDF. Please try a text-based PDF or paste the content directly.",
              details: pdfError?.message
            },
            { status: 400 }
          );
        }
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
    } catch (extractError: any) {
      console.error('[Custom Quiz] Text extraction error:', extractError?.message || extractError);
      return NextResponse.json(
        {
          error: "Could not extract text from file. Please ensure the file is not corrupted.",
          details: extractError?.message
        },
        { status: 400 }
      );
    }
    }
    // Neither file nor text provided
    else {
      return NextResponse.json(
        { error: "Please either upload a file or paste text to generate questions." },
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

IMPORTANT: The material may contain LaTeX equations (\\omega, \\vec{}, etc.) and mathematical symbols. Read them as math notation.

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
4. Write questions in plain text (avoid complex LaTeX in questions)
5. Include detailed explanation for correct answer
6. Add trap alerts explaining why wrong answers are tempting

OUTPUT FORMAT - Return ONLY valid JSON array, no markdown or code blocks:
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

    console.log('[Custom Quiz] Generating questions for:', file?.name || 'pasted text', 'Questions:', numQuestions);

    let questions: QuizQuestion[];

    try {
      console.log('[Custom Quiz] Calling AI with prompt length:', prompt.length);

      const { text } = await generateText({
        model: openrouter("openai/gpt-4o-mini"), // More reliable than free Gemini
        prompt,
        maxOutputTokens: 4000,
        temperature: 0.7,
      });

      console.log('[Custom Quiz] AI response received, length:', text.length);
      console.log('[Custom Quiz] First 200 chars:', text.substring(0, 200));

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('[Custom Quiz] No JSON found in response:', text.substring(0, 500));
        throw new Error('No JSON array found in response');
      }

      questions = JSON.parse(jsonMatch[0]);
      console.log('[Custom Quiz] Parsed questions count:', questions.length);

      // Validate questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      // Ensure we have the requested number
      questions = questions.slice(0, numQuestions);

    } catch (aiError) {
      console.error('[Custom Quiz] AI generation error:', aiError);
      console.error('[Custom Quiz] Error stack:', aiError instanceof Error ? aiError.stack : 'No stack');
      return NextResponse.json(
        {
          error: "Failed to generate questions from your material. The content might be too complex or contain formatting that the AI cannot process. Try simplifying the text or removing special characters/equations.",
          details: aiError instanceof Error ? aiError.message : 'AI generation failed'
        },
        { status: 500 }
      );
    }

    // Return generated quiz
    return NextResponse.json({
      success: true,
      quiz: {
        fileName: file?.name || 'pasted-text',
        fileSize: file?.size || extractedText.length,
        fileType: file?.type || 'text/plain',
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
