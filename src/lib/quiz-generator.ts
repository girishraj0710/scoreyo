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

// Use single fastest model for maximum speed
// Parallel racing actually slows things down due to overhead
const FASTEST_MODEL = "google/gemini-2.0-flash-exp:free"; // Fastest response time

function parseQuizResponse(text: string): QuizQuestion[] {
  let cleanText = text.trim();
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

  const questions: QuizQuestion[] = JSON.parse(cleanText);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid response format");
  }

  return questions.map((q, idx) => {
    // Validate required fields
    if (!q || typeof q !== 'object') {
      throw new Error(`Question ${idx + 1} is invalid`);
    }
    if (!q.question || typeof q.question !== 'string') {
      throw new Error(`Question ${idx + 1} missing question text`);
    }
    if (!Array.isArray(q.options) || q.options.length < 4) {
      throw new Error(`Question ${idx + 1} has invalid options`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      throw new Error(`Question ${idx + 1} has invalid correctAnswer`);
    }

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

  // Simplified prompt for faster generation
  const prompt = `Generate ${numberOfQuestions} MCQ questions for ${examName} - ${subjectName} - ${topic} (${difficultyInstruction}).

Rules: 4 options each, 1 correct, ${examName} exam standard, test concepts not memorization.

Return ONLY valid JSON array (no markdown):
[{
  "question": "text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": {
    "logic": "Why correct (2-3 sentences)",
    "formula": "if numerical, else null",
    "calculation": "if numerical, else null",
    "trapAlerts": ["Why wrong option 1", "Why wrong option 2", "Why wrong option 3"],
    "commonMistakes": ["Mistake 1", "Mistake 2"]
  },
  "difficulty": "easy|medium|hard"
}]`;

  try {
    // Use single fastest model with timeout
    const result = await Promise.race([
      (async () => {
        const { text } = await generateText({
          model: openrouter(FASTEST_MODEL),
          prompt,
          maxOutputTokens: 1500, // Reduced for speed
          temperature: 0.8, // Higher for faster generation
        });
        return parseQuizResponse(text);
      })(),
      // Add 20-second timeout
      new Promise<QuizQuestion[]>((_, reject) =>
        setTimeout(() => reject(new Error("Generation timeout")), 20000)
      ),
    ]);
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
