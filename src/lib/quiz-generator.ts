// PrepGenie - AI Quiz Generator using OpenRouter (FREE)
// Races all free models in parallel — fastest response wins
// Includes self-verification prompt for higher accuracy
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  source: "ai" | "verified"; // tracks where the question came from
}

// Free models — all fire at once, fastest valid response wins
const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
  "minimax/minimax-m2.5:free",
  "inclusionai/ling-2.6-1t:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

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

  return questions.map((q) => ({
    question: q.question,
    options: q.options.slice(0, 4),
    correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
    explanation: q.explanation,
    difficulty: q.difficulty || "medium",
    source: "ai" as const,
  }));
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

  // Enhanced prompt with self-verification instructions
  const prompt = `You are an expert exam question creator for Indian competitive exams with decades of teaching experience. Generate exactly ${numberOfQuestions} multiple choice questions for:

Exam: ${examName}
Subject: ${subjectName}
Topic: ${topic}
Difficulty: ${difficultyInstruction}

IMPORTANT RULES:
1. Questions MUST be at the standard expected in the actual ${examName} exam
2. Each question must have EXACTLY 4 options (A, B, C, D)
3. Only ONE option should be correct
4. Provide a clear, concise explanation for the correct answer
5. Questions should test conceptual understanding, not just rote memorization
6. Include numerical problems where relevant
7. Make the incorrect options plausible (common mistakes students make)

CRITICAL - SELF-VERIFICATION STEPS (you MUST follow these):
8. For EVERY question, after writing it, SOLVE it yourself step-by-step to verify the answer is correct
9. For numerical questions, SHOW your calculation in the explanation to prove the answer
10. Double-check that the correctAnswer index (0-3) actually points to the right option in the options array
11. Make sure no two options are the same
12. Ensure the explanation clearly proves why the chosen answer is correct and others are wrong
13. If a question involves a formula, state the formula in the explanation
14. Do NOT include any question where you are less than 95% confident about the answer

Respond ONLY with a valid JSON array. No markdown, no code blocks, no extra text. The response must start with [ and end with ].

Each object in the array must have these exact fields:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Step-by-step explanation proving why this answer is correct. Include formula/calculation if applicable.",
  "difficulty": "easy|medium|hard"
}

Where correctAnswer is the 0-based index of the correct option (0 for A, 1 for B, 2 for C, 3 for D).`;

  try {
    // Race all models in parallel — first valid response wins
    const result = await Promise.any(
      FREE_MODELS.map(async (modelId) => {
        const { text } = await generateText({
          model: openrouter(modelId),
          prompt,
          maxOutputTokens: 4096,
          temperature: 0.5, // Lower temperature for more accurate/deterministic answers
        });
        const questions = parseQuizResponse(text);
        return questions;
      })
    );
    return result;
  } catch (error) {
    // All models failed
    console.error("[PrepGenie] All models failed:", error);
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
