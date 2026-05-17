#!/usr/bin/env tsx
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
envFile.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  // Get some questions and a user
  const questions = await db.execute({
    sql: 'SELECT id FROM exam_questions LIMIT 5',
    args: [],
  });

  const users = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: ['girish.raj0710@gmail.com'],
  });

  if (questions.rows.length === 0 || users.rows.length === 0) {
    console.log('No questions or users found');
    return;
  }

  const userId = users.rows[0].id as string;

  const sampleReports = [
    {
      questionId: questions.rows[0].id,
      reason: 'incorrect_answer',
      details: 'The correct answer should be B, not A. I verified this from the textbook.',
    },
    {
      questionId: questions.rows[1].id,
      reason: 'wrong_explanation',
      details: 'The explanation is confusing and doesn\'t explain why option C is wrong.',
    },
    {
      questionId: questions.rows[2].id,
      reason: 'typo',
      details: 'There\'s a spelling mistake: "accomodate" should be "accommodate"',
    },
    {
      questionId: questions.rows[3].id,
      reason: 'unclear_question',
      details: 'The question is ambiguous - it could be interpreted in two different ways.',
    },
  ];

  console.log('Creating sample reports...\n');

  for (const report of sampleReports) {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.execute({
      sql: `INSERT INTO question_reports
            (id, question_id, user_id, reason, details, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        reportId,
        report.questionId,
        userId,
        report.reason,
        report.details,
        'pending',
        new Date().toISOString(),
      ],
    });

    console.log(`✅ Created report for question ${report.questionId} - ${report.reason}`);
  }

  console.log('\n✅ Sample reports created!');
  console.log('\nYou can now visit: http://localhost:3000/admin/questions');
}

main();
