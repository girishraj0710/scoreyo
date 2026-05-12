import { NextRequest, NextResponse } from "next/server";
import { getEnglishQuestions } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pathId, topicId, level, count = 10 } = body;

    console.log(`[English Practice API] Request: pathId="${pathId}", topicId="${topicId}", level="${level}", count=${count}`);

    if (!pathId || !topicId || !level) {
      return NextResponse.json(
        { error: "Missing required fields: pathId, topicId, level" },
        { status: 400 }
      );
    }

    // Map frontend topics to database topics (same mapping as quiz API)
    const topicMapping: Record<string, string> = {
      // Writing topics → writing-skills (97Q)
      'letter-writing': 'writing-skills',
      'email-writing': 'writing-skills',
      'essay-writing': 'writing-skills',
      'essay-writing-basics': 'writing-skills',
      'paragraph-writing': 'writing-skills',
      'sentence-writing': 'writing-skills',

      // Pronunciation → phonics-vowels (26Q)
      'pronunciation-basics': 'phonics-vowels',
      'pronunciation-practice': 'phonics-vowels',

      // Pronouns → parts-of-speech (62Q - includes pronouns)
      'pronouns-detailed': 'parts-of-speech',

      // Adjectives → parts-of-speech (62Q - includes adjectives)
      'adjectives': 'parts-of-speech',

      // Tense comparison → present-simple (as starting point)
      'all-tenses-comparison': 'present-simple',

      // Sentence types → sentence-structure (12Q)
      'sentence-types': 'sentence-structure',

      // Subject-verb agreement → verbs-basics (5Q)
      'subject-verb-agreement': 'verbs-basics',

      // Active/Passive voice → sentence-structure (12Q)
      'active-passive-voice': 'sentence-structure',
      'active-passive': 'sentence-structure',  // alternate ID

      // Direct/Indirect speech → sentence-structure (12Q)
      'direct-indirect-speech': 'sentence-structure',
      'reported-speech': 'sentence-structure',  // alternate ID

      // Vocabulary → essential-vocabulary (5Q)
      'basic-vocabulary': 'essential-vocabulary',

      // Idioms → idioms (26Q) + idioms-expressions (9Q)
      'idioms-proverbs': 'idioms',

      // Reading → reading-comprehension (42Q)
      'reading-basics': 'reading-comprehension',
      'short-stories': 'reading-comprehension',
      'comprehension-passages': 'reading-comprehension',

      // Listening → reading-comprehension (closest available)
      'listening-comprehension': 'reading-comprehension',
      'listening-skills': 'reading-comprehension',

      // Conversations → daily-conversations (5Q in real-world path)
      'daily-conversations': 'daily-conversations',
      'conversation-skills': 'daily-conversations',

      // ===== IELTS & TOEFL TOPICS =====
      // IELTS Reading → reading-comprehension (42Q)
      'ielts-reading': 'reading-comprehension',

      // IELTS Writing → writing-skills (97Q - includes essays, letters, reports)
      'ielts-writing': 'writing-skills',

      // IELTS Listening → reading-comprehension (closest match, 42Q)
      'ielts-listening': 'reading-comprehension',

      // IELTS Speaking → redirect to dedicated speaking practice page (voice-based)
      // No longer mapped to idioms - handled separately

      // TOEFL Integrated Tasks → reading-comprehension (42Q)
      'toefl-integrated': 'reading-comprehension',

      // Academic Vocabulary → academic-vocabulary (5Q) + essential-vocabulary (5Q)
      'academic-vocabulary': 'academic-vocabulary',

      // ===== COMPETITIVE EXAM TOPICS =====
      // Sentence Improvement → common-mistakes (131Q) - perfect for error detection
      'sentence-improvement': 'common-mistakes',

      // Comprehension → reading-comprehension (42Q)
      'comprehension': 'reading-comprehension',

      // Cloze Test → reading-comprehension (42Q) - tests contextual understanding
      'cloze-test': 'reading-comprehension',

      // ===== REAL-WORLD TOPICS =====
      // Job Interviews → idioms (26Q) + phrasal-verbs (110Q) for professional communication
      'job-interviews': 'phrasal-verbs',

      // Presentations → idioms (26Q) for public speaking confidence
      'presentations': 'idioms',

      // Business English → writing-skills (97Q) + phrasal-verbs (110Q)
      'business-english': 'phrasal-verbs',
    };

    let mappedTopicId = topicId.toLowerCase().replace(/\s+/g, '-');
    console.log(`[English Practice] Original topicId="${topicId}", normalized="${mappedTopicId}"`);

    // Use mapping if available
    if (topicMapping[mappedTopicId]) {
      console.log(`[English Practice] ✓ Mapping topic "${mappedTopicId}" to "${topicMapping[mappedTopicId]}"`);
      mappedTopicId = topicMapping[mappedTopicId];
    } else {
      console.log(`[English Practice] ⚠️ No mapping found for "${mappedTopicId}", using as-is`);
    }

    // Try multiple paths: foundation, real-world, ielts-toefl, competitive-exam
    const pathsToTry = [pathId, 'foundation', 'real-world', 'ielts-toefl', 'competitive-exam'];
    let questions: any[] = [];

    // Try each path until we find questions
    for (const tryPath of pathsToTry) {
      if (questions.length > 0) break;

      console.log(`[English Practice] Trying path="${tryPath}", topic="${mappedTopicId}"...`);

      // Try with requested level
      questions = await getEnglishQuestions(tryPath, mappedTopicId, level, count * 2);
      if (questions.length > 0) {
        console.log(`[English Practice] ✓ Found ${questions.length} questions at level="${level}"`);
      }

      // If no questions found, try other levels
      if (questions.length === 0 && level !== 'intermediate') {
        console.log(`[English Practice] Trying level="intermediate"...`);
        questions = await getEnglishQuestions(tryPath, mappedTopicId, 'intermediate', count * 2);
        if (questions.length > 0) {
          console.log(`[English Practice] ✓ Found ${questions.length} questions at level="intermediate"`);
        }
      }

      if (questions.length === 0 && level !== 'beginner') {
        console.log(`[English Practice] Trying level="beginner"...`);
        questions = await getEnglishQuestions(tryPath, mappedTopicId, 'beginner', count * 2);
        if (questions.length > 0) {
          console.log(`[English Practice] ✓ Found ${questions.length} questions at level="beginner"`);
        }
      }

      if (questions.length === 0 && level !== 'advanced') {
        console.log(`[English Practice] Trying level="advanced"...`);
        questions = await getEnglishQuestions(tryPath, mappedTopicId, 'advanced', count * 2);
        if (questions.length > 0) {
          console.log(`[English Practice] ✓ Found ${questions.length} questions at level="advanced"`);
        }
      }

      if (questions.length > 0) {
        console.log(`[English Practice] Final: Found ${questions.length} questions in path="${tryPath}", topic="${mappedTopicId}"`);
        break;
      } else {
        console.log(`[English Practice] ✗ No questions in path="${tryPath}"`);
      }
    }

    if (questions.length === 0) {
      console.log(`[English Practice] No questions found for topic="${topicId}" (mapped to "${mappedTopicId}")`);
      // No questions in DB yet - return empty for now
      return NextResponse.json({
        questions: [],
        message: "No questions available yet. We're working on adding more content!",
      });
    }

    // Limit to requested count
    const selectedQuestions = questions.slice(0, count);

    console.log(`[English Practice] Returning ${selectedQuestions.length} questions (requested: ${count})`);

    // Add warning if we couldn't fulfill the full request
    const response: any = {
      questions: selectedQuestions,
      count: selectedQuestions.length,
      requested: count,
    };

    if (selectedQuestions.length < count) {
      response.warning = `Only ${selectedQuestions.length} questions available for this topic at this level. We're working on adding more content!`;
      console.log(`[English Practice] ⚠️ Warning: Could only return ${selectedQuestions.length}/${count} questions`);
    }

    // Return questions
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching English practice questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
