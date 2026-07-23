// Shared document-extraction service.
//
// Turns an uploaded file (TXT / PDF / DOCX / PPTX) into plain text. This is the
// single reusable seam used by the custom-quiz route and the on-demand
// "convert" pipeline — so any source document can feed any study mode
// (deck / quiz / game / mock test) through one code path.
//
// Server-only (uses dynamic imports of pdfjs-dist / mammoth / jszip).

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_UPLOAD_TYPES = {
  "text/plain": "txt",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
} as const;

export type UploadKind = (typeof SUPPORTED_UPLOAD_TYPES)[keyof typeof SUPPORTED_UPLOAD_TYPES];

export class ExtractionError extends Error {
  constructor(message: string, public readonly userFacing = true) {
    super(message);
    this.name = "ExtractionError";
  }
}

export interface ExtractedContent {
  text: string;
  kind: UploadKind;
  fileName: string;
  byteSize: number;
  wordCount: number;
}

function resolveKind(file: File): UploadKind {
  const byMime = (SUPPORTED_UPLOAD_TYPES as Record<string, UploadKind>)[file.type];
  if (byMime) return byMime;
  // Some browsers send an empty/odd MIME for docx/pptx — fall back to extension.
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "txt") return "txt";
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  if (ext === "pptx") return "pptx";
  throw new ExtractionError(
    "Unsupported file type. Please upload a PDF, DOCX, PPTX, or TXT file."
  );
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = pdfjs.getDocument({ data: bytes, useSystemFonts: true });
  const doc = await task.promise;
  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    parts.push(content.items.map((i: unknown) => (i as { str?: string }).str ?? "").join(" "));
  }
  const text = parts.join("\n\n").trim();
  if (text.length < 50) {
    throw new ExtractionError(
      "This looks like a scanned/image-based PDF with no selectable text. Try a text-based PDF or paste the content directly."
    );
  }
  return text;
}

async function extractDocx(bytes: Uint8Array): Promise<string> {
  const mammoth = await import("mammoth");
  // mammoth expects a Node Buffer.
  const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
  return value.trim();
}

async function extractPptx(bytes: Uint8Array): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(bytes);
  const slidePaths = Object.keys(zip.files)
    .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
    .sort((a, b) => {
      const n = (s: string) => parseInt(s.match(/slide(\d+)\.xml$/)?.[1] ?? "0", 10);
      return n(a) - n(b);
    });
  const slides: string[] = [];
  for (const path of slidePaths) {
    const xml = await zip.files[path].async("string");
    // Pull the text runs out of <a:t>…</a:t> and de-XML them.
    const runs = xml.match(/<a:t>([\s\S]*?)<\/a:t>/g) ?? [];
    const text = runs
      .map((r) => r.replace(/<\/?a:t>/g, ""))
      .join(" ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
    if (text) slides.push(text);
  }
  return slides.join("\n\n").trim();
}

/**
 * Extract plain text from raw bytes of a known kind. Shared core used by both
 * uploaded-File extraction and server-side sources (e.g. a study-material file
 * pulled from Supabase Storage). Throws ExtractionError with a user-facing
 * message on any recoverable problem (scanned PDF, too little text).
 */
export async function extractTextFromBytes(
  bytes: Uint8Array,
  kind: UploadKind,
  fileName: string
): Promise<ExtractedContent> {
  let text: string;
  try {
    if (kind === "txt") text = new TextDecoder().decode(bytes).trim();
    else if (kind === "pdf") text = await extractPdf(bytes);
    else if (kind === "docx") text = await extractDocx(bytes);
    else text = await extractPptx(bytes);
  } catch (err) {
    if (err instanceof ExtractionError) throw err;
    throw new ExtractionError(
      "Could not read that file. Please make sure it isn't corrupted or password-protected."
    );
  }

  if (!text || text.trim().length < 100) {
    throw new ExtractionError(
      "That file contains too little text to work with. Please use a document with at least 100 characters."
    );
  }

  return {
    text,
    kind,
    fileName,
    byteSize: bytes.byteLength,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

/**
 * Extract plain text from an uploaded File. Throws ExtractionError with a
 * user-facing message on any recoverable problem (unsupported type, too big,
 * scanned PDF, too little text).
 */
export async function extractTextFromUpload(file: File): Promise<ExtractedContent> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ExtractionError("File too large. Maximum size is 10MB.");
  }
  const kind = resolveKind(file);
  const bytes = new Uint8Array(await file.arrayBuffer());
  return extractTextFromBytes(bytes, kind, file.name);
}
