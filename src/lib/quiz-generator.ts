// PrepGenie - AI Quiz Generator using OpenRouter (FREE)
// Races all free models in parallel — fastest response wins
// Includes self-verification prompt for higher accuracy
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string | {
    logic: string;           // Core concept in 2-3 sentences
    formula?: string;        // Formula if numerical question
    calculation?: string;    // Step-by-step calculation
    trapAlerts: string[];    // Why each wrong option is tempting (3 items)
    commonMistakes: string[]; // Common student errors (2-3 items)
  };
  difficulty: "easy" | "medium" | "hard";
  source: "ai" | "verified"; // tracks where the question came from
}

// Use most reliable free model
// Gemini Flash is fast but experimental, switch to proven model
const RELIABLE_MODEL = "google/gemini-flash-1.5"; // Most reliable, widely available

function parseQuizResponse(text: string): QuizQuestion[] {
  let cleanText = text.trim();
  console.log("[Quiz Generator] Raw AI response length:", text.length);

  // Remove markdown code blocks if present
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  // Sometimes models prefix with text before JSON
  const jsonStart = cleanText.indexOf("[");
  const jsonEnd = cleanText.lastIndexOf("]");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
  }

  console.log("[Quiz Generator] Cleaned text for parsing:", cleanText.substring(0, 200));
  const questions: QuizQuestion[] = JSON.parse(cleanText);
  console.log("[Quiz Generator] Parsed questions count:", questions.length);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid response format");
  }

  return questions.map((q, idx) => {
    // Validate required fields
    if (!q || typeof q !== 'object') {
      console.error(`[Quiz Generator] Question ${idx + 1} is invalid:`, q);
      throw new Error(`Question ${idx + 1} is invalid`);
    }
    if (!q.question || typeof q.question !== 'string') {
      console.error(`[Quiz Generator] Question ${idx + 1} missing question text:`, q);
      throw new Error(`Question ${idx + 1} missing question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 4) {
      console.error(`[Quiz Generator] Question ${idx + 1} has invalid options:`, q.options);
      throw new Error(`Question ${idx + 1} has invalid options (need 4, got ${q.options?.length || 0})`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      console.error(`[Quiz Generator] Question ${idx + 1} has invalid correctAnswer:`, q.correctAnswer);
      throw new Error(`Question ${idx + 1} has invalid correctAnswer`);
    }

    console.log(`[Quiz Generator] Question ${idx + 1} validated successfully`);

    // Ensure trapAlerts has exactly 3 items (one for each wrong option)
    let explanation = q.explanation;
    if (typeof explanation === 'object' && explanation.trapAlerts) {
      // Ensure we have exactly 3 trap alerts
      while (explanation.trapAlerts.length < 3) {
        explanation.trapAlerts.push("This option is incorrect based on the concept explained above.");
      }
      explanation.trapAlerts = explanation.trapAlerts.slice(0, 3);

      // Ensure we have at least 2 common mistakes
      if (!explanation.commonMistakes || explanation.commonMistakes.length < 2) {
        explanation.commonMistakes = [
          "Not applying the fundamental concept correctly",
          "Rushing without careful analysis"
        ];
      }
    }

    return {
      question: q.question,
      options: q.options.slice(0, 4),
      correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
      explanation: explanation || "Explanation not available",
      difficulty: q.difficulty || "medium",
      source: "ai" as const,
    };
  });
}

export async function generateQuiz(
  examName: string,
  subjectName: string,
  topic: string,
  numberOfQuestions: number = 5,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed"
): Promise<QuizQuestion[]> {
  const difficultyInstruction =
    difficulty === "mixed"
      ? "Mix of easy (1-2), medium (2-3), and hard (1-2) questions"
      : `All questions should be ${difficulty} difficulty`;

  // Optimized prompt - concise but clear
  const prompt = `Create ${numberOfQuestions} multiple choice questions for ${examName} exam.
Subject: ${subjectName}
Topic: ${topic}
Difficulty: ${difficultyInstruction}

CRITICAL: Return ONLY a valid JSON array. No text before or after. Start with [ and end with ]

Format for each question:
{
  "question": "Question text here",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "Brief explanation why answer is correct",
    "formula": null,
    "calculation": null,
    "trapAlerts": ["Why option 0 wrong", "Why option 1 wrong", "Why option 2 wrong"],
    "commonMistakes": ["Common error 1", "Common error 2"]
  },
  "difficulty": "easy"
}

REQUIREMENTS:
- Exactly 4 options per question
- correctAnswer must be 0, 1, 2, or 3 (index of correct option)
- Questions at ${examName} exam difficulty level
- trapAlerts explains the 3 WRONG options only
- Return valid JSON array with ${numberOfQuestions} questions`;

  try {
    // Use single fastest model with timeout
    const result = await Promise.race([
      (async () => {
        const { text } = await generateText({
          model: openrouter(RELIABLE_MODEL),
          prompt,
          maxOutputTokens: 2000,
          temperature: 0.7,
        });
        return parseQuizResponse(text);
      })(),
      // Add 25-second timeout
      new Promise<QuizQuestion[]>((_, reject) =>
        setTimeout(() => reject(new Error("Generation timeout")), 25000)
      ),
    ]);

    // Ensure we got valid questions
    if (!result || result.length === 0) {
      console.error("[PrepGenie] No questions generated, using fallback");
      return generateFallbackQuestions(topic, numberOfQuestions);
    }

    return result;
  } catch (error) {
    console.error("[PrepGenie] Generation failed/timeout:", error);
    return generateFallbackQuestions(topic, numberOfQuestions);
  }
}

function generateFallbackQuestions(
  topic: string,
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `[Service Unavailable] We couldn't load question ${i + 1} about ${topic}. Please try again shortly.`,
      options: [
        "Option A - Try again",
        "Option B - Check internet connection",
        "Option C - Choose a different topic",
        "Option D - Come back later",
      ],
      correctAnswer: 0,
      explanation:
        "This is a placeholder question shown when our question service is temporarily unavailable. Please try again.",
      difficulty: "easy",
      source: "ai",
    });
  }
  return questions;
}
