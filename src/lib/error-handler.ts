import { NextResponse } from "next/server";

/**
 * Centralized Error Handling
 *
 * Provides safe error responses to clients while logging details server-side
 */

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle API errors safely
 * - Logs full error details server-side
 * - Returns generic message to client (no stack traces, file paths, etc.)
 */
export function handleApiError(error: any, context?: string): NextResponse {
  // Log full error details server-side (will go to Vercel logs)
  console.error(`[API Error]${context ? ` ${context}` : ""}:`, {
    message: error.message,
    stack: error.stack,
    details: error.details,
    timestamp: new Date().toISOString(),
  });

  // Send generic error to client (no sensitive details)
  if (error instanceof AppError && error.isOperational) {
    return NextResponse.json(
      {
        error: error.message,
        // Only include details if it's a known operational error
      },
      { status: error.statusCode }
    );
  }

  // Unknown error - return generic 500
  return NextResponse.json(
    {
      error: "An unexpected error occurred. Please try again.",
      // Never expose error.message, error.stack, or internal details
    },
    { status: 500 }
  );
}

/**
 * Common error types
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests", retryAfter?: number) {
    super(message, 429, { retryAfter });
  }
}

/**
 * Safe logging helper (removes PII)
 */
export function safeLog(data: any): any {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const sensitiveKeys = ["password", "token", "secret", "key", "authorization", "cookie", "email", "phone"];
  const cleaned: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
      cleaned[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      cleaned[key] = safeLog(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Log with context and automatic PII redaction
 */
export function logInfo(context: string, data: any) {
  if (process.env.NODE_ENV === "production") {
    console.log(`[INFO] ${context}:`, safeLog(data));
  } else {
    // In development, log everything for debugging
    console.log(`[INFO] ${context}:`, data);
  }
}

export function logWarning(context: string, data: any) {
  console.warn(`[WARNING] ${context}:`, safeLog(data));
}

export function logError(context: string, error: any) {
  console.error(`[ERROR] ${context}:`, {
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}
