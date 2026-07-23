import { NextRequest, NextResponse } from "next/server";
import {
  extractTextFromUpload,
  ExtractionError,
} from "@/lib/content-extraction";
import {
  generateStudyMode,
  GenerationError,
  type StudyMode,
} from "@/lib/study-mode-generator";
import {
  getFlashcardDeck,
  createFlashcardDeck,
  addFlashcardsToDeck,
  createGeneratedQuiz,
  createGeneratedGame,
  createGeneratedMockTest,
} from "@/lib/db";
import { resolveGuide, resolveMaterial } from "@/lib/convert-resolvers";

/**
 * POST /api/convert
 *
 * The on-demand "turn this into…" engine. Takes a SOURCE and a target MODE,
 * reads the source into text, generates mode-specific study material via the
 * shared LLM service, and persists it as an owned, shareable artifact.
 *
 * Body (multipart/form-data OR JSON):
 *   sourceType : 'deck' | 'text' | 'upload' | 'guide' | 'material'
 *   sourceRef  : deck id (when sourceType='deck')
 *   text       : raw text (when sourceType='text')
 *   file       : uploaded file (when sourceType='upload')
 *   examCode/subjectCode/topicName : exam study guide (sourceType='guide')
 *   pathId/topicId                 : english lesson guide (sourceType='guide')
 *   materialId : approved study-material id (sourceType='material')
 *   mode       : 'deck' | 'quiz' | 'game' | 'mock'
 *   count?     : desired item count (default 10)
 *   difficulty?: 'easy' | 'medium' | 'hard'
 *   title?     : override title
 */

const VALID_MODES: StudyMode[] = ["deck", "quiz", "game", "mock"];
const VALID_SOURCES = ["deck", "text", "upload", "guide", "material"];

interface ConvertInput {
  sourceType: string;
  sourceRef?: string | null;
  text?: string | null;
  file?: File | null;
  examCode?: string | null;
  subjectCode?: string | null;
  topicName?: string | null;
  pathId?: string | null;
  topicId?: string | null;
  materialId?: string | null;
  mode: string;
  gameType?: string | null;
  count?: number;
  difficulty?: string;
  title?: string;
}

const VALID_GAME_TYPES = ["match", "blocks", "blast"];

async function parseInput(request: NextRequest): Promise<ConvertInput> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const countRaw = form.get("count");
    const str = (k: string) => (form.get(k) as string) || null;
    return {
      sourceType: String(form.get("sourceType") || ""),
      sourceRef: str("sourceRef"),
      text: str("text"),
      file: (form.get("file") as File) || null,
      examCode: str("examCode"),
      subjectCode: str("subjectCode"),
      topicName: str("topicName"),
      pathId: str("pathId"),
      topicId: str("topicId"),
      materialId: str("materialId"),
      mode: String(form.get("mode") || ""),
      gameType: str("gameType"),
      count: countRaw ? parseInt(String(countRaw), 10) : undefined,
      difficulty: (form.get("difficulty") as string) || undefined,
      title: (form.get("title") as string) || undefined,
    };
  }
  const body = await request.json();
  return {
    sourceType: String(body.sourceType || ""),
    sourceRef: body.sourceRef ?? null,
    text: body.text ?? null,
    examCode: body.examCode ?? null,
    subjectCode: body.subjectCode ?? null,
    topicName: body.topicName ?? null,
    pathId: body.pathId ?? null,
    topicId: body.topicId ?? null,
    materialId: body.materialId ?? null,
    mode: String(body.mode || ""),
    gameType: body.gameType ?? null,
    count: typeof body.count === "number" ? body.count : undefined,
    difficulty: body.difficulty,
    title: body.title,
  };
}

