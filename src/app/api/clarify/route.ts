import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { execute } from "@/lib/db";

// Use OpenRouter with gpt-4o-mini (same as quiz generator)
// Cost: $0.15/$0.60 per 1M tokens - ultra cheap and reliable
const AI_MODEL = "openai/gpt-4o-mini";
const TIMEOUT_MS = 30000; // 30 seconds

export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionText, userQuestion, correctAnswer, wrongAnswer, conversationHistory } = await request.json();

    if (!questionText || !userQuestion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log('[Clarify] Processing request...');
    console.log('[Clarify] Question:', questionText.substring(0, 100));
    console.log('[Clarify] User asks:', userQuestion);

    // Build prompt (same pattern as quiz generator - simple and reliable)
    const systemInstruction = `You are a patient, encouraging AI tutor helping Indian students understand competitive exam questions they got wrong.

Your response style:
- Clear and concise (2-4 sentences max)
- Focus on the KEY concept, not everything
- Be supportive and encouraging
- Use simple language
- If mathematical, show ONE key step that makes it click

Format your response naturally - no markdown, no bold, just plain helpful text.`;

    // Build the full prompt
    let fullPrompt = `${systemInstruction}

CONTEXT:
Question: ${questionText}
Student's Answer: ${wrongAnswer} (incorrect)
Correct Answer: ${correctAnswer}

`;

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += "CONVERSATION HISTORY:\n";
      conversationHistory.forEach((msg: any) => {
        if (msg.type === 'user') {
          fullPrompt += `Student: ${msg.text}\n`;
        } else if (msg.type === 'ai') {
          fullPrompt += `Tutor: ${msg.text}\n`;
        }
      });
      fullPrompt += "\n";
    }

    // Add current question
    fullPrompt += `STUDENT'S NEW QUESTION: ${userQuestion}

YOUR RESPONSE (2-4 sentences, clear and encouraging):`;

    console.log('[Clarify] Sending to OpenRouter...');
    console.log('[Clarify] Prompt length:', fullPrompt.length, 'chars');

    try {
      // Use Vercel AI SDK with OpenRouter (same pattern as quiz generator)
      const { text } = await generateText({
        model: openrouter(AI_MODEL),
        prompt: fullPrompt,
        maxOutputTokens: 500,
        temperature: 0.7,
      });

      let result = text.trim();

      // Remove any markdown formatting if AI adds it (despite instructions)
      result = result.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');

      console.log('[Clarify] AI response received:', result.substring(0, 100) + '...');

      // Validate response quality
      if (!result || result.length < 20) {
        console.warn('[Clarify] AI response too short, using fallback');
        throw new Error('AI response too short');
      }

      // Store for analytics (non-blocking)
      execute(
        `INSERT INTO clarifications (user_id, question_text, user_question, ai_response)
         VALUES (?, ?, ?, ?)`,
        [userId, questionText, userQuestion.trim(), result]
      ).catch(err => console.error('[Clarify] DB error:', err));

      return NextResponse.json({
        response: result,
        source: 'openrouter',
        model: AI_MODEL
      });

    } catch (apiError: any) {
      console.error("[Clarify] AI API Error:", apiError?.message || apiError);
      console.error("[Clarify] Error details:", {
        name: apiError?.name,
        message: apiError?.message,
        cause: apiError?.cause
      });

      // Intelligent fallback based on the actual question
      const fallback = generateIntelligentFallback(questionText, userQuestion, correctAnswer, wrongAnswer);

      return NextResponse.json({
        response: fallback,
        source: 'fallback',
        model: 'fallback-rules'
      });
    }

  } catch (error: any) {
    console.error("[Clarify API] Error:", error?.message || error);
    return NextResponse.json({
      error: "Internal server error",
      details: error?.message
    }, { status: 500 });
  }
}

function generateIntelligentFallback(
  questionText: string,
  userQuestion: string,
  correctAnswer: string,
  wrongAnswer: string
): string {
  const lowerUserQ = userQuestion.toLowerCase();

  // Check if user is asking for explanation
  if (lowerUserQ.includes('explain') || lowerUserQ.includes('why') || lowerUserQ.includes('how')) {
    return `The correct answer is ${correctAnswer}. To understand why, let's break it down: look at what the question is asking, identify the key information given, and apply the relevant concept or formula. Your answer of ${wrongAnswer} likely came from a different interpretation. Would you like me to walk through the specific steps?`;
  }

  // Check if user wants an example
  if (lowerUserQ.includes('example')) {
    return `Sure! For a problem like this, the correct answer is ${correctAnswer}. Let me give you a similar example: think about the same concept but with simpler numbers. For instance, if the question involved percentages, try working with 10% or 50% first to understand the pattern. Would you like a specific type of example?`;
  }

  // Check for calculation help
  if (lowerUserQ.includes('calculat') || lowerUserQ.includes('step')) {
    return `The correct answer is ${correctAnswer}. Let me help with the calculation: First, identify what you know. Second, determine what you need to find. Third, choose the right formula or method. Fourth, substitute values and solve. You got ${wrongAnswer}, which suggests a different approach. Want me to show the detailed steps?`;
  }

  // Generic helpful response
  return `Good question! The correct answer is ${correctAnswer}. The key is understanding the relationship in the problem. You selected ${wrongAnswer}, which is close - the difference is in how we interpret the given information. Break it down step by step: what's given, what's asked, and how they connect. What specific part would help to clarify?`;
}

// Mark clarification as helpful/not helpful
export async function PATCH(request: Request) {
  try {
    const userId = (await cookies()).get("scoreyo-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionText, helpful } = await request.json();

    await execute(
      `UPDATE clarifications
       SET helpful = ?
       WHERE id = (
         SELECT id FROM clarifications
         WHERE user_id = ? AND question_text = ?
         ORDER BY created_at DESC
         LIMIT 1
       )`,
      [helpful, userId, questionText]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Clarify API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
