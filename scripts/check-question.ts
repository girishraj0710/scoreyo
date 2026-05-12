import { createClient } from '@libsql/client';

async function checkQuestion() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const result = await client.execute({
    sql: "SELECT id, question, options, correct_answer, explanation FROM english_questions WHERE question LIKE ? LIMIT 1",
    args: ['%moral%principal%']
  });

  if (result.rows.length > 0) {
    const row = result.rows[0];
    console.log('\n=== Question Data ===');
    console.log('ID:', row.id);
    console.log('Question:', row.question);
    console.log('Options (raw):', row.options);
    console.log('Options (parsed):', JSON.parse(row.options as string));
    console.log('Correct Answer Index:', row.correct_answer);
    console.log('Correct Answer Text:', JSON.parse(row.options as string)[row.correct_answer as number]);
    console.log('Explanation:', row.explanation);
  } else {
    console.log('Question not found');
  }
}

checkQuestion();
