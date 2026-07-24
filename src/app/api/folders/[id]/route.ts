import { NextRequest, NextResponse } from "next/server";
import {
  ensureFolderTables,
  getFolderWithDecks,
  deleteFolder,
} from "@/lib/db";

/**
 * GET /api/folders/[id] — get a folder and the decks it contains.
 */
export async function GET(
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
    await ensureFolderTables();
    const folder = await getFolderWithDecks(folderId, userId);
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json({ folder });
  } catch (error) {
    console.error("[folders] GET [id] failed:", error);
    return NextResponse.json({ error: "Failed to load folder" }, { status: 500 });
  }
}

/**
 * DELETE /api/folders/[id] — delete a folder (its deck links are cascaded).
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
    await ensureFolderTables();
    const deleted = await deleteFolder(folderId, userId);
    if (!deleted) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[folders] DELETE failed:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
