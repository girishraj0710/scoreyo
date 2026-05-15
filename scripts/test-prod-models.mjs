/**
 * Focused test on our 4 production RACE_MODELS only.
 * Uses proper AbortSignal.timeout (Node 18+) and tests sequentially
 * so one stuck model can't block the entire diagnostic.
 *
 * Run: node --env-file=.env.local scripts/test-prod-models.mjs
 */

const MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "z-ai/glm-4.5-air:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const PROMPT = `Generate 5 MCQs for JEE Main > Physics > Crystallography (mix easy/medium/hard).
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
      signal: AbortSignal.timeout(20000),
    });
    const elapsed = Date.now() - started;

    if (!res.ok) {
      const errText = await res.text();
      return { model, elapsed, status: res.status, error: errText.substring(0, 250) };
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const parse = tryParse(text);
    return { model, elapsed, status: res.status, responseChars: text.length, parse };
  } catch (err) {
    return { model, elapsed: Date.now() - started, error: err.message };
  }
}

console.log(`\nTesting ${MODELS.length} production models (sequential)...\n`);

for (const m of MODELS) {
  process.stdout.write(`  ${m} ... `);
  const r = await testModel(m);
  if (r.parse?.ok) {
    console.log(`✓ OK (${r.parse.count} qs, ${r.elapsed}ms, ${r.responseChars} chars)`);
  } else if (r.error) {
    console.log(`✗ ERROR (${r.elapsed}ms): ${r.error.substring(0, 130)}`);
  } else {
    console.log(`✗ BAD PARSE (${r.elapsed}ms): ${r.parse?.error}`);
    if (r.parse?.sample) console.log(`    Sample: ${r.parse.sample.substring(0, 120)}`);
  }
}
console.log();
