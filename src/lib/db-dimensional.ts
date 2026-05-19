/**
 * Dimensional Model Query Functions
 *
 * New query functions that use fact_exam_questions + bridge tables
 * to leverage shared topic pools across exams.
 *
 * Usage: Import these instead of db.ts functions once migration is complete
 */

import { queryAll, queryOne } from "./db";

export async function getExamQuestionsDimensional(
  examId: string,
  subjectId: string,
  topic: string,
  difficulty: string = "mixed",
  limit: number = 10
) {
  let rows: any[];

  // Validity period system (same as before)
  const currentYear = new Date().getFullYear();
  const validityCondition = "valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)";
  const validityArgs = [currentYear, currentYear];

  // Step 1: Get dimension IDs for exam and subject
  const examDim = await queryOne(
    `SELECT id FROM dim_exams WHERE exam_code = ?`,
    [examId]
  );

  const subjectDim = await queryOne(
    `SELECT id FROM dim_subjects WHERE subject_code = ?`,
    [subjectId]
  );

  if (!examDim || !subjectDim) {
    console.warn(`⚠️ Exam or subject not found in dimensional model: exam=${examId}, subject=${subjectId}`);
    return [];
  }

  const examDimId = examDim.id;
  const subjectDimId = subjectDim.id;

  // Step 2: Query based on topic
  if (!topic || topic.trim() === "") {
    // Empty topic = sample across ALL topics for this exam-subject
    if (difficulty === "mixed") {
      rows = await queryAll(
        `SELECT q.*
         FROM fact_exam_questions q
         JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
         WHERE b.exam_id = ?
           AND b.subject_id = ?
           AND q.${validityCondition}
         ORDER BY RANDOM()
         LIMIT ?`,
        [examDimId, subjectDimId, ...validityArgs, limit]
      );
    } else {
      rows = await queryAll(
        `SELECT q.*
         FROM fact_exam_questions q
         JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
         WHERE b.exam_id = ?
           AND b.subject_id = ?
           AND q.difficulty = ?
           AND q.${validityCondition}
         ORDER BY RANDOM()
         LIMIT ?`,
        [examDimId, subjectDimId, difficulty, ...validityArgs, limit]
      );
    }
  } else {
    // Topic-specific query with fuzzy matching on normalized topics

    // Find matching topic IDs for this exam-subject combo
    const topicIds = await queryAll(
      `SELECT DISTINCT t.id
       FROM dim_topics t
       JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
       WHERE b.exam_id = ?
         AND b.subject_id = ?
         AND (t.topic_name = ? OR t.topic_name LIKE ?)`,
      [examDimId, subjectDimId, topic, `%${topic}%`]
    );

    if (topicIds.length > 0) {
      const topicIdList = topicIds.map((t: any) => t.id).join(',');

      if (difficulty === "mixed") {
        rows = await queryAll(
          `SELECT q.*
           FROM fact_exam_questions q
           WHERE q.topic_id IN (${topicIdList})
             AND q.${validityCondition}
           ORDER BY RANDOM()
           LIMIT ?`,
          [...validityArgs, limit]
        );
      } else {
        rows = await queryAll(
          `SELECT q.*
           FROM fact_exam_questions q
           WHERE q.topic_id IN (${topicIdList})
             AND q.difficulty = ?
             AND q.${validityCondition}
           ORDER BY RANDOM()
           LIMIT ?`,
          [difficulty, ...validityArgs, limit]
        );
      }
    } else {
      rows = [];
    }

    // Fallback: keyword-level fuzzy match on topic name
    if (rows.length < limit && topic.length > 0) {
      const keywords = topic.toLowerCase().split(/[&\s]+/).filter((w: string) => w.length > 3);

      for (const keyword of keywords) {
        if (rows.length >= limit) break;
        const remaining = limit - rows.length;

        // Find topics matching this keyword
        const keywordTopicIds = await queryAll(
          `SELECT DISTINCT t.id
           FROM dim_topics t
           JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
           WHERE b.exam_id = ?
             AND b.subject_id = ?
             AND t.topic_name LIKE ?`,
          [examDimId, subjectDimId, `%${keyword}%`]
        );

        if (keywordTopicIds.length > 0) {
          const keywordIdList = keywordTopicIds.map((t: any) => t.id).join(',');

          const keywordRows = await queryAll(
            difficulty === "mixed"
              ? `SELECT q.* FROM fact_exam_questions q
                 WHERE q.topic_id IN (${keywordIdList})
                   AND q.${validityCondition}
                 ORDER BY RANDOM() LIMIT ?`
              : `SELECT q.* FROM fact_exam_questions q
                 WHERE q.topic_id IN (${keywordIdList})
                   AND q.difficulty = ?
                   AND q.${validityCondition}
                 ORDER BY RANDOM() LIMIT ?`,
            difficulty === "mixed"
              ? [...validityArgs, remaining]
              : [difficulty, ...validityArgs, remaining]
          );

          rows = [...rows, ...keywordRows];
        }
      }
    }
  }

  // Log if no questions found
  if (rows.length === 0) {
    console.warn(`⚠️ No questions found (dimensional): exam=${examId}, subject=${subjectId}, topic=${topic}, difficulty=${difficulty}, year=${currentYear}`);
  }

  // Map to same format as original function
  return rows.map((row: any) => ({
    question: row.question,
    options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    difficulty: row.difficulty,
    source: row.source || 'dimensional',
  }));
}

