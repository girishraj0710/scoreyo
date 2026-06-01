/**
 * Request Validation Schemas
 *
 * Centralized validation using Zod for all API endpoints.
 * Prevents invalid data from reaching the database.
 *
 * Benefits:
 * - Type-safe validation
 * - Automatic TypeScript type inference
 * - Clear error messages
 * - Reusable across API routes
 */

import { z } from 'zod';

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number');
export const userIdSchema = z.string().min(1, 'User ID is required');
export const examIdSchema = z.string().min(1, 'Exam ID is required');
export const subjectIdSchema = z.string().min(1, 'Subject ID is required');

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phoneNumber: phoneSchema.optional(),
  examPreparingFor: z.string().optional(),
  age: z.number().int().min(10).max(100).optional(),
  location: z.string().max(200).optional(),
});

export const otpRequestSchema = z.object({
  email: emailSchema,
});

export const otpVerifySchema = z.object({
  email: emailSchema,
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: phoneSchema.optional(),
  examPreparingFor: z.string().optional(),
  age: z.number().int().min(10).max(100).optional(),
  location: z.string().max(200).optional(),
});

// ============================================================================
// QUIZ SCHEMAS
// ============================================================================

export const quizRequestSchema = z.object({
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  topic: z.string().min(1, 'Topic is required'),
  count: z.number().int().min(1).max(100).default(5),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).default('mixed'),
  useCache: z.boolean().optional().default(true),
});

export const quizSubmissionSchema = z.object({
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  topic: z.string().min(1),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).min(2).max(6),
    correctAnswer: z.number().int().min(0),
    explanation: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  })).min(1).max(100),
  userAnswers: z.array(z.number().int().min(0)).min(1).max(100),
  timeTakenSeconds: z.number().int().min(0).max(86400), // Max 24 hours
  correctCount: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  pressureMode: z.boolean().optional(),
  isSprintMode: z.boolean().optional(),
  sprintId: z.string().optional(),
});

export const quizLevelCompleteSchema = z.object({
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  level: z.number().int().min(1).max(100),
  score: z.number().min(0).max(100),
  timeTaken: z.number().int().min(0),
});

// ============================================================================
// PAYMENT SCHEMAS
// ============================================================================

export const paymentCreateSchema = z.object({
  plan: z.enum(['monthly', 'quarterly'], {
    message: 'Plan must be either monthly or quarterly'
  }),
  couponCode: z.string().optional(),
});

export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// ============================================================================
// SPRINT SCHEMAS
// ============================================================================

export const sprintJoinSchema = z.object({
  sprintId: z.string().min(1, 'Sprint ID is required'),
});

export const sprintSubmitSchema = z.object({
  sprintId: z.string().min(1),
  answers: z.array(z.number().int().min(0)).min(1).max(100),
  timeTakenSeconds: z.number().int().min(0).max(7200), // Max 2 hours
});

// ============================================================================
// DPP (DAILY PRACTICE PROBLEM) SCHEMAS
// ============================================================================

export const dppSubmitSchema = z.object({
  dppId: z.string().min(1),
  answer: z.number().int().min(0),
  timeTaken: z.number().int().min(0).max(3600), // Max 1 hour
});

// ============================================================================
// WEAKNESS TRACKING SCHEMAS
// ============================================================================

export const weaknessRecordSchema = z.object({
  questionText: z.string().min(1).max(1000),
  correctAnswer: z.string().min(1).max(500),
  userAnswer: z.string().min(1).max(500),
  weaknessType: z.enum(['calculation', 'concept', 'time-pressure', 'careless']),
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  topic: z.string().min(1),
});

// ============================================================================
// CLARIFICATION SCHEMAS
// ============================================================================

export const clarifyRequestSchema = z.object({
  questionText: z.string().min(10, 'Question must be at least 10 characters').max(1000),
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  topic: z.string().optional(),
});

// ============================================================================
// REPORT SCHEMAS
// ============================================================================

export const reportQuestionSchema = z.object({
  questionText: z.string().min(1).max(1000),
  issueType: z.enum(['incorrect', 'unclear', 'duplicate', 'other']),
  description: z.string().min(10, 'Please provide detailed description').max(500),
  examId: examIdSchema,
  subjectId: subjectIdSchema,
});

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

export const adminQuestionCreateSchema = z.object({
  examId: examIdSchema,
  subjectId: subjectIdSchema,
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  question: z.string().min(10).max(2000),
  options: z.array(z.string().min(1).max(500)).min(2).max(6),
  correctAnswer: z.number().int().min(0),
  explanation: z.string().min(10).max(2000),
  verified: z.boolean().default(true),
});

export const adminAnalyticsQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  examId: examIdSchema.optional(),
  limit: z.number().int().min(1).max(1000).default(100),
});

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate request body against a schema
 * Throws ZodError with detailed validation errors if invalid
 *
 * @example
 * ```typescript
 * const data = await validateRequest(request, quizRequestSchema);
 * // data is now typed and validated
 * ```
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}

/**
 * Validate URL search params against a schema
 *
 * @example
 * ```typescript
 * const params = validateSearchParams(request.nextUrl.searchParams, paginationSchema);
 * ```
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params: any = {};
  searchParams.forEach((value, key) => {
    // Convert numeric strings to numbers
    if (/^\d+$/.test(value)) {
      params[key] = parseInt(value, 10);
    } else if (value === 'true') {
      params[key] = true;
    } else if (value === 'false') {
      params[key] = false;
    } else {
      params[key] = value;
    }
  });
  return schema.parse(params);
}

/**
 * Safe validation that returns result or error
 * Use when you want to handle validation errors manually
 *
 * @returns { success: true, data: T } | { success: false, error: ZodError }
 */
export function safeValidate<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format Zod validation errors into user-friendly messages
 *
 * @example
 * ```typescript
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   const messages = formatValidationErrors(error as ZodError);
 *   return NextResponse.json({ errors: messages }, { status: 400 });
 * }
 * ```
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}
