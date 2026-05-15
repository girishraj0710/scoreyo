/**
 * Diagnostic: tests each OpenRouter free model with our actual quiz prompt
 * and reports latency, success/failure, and parse correctness.
 *
 * Run: node --env-file=.env.local scripts/test-openrouter.mjs
 */

const MODELS = [
  // Confirmed live on OpenRouter as of today
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "qwen/qwen3-coder:free",
  "z-ai/glm-4.5-air:free",
  "deepseek/deepseek-v4-flash:free",
  "minimax/minimax-m2.5:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

const PROMPT = `Generate 5 MCQs for JEE Main > Physics > Mechanics (mix easy/medium/hard).
Return ONLY a JSON array, no prose. Each element:
{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":{"logic":"why correct","trapAlerts":["why opt0 wrong","why opt1 wrong","why opt2 wrong"],"commonMistakes":["err1","err2"]},"difficulty":"easy|medium|hard"}
Rules: exactly 4 options; correctAnswer is 0-3; trapAlerts covers the 3 WRONG options only; output strictly valid JSON starting with [ and ending with ].`;

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("OPENROUTER_API_KEY not set");
  process.exit(1);
}

function tryParse(text) {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  const s = clean.indexOf("[");
  const e = clean.lastIndexOf("]");
  if (s !== -1 && e !== -1 && s < e) clean = clean.substring(s, e + 1);
  try {
    const arr = JSON.parse(clean);
    return { ok: Array.isArray(arr) && arr.length > 0, count: Array.isArray(arr) ? arr.length : 0 };
  } catch (err) {
    return { ok: false, error: err.message, sample: clean.substring(0, 200) };
  }
}

async function testModel(model) {
  const started = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: PROMPT }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const elapsed = Date.now() - started;

    if (!res.ok) {
      const errText = await res.text();
      return { model, elapsed, status: res.status, error: errText.substring(0, 300) };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const parse = tryParse(text);
    return {
      model,
      elapsed,
      status: res.status,
      responseChars: text.length,
      parse,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return { model, elapsed: Date.now() - started, error: err.message };
  }
}

console.log("\nTesting OpenRouter free models...\n");

// Test all in parallel
const results = await Promise.all(MODELS.map(testModel));

console.log("\n=== Results ===\n");
for (const r of results) {
  const status = r.parse?.ok
    ? `✓ OK (${r.parse.count} qs, ${r.elapsed}ms)`
    : r.error
    ? `✗ ERROR (${r.elapsed}ms): ${r.error.substring(0, 150)}`
    : `✗ BAD PARSE (${r.elapsed}ms): ${r.parse?.error || "unknown"}`;
  console.log(`${r.model}\n  ${status}`);
  if (r.parse && !r.parse.ok && r.parse.sample) {
    console.log(`  Sample output: ${r.parse.sample.substring(0, 120)}...`);
  }
  console.log();
}
