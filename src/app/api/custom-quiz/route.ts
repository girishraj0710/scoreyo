import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { classifyContent, calculateQualityScore, checkDuplicate } from "@/lib/classify-content";
import { queryAll, execute } from "@/lib/db";
import { extractTextFromUpload, ExtractionError } from "@/lib/content-extraction";

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
    const userId = request.cookies.get("scoreyo-user-id")?.value;
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
      try {
        const extracted = await extractTextFromUpload(file);
        extractedText = extracted.text;
        console.log('[Custom Quiz] Extracted', extracted.wordCount, 'words from', extracted.kind);
      } catch (extractError) {
        const message =
          extractError instanceof ExtractionError
            ? extractError.message
            : "Could not extract text from file. Please ensure the file is not corrupted.";
        return NextResponse.json({ error: message }, { status: 400 });
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

    // Cap the text sent to the model so token cost/latency stay bounded.
    const words = extractedText.split(/\s+/).length;
    const MAX_PROMPT_CHARS = 30000;
    if (extractedText.length > MAX_PROMPT_CHARS) {
      extractedText = extractedText.slice(0, MAX_PROMPT_CHARS);
    }

    // Generate questions using AI
    const prompt = `You are an expert educator creating practice questions from study material.

IMPORTANT: The material may contain LaTeX equations (\\omega, \\vec{}, etc.) and mathematical symbols. Read them as math notation.

STUDY MATERIAL:
${extractedText}

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

    // Classify content using AI
    console.log('[Custom Quiz] Classifying content...');
    const classification = await classifyContent(extractedText);
    console.log('[Custom Quiz] Classification result:', classification);

    // Store questions in pending_questions table for admin review
    const pendingQuestionIds: string[] = [];

    try {
      console.log('[Custom Quiz] Attempting to store', questions.length, 'questions...');

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionId = `pending-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        try {
          // Calculate quality score
          const qualityScore = calculateQualityScore(question);

          // Check for duplicates
          const isDuplicate = await checkDuplicate(question.question, queryAll);

          console.log(`[Custom Quiz] Storing question ${i + 1}/${questions.length}, ID: ${questionId}`);

          // Store in pending_questions
          await execute(
            `INSERT INTO pending_questions (
              id, user_id, source_type, source_file, content_preview,
              detected_exam_id, detected_subject_id, detected_topics,
              classification_confidence,
              question, options, correct_answer, explanation, trap_alerts, difficulty,
              quality_score, duplicate_check_passed, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              questionId,
              userId,
              file ? 'custom-upload' : 'custom-paste',
              file?.name || null,
              extractedText.slice(0, 500),
              classification.examId,
              classification.subjectId,
              JSON.stringify(classification.topics),
              classification.confidence,
              question.question,
              JSON.stringify(question.options),
              question.correctAnswer,
              question.explanation,
              JSON.stringify(question.trapAlerts),
              question.difficulty,
              qualityScore,
              isDuplicate ? false : true,
              'pending'
            ]
          );

          pendingQuestionIds.push(questionId);
          console.log(`[Custom Quiz] ✓ Stored question ${i + 1}`);
        } catch (questionError: any) {
          console.error(`[Custom Quiz] Failed to store question ${i + 1}:`, {
            error: questionError.message,
            code: questionError.code,
            detail: questionError.detail,
            questionId,
          });
          // Continue with next question even if one fails
        }
      }

      console.log('[Custom Quiz] Successfully stored', pendingQuestionIds.length, 'of', questions.length, 'questions');
    } catch (storageError: any) {
      console.error('[Custom Quiz] Storage error:', {
        message: storageError.message,
        code: storageError.code,
        detail: storageError.detail,
        stack: storageError.stack,
      });
      // Continue even if storage fails - user still gets their quiz
    }

    // Return generated quiz with classification info
    return NextResponse.json({
      success: true,
      quiz: {
        fileName: file?.name || 'pasted-text',
        fileSize: file?.size || extractedText.length,
        fileType: file?.type || 'text/plain',
        wordCount: words,
        questions,
        numQuestions: questions.length,
        difficulty,
        classification: {
          exam: classification.examName,
          subject: classification.subjectName,
          topics: classification.topics,
          confidence: classification.confidence,
        },
        pendingQuestionIds,
        message: `Questions generated successfully! ${
          classification.confidence > 0.7
            ? `If approved, they'll be added to ${classification.examName} - ${classification.subjectName}.`
            : 'Content classification had low confidence - admin review recommended.'
        }`
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