/**
 * Get topic statistics for analytics
 * Shows how many questions are available per topic across all exams
 */
export async function getTopicStatistics() {
  const stats = await queryAll(`
    SELECT
      t.id,
      t.topic_name,
      t.scope,
      COUNT(DISTINCT q.id) as question_count,
      COUNT(DISTINCT b.exam_id) as exam_count,
      GROUP_CONCAT(DISTINCT e.exam_name) as exam_names
    FROM dim_topics t
    LEFT JOIN fact_exam_questions q ON t.id = q.topic_id
    LEFT JOIN bridge_exam_subject_topic b ON t.id = b.topic_id
    LEFT JOIN dim_exams e ON b.exam_id = e.id
    GROUP BY t.id
    ORDER BY question_count DESC, exam_count DESC
  `, []);

  return stats;
}

/**
 * Get question count for a specific exam-subject-topic combination
 * Useful for pre-flight checks before quiz generation
 */
export async function getAvailableQuestionCount(
  examId: string,
  subjectId: string,
  topic?: string
): Promise<number> {
  const currentYear = new Date().getFullYear();

  const examDim = await queryOne(`SELECT id FROM dim_exams WHERE exam_code = ?`, [examId]);
  const subjectDim = await queryOne(`SELECT id FROM dim_subjects WHERE subject_code = ?`, [subjectId]);

  if (!examDim || !subjectDim) {
    return 0;
  }

  let countResult;

  if (!topic || topic.trim() === "") {
    // Count all questions for this exam-subject
    countResult = await queryOne(
      `SELECT COUNT(DISTINCT q.id) as cnt
       FROM fact_exam_questions q
       JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
       WHERE b.exam_id = ?
         AND b.subject_id = ?
         AND q.valid_from <= ?
         AND (q.valid_until IS NULL OR q.valid_until >= ?)`,
      [examDim.id, subjectDim.id, currentYear, currentYear]
    );
  } else {
    // Count questions for specific topic
    countResult = await queryOne(
      `SELECT COUNT(DISTINCT q.id) as cnt
       FROM fact_exam_questions q
       JOIN bridge_exam_subject_topic b ON q.topic_id = b.topic_id
       JOIN dim_topics t ON q.topic_id = t.id
       WHERE b.exam_id = ?
         AND b.subject_id = ?
         AND (t.topic_name = ? OR t.topic_name LIKE ?)
         AND q.valid_from <= ?
         AND (q.valid_until IS NULL OR q.valid_until >= ?)`,
      [examDim.id, subjectDim.id, topic, `%${topic}%`, currentYear, currentYear]
    );
  }

  return countResult ? Number(countResult.cnt) : 0;
}
