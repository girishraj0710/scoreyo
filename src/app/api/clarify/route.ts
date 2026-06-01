import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { execute } from "@/lib/db";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
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

    // Build conversation messages for Claude
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // System context as first user message
    const contextMessage = `I'm a student who got a quiz question wrong. Here's the context:

QUESTION: ${questionText}

MY ANSWER: ${wrongAnswer} (incorrect)
CORRECT ANSWER: ${correctAnswer}

Please help me understand this.`;

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      // Add context as first message
      messages.push({
        role: 'user',
        content: contextMessage
      });

      // Add dummy assistant acknowledgment
      messages.push({
        role: 'assistant',
        content: 'I understand. I can see the question and your answer. What would you like to know?'
      });

      // Add conversation history
      conversationHistory.forEach((msg: any) => {
        if (msg.type === 'user') {
          messages.push({ role: 'user', content: msg.text });
        } else if (msg.type === 'ai') {
          messages.push({ role: 'assistant', content: msg.text });
        }
      });
    } else {
      // First question - just add context and current question
      messages.push({
        role: 'user',
        content: `${contextMessage}

${userQuestion}`
      });
    }

    console.log('[Clarify] Sending to Claude API with', messages.length, 'messages');

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022", // Fast and cheap ($1 per 1M tokens)
        max_tokens: 500,
        system: "You are a patient, encouraging tutor helping students understand quiz questions they got wrong. Provide clear, concise explanations in 2-4 sentences. Focus on the key concept and be supportive.",
        messages: messages,
      });

      const result = response.content[0].type === 'text'
        ? response.content[0].text
        : "I can help explain this concept. Could you be more specific about what you'd like to understand?";

      console.log('[Clarify] Claude response received:', result.substring(0, 100) + '...');

      // Store for analytics (non-blocking)
      execute(
        `INSERT INTO clarifications (user_id, question_text, user_question, ai_response)
         VALUES (?, ?, ?, ?)`,
        [userId, questionText, userQuestion.trim(), result]
      ).catch(err => console.error('[Clarify] DB error:', err));

      return NextResponse.json({
        response: result,
        source: 'claude'
      });

    } catch (apiError: any) {
      console.error("[Clarify] Claude API Error:", apiError?.message || apiError);
      console.error("[Clarify] Error details:", JSON.stringify(apiError, null, 2));

      // Check if API key is missing
      if (apiError?.status === 401 || apiError?.message?.includes('api_key')) {
        return NextResponse.json({
          response: "AI service configuration issue. Please contact support.",
          source: 'error'
        });
      }

      // Intelligent fallback based on the actual question
      const fallback = generateIntelligentFallback(questionText, userQuestion, correctAnswer, wrongAnswer);

      return NextResponse.json({
        response: fallback,
        source: 'fallback'
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
    const userId = (await cookies()).get("prepgenie-user-id")?.value;
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
