/**
 * List all OpenRouter free models that are currently live.
 * Run: node --env-file=.env.local scripts/list-openrouter-free.mjs
 */
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("OPENROUTER_API_KEY not set");
  process.exit(1);
}

const res = await fetch("https://openrouter.ai/api/v1/models", {
  headers: { Authorization: `Bearer ${apiKey}` },
});
if (!res.ok) {
  console.error("Failed:", res.status, await res.text());
  process.exit(1);
}
const data = await res.json();

// Filter to free models — :free suffix OR explicit zero pricing
const free = (data.data || []).filter((m) => {
  if (m.id.endsWith(":free")) return true;
  const p = m.pricing || {};
  const promptCost = parseFloat(p.prompt || "1");
  const compCost = parseFloat(p.completion || "1");
  return promptCost === 0 && compCost === 0;
});

console.log(`\nFound ${free.length} free models on OpenRouter:\n`);
for (const m of free) {
  const ctx = m.context_length ? `${(m.context_length / 1000).toFixed(0)}k ctx` : "";
  console.log(`  ${m.id}  ${ctx}`);
}
