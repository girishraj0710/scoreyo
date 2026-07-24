// Unit tests for the on-demand study-mode generator's pure logic and the
// document-extraction service. No network, no DB — validates JSON parsing,
// per-mode validators (deck/quiz/game), and real PPTX/DOCX-shaped extraction.
// Run: npx tsx scripts/test-study-mode-generator.ts

import {
  parseJsonArray,
  validateDeck,
  validateGame,
  validateQuiz,
} from "../src/lib/study-mode-generator";
import { extractTextFromUpload } from "../src/lib/content-extraction";

let passed = 0;
let failed = 0;

function ok(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function throws(name: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    failed++;
    console.log(`  ❌ ${name} — expected throw, none thrown`);
  } catch {
    passed++;
    console.log(`  ✅ ${name}`);
  }
}

// A minimal File polyfill sufficient for extractTextFromUpload (name, size,
// type, arrayBuffer). Node 20 has global File but not always with arrayBuffer
// from a Buffer, so build our own to be safe & deterministic.
function makeFile(bytes: Uint8Array, name: string, type: string): File {
  return {
    name,
    type,
    size: bytes.byteLength,
    arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  } as unknown as File;
}

async function run() {
  // -------------------------------------------------------------------------
  console.log("\n1. parseJsonArray: tolerates prose around the array");
  {
    ok("plain array", JSON.stringify(parseJsonArray('[{"a":1}]')) === '[{"a":1}]');
    ok(
      "array wrapped in prose/code fence",
      parseJsonArray('Here you go:\n```json\n[{"a":1},{"b":2}]\n```').length === 2
    );
    ok("no array present throws", (() => { try { parseJsonArray("nope"); return false; } catch { return true; } })());
    ok("empty array throws", (() => { try { parseJsonArray("[]"); return false; } catch { return true; } })());
    ok("malformed json throws", (() => { try { parseJsonArray("[{bad}]"); return false; } catch { return true; } })());
  }

  // -------------------------------------------------------------------------
  console.log("\n2. validateDeck: keeps valid cards, drops junk");
  {
    const cards = validateDeck([
      { front: "Capital of France", back: "Paris", hint: "City of light" },
      { front: "  Largest planet ", back: " Jupiter " },
      { front: "no back" },
      { back: "no front" },
      { front: "", back: "empty front" },
      "not an object",
    ]);
    ok("keeps only the two valid cards", cards.length === 2, `got ${cards.length}`);
    ok("trims front/back", cards[1].front === "Largest planet" && cards[1].back === "Jupiter");
    ok("hint preserved when present", cards[0].hint === "City of light");
    ok("hint undefined when absent", cards[1].hint === undefined);
  }

  // -------------------------------------------------------------------------
  console.log("\n3. validateGame: term/definition pairs");
  {
    const pairs = validateGame([
      { term: "Mitochondria", definition: "Powerhouse of the cell" },
      { term: " Osmosis ", definition: " Water movement across a membrane " },
      { term: "missing def" },
      { definition: "missing term" },
    ]);
    ok("keeps two valid pairs", pairs.length === 2, `got ${pairs.length}`);
    ok("trims term/definition", pairs[1].term === "Osmosis" && pairs[1].definition === "Water movement across a membrane");
  }

  // -------------------------------------------------------------------------
  console.log("\n4. validateQuiz: strict MCQ shape (4 options, index 0-3)");
  {
    const qs = validateQuiz([
      { question: "2+2?", options: ["3", "4", "5", "6"], correctAnswer: 1, explanation: "basic" },
      { question: "only 3 opts", options: ["a", "b", "c"], correctAnswer: 0 },
      { question: "index out of range", options: ["a", "b", "c", "d"], correctAnswer: 4 },
      { question: "negative index", options: ["a", "b", "c", "d"], correctAnswer: -1 },
      { options: ["a", "b", "c", "d"], correctAnswer: 0 },
    ]);
    ok("keeps only the one valid MCQ", qs.length === 1, `got ${qs.length}`);
    ok("correctAnswer preserved", qs[0].correctAnswer === 1);
    ok("missing explanation defaults to empty string", qs[0].explanation === "basic");
  }

  // -------------------------------------------------------------------------
  console.log("\n5. extractTextFromUpload: TXT");
  {
    const body = "The mitochondria is the powerhouse of the cell. ".repeat(5);
    const f = makeFile(new TextEncoder().encode(body), "notes.txt", "text/plain");
    const res = await extractTextFromUpload(f);
    ok("kind is txt", res.kind === "txt");
    ok("text extracted", res.text.includes("powerhouse"));
    ok("word count > 0", res.wordCount > 0);
  }

  console.log("\n6. extractTextFromUpload: guards");
  {
    const tiny = makeFile(new TextEncoder().encode("too short"), "a.txt", "text/plain");
    await throws("rejects <100 char text", () => extractTextFromUpload(tiny));

    const weird = makeFile(new TextEncoder().encode("x".repeat(200)), "a.rtf", "application/rtf");
    await throws("rejects unsupported type", () => extractTextFromUpload(weird));

    const big = makeFile(new Uint8Array(11 * 1024 * 1024), "big.txt", "text/plain");
    await throws("rejects >10MB", () => extractTextFromUpload(big));
  }

  console.log("\n7. extractTextFromUpload: real PPTX (built with jszip)");
  {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const slide = (text: string) =>
      `<?xml version="1.0"?><p:sld xmlns:a="x"><a:t>${text}</a:t></p:sld>`;
    zip.file(
      "ppt/slides/slide1.xml",
      slide("Photosynthesis converts sunlight into chemical energy stored in glucose molecules.")
    );
    zip.file(
      "ppt/slides/slide2.xml",
      slide("Chlorophyll in the chloroplasts absorbs light primarily in the blue and red wavelengths.")
    );
    const bytes = await zip.generateAsync({ type: "uint8array" });
    const f = makeFile(
      bytes,
      "lecture.pptx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    const res = await extractTextFromUpload(f);
    ok("kind is pptx", res.kind === "pptx");
    ok("slide 1 text present", res.text.includes("Photosynthesis"));
    ok("slide 2 text present", res.text.includes("Chlorophyll"));
  }

  console.log("\n8. extractTextFromUpload: resolves kind by extension when MIME is blank");
  {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file(
      "ppt/slides/slide1.xml",
      `<?xml version="1.0"?><p:sld xmlns:a="x"><a:t>${"Newton's laws of motion describe the relationship between the motion of an object and the forces acting on it, forming the foundation of classical mechanics."}</a:t></p:sld>`
    );
    const bytes = await zip.generateAsync({ type: "uint8array" });
    const f = makeFile(bytes, "physics.pptx", ""); // blank MIME, extension only
    const res = await extractTextFromUpload(f);
    ok("falls back to extension → pptx", res.kind === "pptx");
    ok("text extracted via extension path", res.text.includes("Newton"));
  }

  console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
