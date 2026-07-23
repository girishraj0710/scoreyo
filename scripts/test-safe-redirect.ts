// Unit tests for safeRedirect — the open-redirect guard used across the auth flow.
// Run: npx tsx scripts/test-safe-redirect.ts
// Pure assertions — no DB, no network. Exits non-zero on any failure.

import { safeRedirect } from "../src/lib/safe-redirect";

let passed = 0;
let failed = 0;

function eq(name: string, actual: string, expected: string) {
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ---------------------------------------------------------------------------
console.log("\n1. Valid internal paths pass through unchanged");
{
  eq("simple path", safeRedirect("/groups"), "/groups");
  eq("nested invite link", safeRedirect("/groups/join/a1b2c3d4"), "/groups/join/a1b2c3d4");
  eq("path with query string", safeRedirect("/groups?tab=mine"), "/groups?tab=mine");
  eq("deep path", safeRedirect("/flashcards/study/42"), "/flashcards/study/42");
}

// ---------------------------------------------------------------------------
console.log("\n2. Missing / empty input falls back to '/'");
{
  eq("null", safeRedirect(null), "/");
  eq("undefined", safeRedirect(undefined), "/");
  eq("empty string", safeRedirect(""), "/");
  eq("custom fallback honored", safeRedirect(null, "/groups"), "/groups");
}

// ---------------------------------------------------------------------------
console.log("\n3. Open-redirect attacks are blocked (fall back to '/')");
{
  // Absolute external URLs must never be honored.
  eq("https absolute URL", safeRedirect("https://evil.com"), "/");
  eq("http absolute URL", safeRedirect("http://evil.com/phish"), "/");
  // Protocol-relative — browsers treat //host as an absolute URL to another origin.
  eq("protocol-relative //host", safeRedirect("//evil.com"), "/");
  eq("protocol-relative with path", safeRedirect("//evil.com/groups"), "/");
  // Scheme-based payloads that don't start with "/".
  eq("javascript: scheme", safeRedirect("javascript:alert(1)"), "/");
  eq("data: scheme", safeRedirect("data:text/html,<script>"), "/");
  eq("mailto: scheme", safeRedirect("mailto:a@b.com"), "/");
  // Relative path without leading slash — not a valid in-app destination.
  eq("bare relative path", safeRedirect("groups"), "/");
}

// ---------------------------------------------------------------------------
console.log("\n4. Backslash and control-char tricks are blocked");
{
  // Some browsers normalize backslashes to slashes, so /\evil.com can escape origin.
  eq("backslash escape /\\host", safeRedirect("/\\evil.com"), "/");
  eq("double backslash", safeRedirect("\\\\evil.com"), "/");
  eq("embedded newline", safeRedirect("/groups\nSet-Cookie: x=1"), "/");
  eq("embedded CR", safeRedirect("/groups\r\nLocation: http://evil.com"), "/");
  eq("null byte", safeRedirect("/groups\x00"), "/");
  eq("tab char", safeRedirect("/groups\t/x"), "/");
}

// ---------------------------------------------------------------------------
console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
