import { NextRequest, NextResponse } from "next/server";
import {
  ensureFolderTables,
  addDeckToFolder,
  removeDeckFromFolder,
} from "@/lib/db";

/**
 * POST /api/folders/[id]/decks — add a deck to the folder. Body: { deckId }.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { id } = await params;
  const folderId = parseInt(id, 10);
  if (Number.isNaN(folderId)) {
    return NextResponse.json({ error: "Invalid folder id" }, { status: 400 });
  }

  try {
    const { deckId } = await request.json();
    const deckIdNum = parseInt(String(deckId), 10);
    if (Number.isNaN(deckIdNum)) {
      return NextResponse.json({ error: "Invalid deck id" }, { status: 400 });
    }

    await ensureFolderTables();
    const ok = await addDeckToFolder(folderId, deckIdNum, userId);
    if (!ok) {
      return NextResponse.json(
        { error: "Folder or deck not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[folders] add deck failed:", error);
    return NextResponse.json({ error: "Failed to add deck" }, { status: 500 });
  }
}

/**
 * DELETE /api/folders/[id]/decks — remove a deck from the folder.
 * Body: { deckId }.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { id } = await params;
  const folderId = parseInt(id, 10);
  if (Number.isNaN(folderId)) {
    return NextResponse.json({ error: "Invalid folder id" }, { status: 400 });
  }

  try {
    const { deckId } = await request.json();
    const deckIdNum = parseInt(String(deckId), 10);
    if (Number.isNaN(deckIdNum)) {
      return NextResponse.json({ error: "Invalid deck id" }, { status: 400 });
    }

    await ensureFolderTables();
    const removed = await removeDeckFromFolder(folderId, deckIdNum, userId);
    if (!removed) {
      return NextResponse.json({ error: "Deck not in folder" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[folders] remove deck failed:", error);
    return NextResponse.json({ error: "Failed to remove deck" }, { status: 500 });
  }
}
