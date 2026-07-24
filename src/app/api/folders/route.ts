import { NextRequest, NextResponse } from "next/server";
import {
  ensureFolderTables,
  getFolders,
  createFolder,
} from "@/lib/db";

/**
 * GET /api/folders — list the logged-in user's folders (with deck counts).
 */
export async function GET(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    await ensureFolderTables();
    const folders = await getFolders(userId);
    return NextResponse.json({ folders });
  } catch (error) {
    console.error("[folders] GET failed:", error);
    return NextResponse.json({ error: "Failed to load folders" }, { status: 500 });
  }
}

/**
 * POST /api/folders — create a folder. Body: { name }.
 */
export async function POST(request: NextRequest) {
  const userId = request.cookies.get("scoreyo-user-id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    const trimmed = typeof name === "string" ? name.trim() : "";
    if (!trimmed) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }
    if (trimmed.length > 100) {
      return NextResponse.json({ error: "Folder name is too long" }, { status: 400 });
    }

    await ensureFolderTables();
    const folder = await createFolder(userId, trimmed);
    if (!folder) {
      return NextResponse.json(
        { error: "A folder with that name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error("[folders] POST failed:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
