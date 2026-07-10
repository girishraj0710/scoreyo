import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createFlashcardDeck, addFlashcardsToDeck } from '@/lib/db';

/**
 * POST /api/flashcards/generate
 * AI-generate a flashcard deck on any topic
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🎯 [FLASHCARD GENERATE] Request received');

    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;
    console.log('👤 User ID:', userId);

    if (!userId) {
      console.error('❌ No user ID found in cookies');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { exam, subject, topic, cardCount = 15 } = body;
    console.log('📦 Request body:', { exam, subject, topic, cardCount });

    if (!topic) {
      console.error('❌ No topic provided');
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('🤖 Starting AI generation...');
    // Generate flashcards using AI
    const cards = await generateFlashcardsWithAI(exam, subject, topic, cardCount);
    console.log(`✅ AI generation complete. Cards: ${cards?.length || 0}`);

    if (!cards || cards.length === 0) {
      console.error('❌ No cards generated');
      return NextResponse.json(
        { error: 'Failed to generate flashcards' },
        { status: 500 }
      );
    }

    // Create deck
    const deckTitle = `${topic}${subject ? ` (${subject})` : ''}`;
    const deckDescription = `AI-generated flashcards for ${topic}${exam ? ` - ${exam}` : ''}`;

    console.log('💾 Creating deck:', deckTitle);
    const deck = await createFlashcardDeck(
      parseInt(userId),
      deckTitle,
      deckDescription,
      exam || '',
      subject || '',
      topic,
      true // isAiGenerated
    );
    console.log('✅ Deck created, ID:', deck.id);

    // Add cards to deck
    console.log('📝 Adding cards to deck...');
    await addFlashcardsToDeck(deck.id, cards);
    console.log('✅ Cards added successfully');

    return NextResponse.json({
      success: true,
      deck: {
        ...deck,
        card_count: cards.length,
      },
      cards,
      message: `Generated ${cards.length} flashcards for ${topic}`,
    });
  } catch (error) {
    console.error('❌ Error generating flashcards:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 Error details:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('📍 Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Failed to generate flashcards',
        details: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * AI Generation Logic using OpenRouter (Gemini)
 */
async function generateFlashcardsWithAI(
  exam: string,
  subject: string,
  topic: string,
  count: number
): Promise<Array<{
  front: string;
  back: string;
  hint?: string;
  difficulty?: string;
}>> {
  console.log('🔧 [AI] Starting generation with params:', { exam, subject, topic, count });

  const examContext = exam ? `for ${exam} exam` : '';
  const subjectContext = subject ? `in ${subject}` : '';

  const prompt = `You are an expert educator creating flashcards for competitive exam preparation in India.

Context:
- Exam: ${exam || 'General competitive exams'}
- Subject: ${subject || 'General'}
- Topic: ${topic}

Generate ${count} high-quality flashcards following these guidelines:

1. **Front (Question/Term)**: Clear, concise question or term (max 150 characters)
   - Focus on exam-relevant concepts
   - Include common MCQ patterns
   - Cover key definitions, formulas, dates, facts

2. **Back (Answer/Explanation)**: Comprehensive answer (150-400 characters)
   - Provide clear explanation
   - Include context or examples where helpful
   - Mention common misconceptions if relevant

3. **Hint (Optional)**: Memory trigger or mnemonic (max 50 characters)
   - Only for medium/hard cards
   - Help student recall the concept

4. **Difficulty**: Label as 'easy', 'medium', or 'hard'
   - Easy: Direct recall facts
   - Medium: Application or understanding
   - Hard: Complex concepts or tricky distinctions

Focus areas:
- Exam-relevant concepts tested frequently
- Common student mistakes and misconceptions
- Key formulas, definitions, dates, facts
- Application-based questions
- Conceptual clarity

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "front": "What is Newton's Second Law of Motion?",
    "back": "F = ma. Force equals mass times acceleration. The net force on an object is directly proportional to its mass and acceleration. Commonly tested in JEE/NEET mechanics problems.",
    "hint": "F = ma formula",
    "difficulty": "easy"
  },
  {
    "front": "Why does a cricket ball swing in the air?",
    "back": "Due to Bernoulli's principle - pressure difference on two sides of the ball caused by different air speeds. Rough side creates turbulence (low speed, high pressure), smooth side has laminar flow (high speed, low pressure).",
    "hint": "Bernoulli's principle",
    "difficulty": "medium"
  }
]

Generate ${count} flashcards now for: ${topic} ${subjectContext} ${examContext}`;

  try {
    console.log('🌐 [AI] Making OpenRouter API call...');
    console.log('🔑 [AI] API Key present:', !!process.env.OPENROUTER_API_KEY);
    console.log('📝 [AI] Prompt length:', prompt.length);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://krakkify.in',
        'X-Title': 'Krakkify Flashcards',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite', // Cheapest Gemini model: $0.0001/M prompt, $0.0004/M completion
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      })
    });

    console.log('📡 [AI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [AI] OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`AI generation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 [AI] OpenRouter response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content
    });

    const content = data.choices[0]?.message?.content || '';
    console.log('AI content received:', content.substring(0, 500));

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response. Full content:', content);
      throw new Error('Invalid AI response format - no JSON array found');
    }

    const cards = JSON.parse(jsonMatch[0]);
    console.log(`Parsed ${cards.length} cards from AI response`);

    // Validate cards
    const validCards = cards.filter((card: any) =>
      card.front && card.back && card.front.length > 0 && card.back.length > 0
    );

    console.log(`Validated ${validCards.length} cards`);

    if (validCards.length === 0) {
      throw new Error('No valid cards generated');
    }

    return validCards;
  } catch (error) {
    console.error('AI generation error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}
