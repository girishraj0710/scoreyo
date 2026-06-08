import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

// Type definitions for evaluation responses
interface Criterion {
  score: number;
  feedback: string;
  improvements: string[];
}

interface InlineSuggestion {
  original: string;
  suggestion: string;
  reason: string;
}

interface WritingEvaluation {
  bandScore: number;
  taskAchievement: Criterion;
  coherenceCohesion: Criterion;
  lexicalResource: Criterion;
  grammaticalRange: Criterion;
  inlineSuggestions: InlineSuggestion[];
  overallFeedback: string;
}

interface SpeakingEvaluation {
  bandScore: number;
  fluencyCoherence: Criterion;
  lexicalResource: Criterion;
  grammaticalRange: Criterion;
  pronunciation: Criterion;
  overallFeedback: string;
}

// Helper function to parse JSON from AI response
function parseJSONResponse(text: string): any {
  try {
    // Remove markdown code fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7); // Remove ```json
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3); // Remove ```
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3); // Remove trailing ```
    }

    // Find the JSON object within the text
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in response");
    }

    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw error;
  }
}

// Model configuration
const MODEL_ID = "openai/gpt-4o-mini";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = request.cookies.get("prepgenie-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, prompt, userText, sampleAnswer, wordCount, targetWordCount } = body;

    if (!type || !prompt || !userText) {
      return NextResponse.json(
        { error: "Missing required fields: type, prompt, userText" },
        { status: 400 }
      );
    }

    if (type !== "writing" && type !== "speaking") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'writing' or 'speaking'" },
        { status: 400 }
      );
    }

    let aiPrompt: string;

    if (type === "writing") {
      aiPrompt = `You are a strict IELTS examiner. Evaluate the following essay against official IELTS band descriptors (0-9 scale).

TASK PROMPT:
${prompt}

WORD COUNT: ${wordCount} words (required minimum: ${targetWordCount} words)

STUDENT ESSAY:
${userText}

${sampleAnswer ? `SAMPLE ANSWER (for reference only, DO NOT judge based on this):
${sampleAnswer}` : ""}

Provide your evaluation in the following JSON format. Each score should be 0-9. Be fair but rigorous.

{
  "bandScore": <overall IELTS band score 0-9>,
  "taskAchievement": {
    "score": <0-9>,
    "feedback": "<brief feedback on how well they addressed the prompt>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "coherenceCohesion": {
    "score": <0-9>,
    "feedback": "<feedback on paragraph structure and linking words>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "lexicalResource": {
    "score": <0-9>,
    "feedback": "<feedback on vocabulary range and appropriateness>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "grammaticalRange": {
    "score": <0-9>,
    "feedback": "<feedback on grammar and sentence variety>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "inlineSuggestions": [
    {
      "original": "<a phrase from the essay that could be improved>",
      "suggestion": "<better alternative>",
      "reason": "<brief explanation why>"
    }
  ],
  "overallFeedback": "<2-3 sentences of overall assessment and top priorities for improvement>"
}

Return ONLY the JSON object, no markdown, no explanation.`;
    } else {
      // Speaking
      aiPrompt = `You are a strict IELTS examiner. Evaluate the following transcribed spoken answer.

QUESTION:
${prompt}

TRANSCRIBED STUDENT ANSWER:
${userText}

Provide your evaluation in the following JSON format. Each score should be 0-9. Note: This evaluation is based on the transcribed text only. Pronunciation and fluency from the audio cannot be assessed, but you can assess grammar and vocabulary from the transcription.

{
  "bandScore": <overall IELTS band score 0-9>,
  "fluencyCoherence": {
    "score": <0-9>,
    "feedback": "<feedback on the flow and coherence of the answer from the transcription>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "lexicalResource": {
    "score": <0-9>,
    "feedback": "<feedback on vocabulary range and appropriateness>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "grammaticalRange": {
    "score": <0-9>,
    "feedback": "<feedback on grammar and sentence structures>",
    "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
  },
  "pronunciation": {
    "score": 0,
    "feedback": "Cannot assess pronunciation from transcribed text. This evaluation is based on vocabulary, grammar, and coherence only.",
    "improvements": []
  },
  "overallFeedback": "<2-3 sentences of overall assessment and suggestions for improvement>"
}

Return ONLY the JSON object, no markdown, no explanation.`;
    }

    // Call OpenRouter API
    const { text } = await generateText({
      model: openrouter(MODEL_ID),
      prompt: aiPrompt,
      maxOutputTokens: 2500,
      temperature: 0.7,
    });

    // Parse the response
    const evaluation = parseJSONResponse(text);

    return NextResponse.json({
      success: true,
      evaluation,
      type,
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to evaluate";
    return NextResponse.json(
      { error: `Evaluation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
