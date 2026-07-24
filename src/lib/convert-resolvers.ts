// Source resolvers for the /api/convert engine. Extracted from the route so the
// guide/material resolution logic is unit- and integration-testable in isolation
// (see scripts/test-convert-resolvers.ts). Each resolver turns a source
// reference into { text, title, sourceRef } for the study-mode generator.

import { getPool, getStudyMaterial } from "@/lib/db";
import {
  extractTextFromBytes,
  ExtractionError,
  type UploadKind,
} from "@/lib/content-extraction";
import { downloadFileBytes } from "@/lib/supabase";

export interface GuideMaterialInput {
  topicName?: string | null;
  pathId?: string | null;
  topicId?: string | null;
  materialId?: string | null;
  title?: string;
}

export interface ResolvedSource {
  text: string;
  title: string;
  sourceRef: string | null;
}

// Flatten a topic_study_content / english_study_content JSONB `content` object
// into plain text for the generator. Structure: { sections: [{ title, content:
// [{ type, text?, examples?, questions?, items? }] }] }.
export function flattenStudyContent(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const sections = (content as { sections?: unknown[] }).sections;
  if (!Array.isArray(sections)) return "";
  const parts: string[] = [];
  for (const section of sections) {
    const s = section as { title?: string; content?: unknown[] };
    if (s.title) parts.push(s.title);
    if (!Array.isArray(s.content)) continue;
    for (const block of s.content) {
      const b = block as {
        text?: string;
        examples?: { text?: string; explanation?: string }[];
        questions?: { question?: string; answer?: string; explanation?: string }[];
        items?: string[];
      };
      if (b.text) parts.push(b.text);
      if (Array.isArray(b.examples)) {
        for (const ex of b.examples) {
          if (ex.text) parts.push(ex.text);
          if (ex.explanation) parts.push(ex.explanation);
        }
      }
      if (Array.isArray(b.questions)) {
        for (const q of b.questions) {
          if (q.question) parts.push(q.question);
          if (q.answer) parts.push(q.answer);
          if (q.explanation) parts.push(q.explanation);
        }
      }
      if (Array.isArray(b.items)) parts.push(...b.items.filter((i) => typeof i === "string"));
    }
  }
  return parts.join("\n").trim();
}

// Resolve a study guide (exam topic OR english lesson) into text.
export async function resolveGuide(input: GuideMaterialInput): Promise<ResolvedSource> {
  const pool = getPool();

  // English lesson: pathId + topicId → english_study_content
  if (input.pathId && input.topicId) {
    const res = await pool.query(
      `SELECT title, content FROM english_study_content
       WHERE path_id = $1 AND topic_id = $2 LIMIT 1`,
      [input.pathId, input.topicId]
    );
    if (res.rows.length === 0) {
      throw new ExtractionError("No study content is available for this lesson yet.");
    }
    const text = flattenStudyContent(res.rows[0].content);
    if (text.length < 100) {
      throw new ExtractionError("This lesson has too little content to convert.");
    }
    return {
      text,
      title: input.title || res.rows[0].title || "Study lesson",
      sourceRef: `${input.pathId}/${input.topicId}`,
    };
  }

  // Exam topic: examCode + subjectCode + topicName → topic_study_content
  if (input.topicName) {
    const topicSlug = input.topicName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    let res = await pool.query(
      `SELECT title, content FROM topic_study_content
       WHERE topic_id = $1 LIMIT 1`,
      [topicSlug]
    );
    if (res.rows.length === 0) {
      res = await pool.query(
        `SELECT title, content FROM topic_study_content
         WHERE title ILIKE $1 LIMIT 1`,
        [`%${input.topicName}%`]
      );
    }
    if (res.rows.length === 0) {
      throw new ExtractionError("No study content is available for this topic yet.");
    }
    const text = flattenStudyContent(res.rows[0].content);
    if (text.length < 100) {
      throw new ExtractionError("This topic has too little content to convert.");
    }
    return {
      text,
      title: input.title || res.rows[0].title || input.topicName,
      sourceRef: topicSlug,
    };
  }

  throw new ExtractionError("Missing guide identifiers.");
}

// Resolve a study material (uploaded PDF/DOCX/PPTX in Supabase Storage) into text.
export async function resolveMaterial(input: GuideMaterialInput): Promise<ResolvedSource> {
  if (!input.materialId) throw new ExtractionError("Missing material id.");
  const material = await getStudyMaterial(input.materialId);
  if (!material) throw new ExtractionError("Material not found.");
  if (material.status !== "approved") {
    throw new ExtractionError("This material is not available for conversion.");
  }

  // file_type is stored as 'pdf' | 'docx' | 'ppt' (ppt == pptx here).
  const kind: UploadKind =
    material.file_type === "pdf"
      ? "pdf"
      : material.file_type === "docx"
        ? "docx"
        : "pptx";

  let bytes: Uint8Array;
  try {
    bytes = await downloadFileBytes(material.file_path);
  } catch {
    throw new ExtractionError("Could not read the material file.");
  }
  const fileName = `${material.title || "material"}.${kind}`;
  const extracted = await extractTextFromBytes(bytes, kind, fileName);
  return {
    text: extracted.text,
    title: input.title || material.title || "Study material",
    sourceRef: String(input.materialId),
  };
}
