import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { getCurrentSyllabusYear } from "../../src/lib/syllabus-config";
import { getExamById, getSubjectById } from "../../src/lib/exams";

export interface NormalizedPYQQuestion {
  examId: string;
  subjectId: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  year: number;
  difficulty?: string;
  marks?: number;
}

export interface ValidationIssue {
  row: number;
  severity: "error" | "warning";
  code:
    | "invalid_exam"
    | "invalid_subject"
    | "invalid_topic"
    | "invalid_question"
    | "invalid_options"
    | "invalid_answer"
    | "invalid_year";
  message: string;
}

export interface QualityBreakdown {
  authenticity: number;
  syllabusAlignment: number;
  structure: number;
  freshness: number;
}

export interface QuestionQuality {
  row: number;
  score: number;
  verdict: "high" | "medium" | "low";
  breakdown: QualityBreakdown;
}

export interface ValidationResult {
  filePath: string;
  totalQuestions: number;
  validQuestions: number;
  issues: ValidationIssue[];
  quality: {
    averageScore: number;
    high: number;
    medium: number;
    low: number;
    perQuestion: QuestionQuality[];
  };
}

export function resolveCanonicalSubjectId(examId: string, subjectIdOrName: string): string {
  const raw = subjectIdOrName.trim();
  if (!raw) return raw;

  if (getSubjectById(examId, raw)) {
    return raw;
  }

  const exam = getExamById(examId);
  if (!exam) return raw;

  const normalizedInput = normalizeText(raw);
  const matched = exam.subjects.find((subject) => {
    const normalizedSubjectId = normalizeText(subject.id);
    const normalizedSubjectName = normalizeText(subject.name);
    return (
      normalizedSubjectId === normalizedInput ||
      normalizedSubjectName === normalizedInput ||
      normalizedSubjectId.includes(normalizedInput) ||
      normalizedSubjectName.includes(normalizedInput) ||
      normalizedInput.includes(normalizedSubjectName)
    );
  });

  return matched?.id || raw;
}

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(input: string): Set<string> {
  return new Set(
    normalizeText(input)
      .split(" ")
      .filter((token) => token.length > 2)
  );
}

function hasTopicMatch(examId: string, subjectId: string, topic: string): boolean {
  const subject = getSubjectById(examId, subjectId);
  if (!subject) return false;

  const normalizedTopic = normalizeText(topic);
  for (const officialTopic of subject.topics) {
    const normalizedOfficial = normalizeText(officialTopic);
    if (
      normalizedOfficial === normalizedTopic ||
      normalizedOfficial.includes(normalizedTopic) ||
      normalizedTopic.includes(normalizedOfficial)
    ) {
      return true;
    }

    const officialTokens = tokenize(officialTopic);
    const inputTokens = tokenize(topic);
    const overlap = [...inputTokens].filter((token) => officialTokens.has(token)).length;
    if (overlap >= 2) {
      return true;
    }
  }

  return false;
}

function normalizeFromCSV(record: any): NormalizedPYQQuestion {
  const examId = String(record.exam_id || "").trim();
  const subjectInput = String(record.subject_id || "").trim();
  return {
    examId,
    subjectId: resolveCanonicalSubjectId(examId, subjectInput),
    topic: String(record.topic || "").trim(),
    question: String(record.question || "").trim(),
    options: [
      String(record.option_a || "").trim(),
      String(record.option_b || "").trim(),
      String(record.option_c || "").trim(),
      String(record.option_d || "").trim(),
    ],
    correctAnswer: Number.parseInt(String(record.correct_answer), 10),
    explanation: String(record.explanation || "").trim(),
    year: Number.parseInt(String(record.year), 10),
    difficulty: record.difficulty ? String(record.difficulty).trim() : undefined,
    marks: record.marks ? Number.parseFloat(String(record.marks)) : undefined,
  };
}

function normalizeFromJSON(record: any): NormalizedPYQQuestion {
  const examId = String(record.examId || "").trim();
  const subjectInput = String(record.subjectId || "").trim();
  return {
    examId,
    subjectId: resolveCanonicalSubjectId(examId, subjectInput),
    topic: String(record.topic || "").trim(),
    question: String(record.question || "").trim(),
    options: Array.isArray(record.options)
      ? record.options.map((opt: unknown) => String(opt || "").trim())
      : [],
    correctAnswer: Number.parseInt(String(record.correctAnswer), 10),
    explanation: String(record.explanation || "").trim(),
    year: Number.parseInt(String(record.year), 10),
    difficulty: record.difficulty ? String(record.difficulty).trim() : undefined,
    marks: record.marks ? Number.parseFloat(String(record.marks)) : undefined,
  };
}

export function loadPYQFile(filePath: string): NormalizedPYQQuestion[] {
  const content = readFileSync(filePath, "utf-8");
  const ext = filePath.toLowerCase().split(".").pop();

  if (ext === "csv") {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records.map((record: any) => normalizeFromCSV(record));
  }

  if (ext === "json") {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON file must be an array of question objects");
    }
    return parsed.map((record) => normalizeFromJSON(record));
  }

  throw new Error(`Unsupported file extension: ${ext}`);
}

function clampScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

export function computeQuestionQuality(
  question: NormalizedPYQQuestion,
  row: number,
  issues: ValidationIssue[]
): QuestionQuality {
  const currentSyllabusYear = getCurrentSyllabusYear(question.examId);
  const subjectExists = !!getSubjectById(question.examId, question.subjectId);
  const topicIssue = issues.find((issue) => issue.code === "invalid_topic");
  const subjectIssue = issues.find((issue) => issue.code === "invalid_subject");
  const optionsIssue = issues.find((issue) => issue.code === "invalid_options");
  const answerIssue = issues.find((issue) => issue.code === "invalid_answer");
  const questionIssue = issues.find((issue) => issue.code === "invalid_question");
  const yearIssue = issues.find((issue) => issue.code === "invalid_year");

  const authenticity = clampScore(
    80 +
      (question.year >= currentSyllabusYear - 5 ? 10 : 0) +
      (!yearIssue ? 10 : -25)
  );

  const syllabusAlignment = clampScore(
    100 - (subjectIssue ? 70 : 0) - (topicIssue ? 25 : 0)
  );

  const structure = clampScore(
    100 - (questionIssue ? 35 : 0) - (optionsIssue ? 35 : 0) - (answerIssue ? 30 : 0)
  );

  const freshness = clampScore(100 - Math.max(0, currentSyllabusYear - question.year) * 8);

  const weighted =
    authenticity * 0.35 +
    syllabusAlignment * 0.35 +
    structure * 0.2 +
    freshness * 0.1;

  const score = clampScore(weighted);
  const verdict: "high" | "medium" | "low" =
    score >= 85 && subjectExists ? "high" : score >= 65 ? "medium" : "low";

  return {
    row,
    score,
    verdict,
    breakdown: {
      authenticity,
      syllabusAlignment,
      structure,
      freshness,
    },
  };
}

export function validateQuestion(question: NormalizedPYQQuestion, row: number): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const exam = getExamById(question.examId);
  if (!exam) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_exam",
      message: `Unknown examId: "${question.examId}"`,
    });
    return issues;
  }

  const subject = getSubjectById(question.examId, question.subjectId);
  if (!subject) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_subject",
      message: `Unknown subjectId "${question.subjectId}" for exam "${question.examId}"`,
    });
  }

  if (!question.topic) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_topic",
      message: "Topic is empty",
    });
  } else if (subject && !hasTopicMatch(question.examId, question.subjectId, question.topic)) {
    issues.push({
      row,
      severity: "warning",
      code: "invalid_topic",
      message: `Topic "${question.topic}" does not match current syllabus topics for ${question.examId}/${question.subjectId}`,
    });
  }

  if (!question.question || question.question.length < 15) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_question",
      message: "Question text missing or too short",
    });
  }

  if (question.options.length !== 4 || question.options.some((opt) => !opt)) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_options",
      message: "Exactly 4 non-empty options are required",
    });
  }

  if (![0, 1, 2, 3].includes(question.correctAnswer)) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_answer",
      message: `correctAnswer must be 0-3, got: ${question.correctAnswer}`,
    });
  }

  const currentSyllabusYear = getCurrentSyllabusYear(question.examId);
  if (!Number.isFinite(question.year)) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_year",
      message: "Year is not a valid number",
    });
  } else if (question.year > currentSyllabusYear) {
    issues.push({
      row,
      severity: "error",
      code: "invalid_year",
      message: `Year ${question.year} is in the future for current syllabus year ${currentSyllabusYear}`,
    });
  } else if (question.year < currentSyllabusYear - 10) {
    issues.push({
      row,
      severity: "warning",
      code: "invalid_year",
      message: `Year ${question.year} is older than 10-year rolling window`,
    });
  }

  return issues;
}

export function validatePYQFile(filePath: string): ValidationResult {
  const questions = loadPYQFile(filePath);
  const issues: ValidationIssue[] = [];
  const perQuestion: QuestionQuality[] = [];

  questions.forEach((question, idx) => {
    const row = idx + 1;
    const questionIssues = validateQuestion(question, row);
    issues.push(...questionIssues);
    perQuestion.push(computeQuestionQuality(question, row, questionIssues));
  });

  const errorRows = new Set(issues.filter((issue) => issue.severity === "error").map((issue) => issue.row));
  const validQuestions = questions.length - errorRows.size;
  const totalQuality = perQuestion.reduce((acc, item) => acc + item.score, 0);
  const averageScore = questions.length > 0 ? Math.round(totalQuality / questions.length) : 0;
  const high = perQuestion.filter((item) => item.verdict === "high").length;
  const medium = perQuestion.filter((item) => item.verdict === "medium").length;
  const low = perQuestion.filter((item) => item.verdict === "low").length;

  return {
    filePath,
    totalQuestions: questions.length,
    validQuestions,
    issues,
    quality: {
      averageScore,
      high,
      medium,
      low,
      perQuestion,
    },
  };
}