// Resolve a source into { text, title, sourceRef } for the generator.
async function resolveSource(
  input: ConvertInput,
  userId: string
): Promise<{ text: string; title: string; sourceRef: string | null }> {
  if (input.sourceType === "deck") {
    if (!input.sourceRef) throw new ExtractionError("Missing deck id.");
    const deckId = parseInt(input.sourceRef, 10);
    if (Number.isNaN(deckId)) throw new ExtractionError("Invalid deck id.");
    const deck = await getFlashcardDeck(deckId, userId);
    if (!deck) throw new ExtractionError("Deck not found or not accessible.");
    const cards = (deck.cards || []) as { front: string; back: string }[];
    if (!cards.length) throw new ExtractionError("This deck has no cards to convert.");
    const text = cards.map((c) => `${c.front}\n${c.back}`).join("\n\n");
    return { text, title: input.title || deck.title, sourceRef: String(deckId) };
  }

  if (input.sourceType === "text") {
    const text = (input.text || "").trim();
    if (text.length < 100) {
      throw new ExtractionError("Please provide at least 100 characters of text.");
    }
    return { text, title: input.title || "Custom study set", sourceRef: null };
  }

  if (input.sourceType === "upload") {
    if (!input.file) throw new ExtractionError("No file uploaded.");
    const extracted = await extractTextFromUpload(input.file);
    return {
      text: extracted.text,
      title: input.title || extracted.fileName.replace(/\.[^.]+$/, ""),
      sourceRef: null,
    };
  }

  if (input.sourceType === "guide") return resolveGuide(input);

  if (input.sourceType === "material") return resolveMaterial(input);

  throw new ExtractionError("Unknown source type.");
}

export async function POST(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let input: ConvertInput;
  try {
    input = await parseInput(request);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!VALID_MODES.includes(input.mode as StudyMode)) {
    return NextResponse.json(
      { error: "mode must be one of: deck, quiz, game, mock." },
      { status: 400 }
    );
  }
  if (!VALID_SOURCES.includes(input.sourceType)) {
    return NextResponse.json(
      { error: "sourceType must be one of: deck, text, upload." },
      { status: 400 }
    );
  }

  const mode = input.mode as StudyMode;
  const gameType =
    input.gameType && VALID_GAME_TYPES.includes(input.gameType)
      ? (input.gameType as "match" | "blocks" | "blast")
      : "match";
  const count = Math.min(Math.max(input.count ?? 10, 3), 30);
  const difficulty =
    input.difficulty === "easy" || input.difficulty === "medium" || input.difficulty === "hard"
      ? input.difficulty
      : undefined;

  // 1. Resolve source → text
  let source: { text: string; title: string; sourceRef: string | null };
  try {
    source = await resolveSource(input, userId);
  } catch (err) {
    const message = err instanceof ExtractionError ? err.message : "Could not read the source.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 2. Generate mode-specific content
  let generated;
  try {
    generated = await generateStudyMode(mode, source.text, {
      count,
      difficulty,
      title: source.title,
    });
  } catch (err) {
    console.error("[Convert] Generation error:", err);
    const message =
      err instanceof GenerationError
        ? err.message
        : "Failed to generate study material from this content.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 3. Persist as an owned artifact
  try {
    if (generated.mode === "deck") {
      const deck = await createFlashcardDeck(
        userId,
        source.title,
        `Generated from ${input.sourceType}`,
        "",
        "",
        "",
        true
      );
      await addFlashcardsToDeck(
        deck.id,
        generated.items.map((c) => ({ front: c.front, back: c.back, hint: c.hint }))
      );
      return NextResponse.json({
        success: true,
        artifact: { type: "deck", id: deck.id, title: deck.title, count: generated.items.length },
      });
    }

    if (generated.mode === "game") {
      const game = await createGeneratedGame({
        userId,
        title: source.title,
        gameType,
        pairs: generated.items,
        sourceType: input.sourceType,
        sourceRef: source.sourceRef,
      });
      return NextResponse.json({
        success: true,
        artifact: {
          type: "game",
          id: game.id,
          title: game.title,
          shareSlug: game.share_slug,
          count: generated.items.length,
        },
      });
    }

    if (generated.mode === "mock") {
      const mock = await createGeneratedMockTest({
        userId,
        title: source.title,
        questions: generated.items,
        difficulty: difficulty ?? null,
        sourceType: input.sourceType,
        sourceRef: source.sourceRef,
      });
      return NextResponse.json({
        success: true,
        artifact: {
          type: "mock",
          id: mock.id,
          title: mock.title,
          shareSlug: mock.share_slug,
          count: generated.items.length,
        },
      });
    }

    // quiz
    const quiz = await createGeneratedQuiz({
      userId,
      title: source.title,
      mode: "quiz",
      questions: generated.items,
      difficulty: difficulty ?? null,
      sourceType: input.sourceType,
      sourceRef: source.sourceRef,
    });
    return NextResponse.json({
      success: true,
      artifact: {
        type: "quiz",
        id: quiz.id,
        title: quiz.title,
        shareSlug: quiz.share_slug,
        count: generated.items.length,
      },
    });
  } catch (err) {
    console.error("[Convert] Persistence error:", err);
    return NextResponse.json({ error: "Failed to save the generated material." }, { status: 500 });
  }
}
