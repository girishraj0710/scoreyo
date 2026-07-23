/**
 * Sanitize a post-auth redirect target so it can only point to an internal
 * path (never an external origin). Guards against open-redirect attacks.
 *
 * Accepts paths like "/groups/join/abc123". Rejects absolute URLs
 * ("https://evil.com"), protocol-relative URLs ("//evil.com"), and anything
 * that isn't a plain in-app path. Falls back to "/".
 */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;
  // Must be a root-relative path and not protocol-relative ("//host").
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  // Disallow backslash tricks and control characters.
  if (/[\x00-\x1f\\]/.test(target)) return fallback;
  return target;
}
