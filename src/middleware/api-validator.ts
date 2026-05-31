/**
 * API Validation Middleware
 *
 * Centralized request validation for all API routes.
 * Use this to validate and sanitize incoming requests before processing.
 *
 * @example
 * ```typescript
 * import { validateApiRequest } from '@/middleware/api-validator';
 * import { quizRequestSchema } from '@/lib/validation/schemas';
 *
 * export async function POST(request: NextRequest) {
 *   const validation = await validateApiRequest(request, quizRequestSchema);
 *   if (!validation.success) {
 *     return validation.error; // Returns NextResponse with 400 error
 *   }
 *
 *   const data = validation.data; // Type-safe validated data
 *   // ... process request
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { formatValidationErrors } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  error: NextResponse;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validate API request body against a Zod schema
 *
 * @param request - Next.js request object
 * @param schema - Zod validation schema
 * @param options - Additional options
 * @returns Validation result with typed data or error response
 */
export async function validateApiRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
  options?: {
    logErrors?: boolean;
    customErrorMessage?: string;
  }
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = formatValidationErrors(error);

      if (options?.logErrors !== false) {
        logger.warn('API request validation failed', {
          path: request.nextUrl.pathname,
          errors: errorMessages,
        });
      }

      return {
        success: false,
        error: NextResponse.json(
          {
            error: options?.customErrorMessage || 'Invalid request data',
            details: errorMessages,
          },
          { status: 400 }
        ),
      };
    }

    // Unexpected error (e.g., malformed JSON)
    if (options?.logErrors !== false) {
      logger.error('API request parsing failed', {
        path: request.nextUrl.pathname,
      }, error as Error);
    }

    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Malformed request',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const params: any = {};

    // Convert URLSearchParams to object
    request.nextUrl.searchParams.forEach((value, key) => {
      // Try to parse numbers
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

    const data = schema.parse(params);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = formatValidationErrors(error);

      logger.warn('Query param validation failed', {
        path: request.nextUrl.pathname,
        errors: errorMessages,
      });

      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: errorMessages,
          },
          { status: 400 }
        ),
      };
    }

    logger.error('Query param parsing failed', {
      path: request.nextUrl.pathname,
    }, error as Error);

    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Invalid query parameters',
        },
        { status: 400 }
      ),
    };
  }
}

/**
 * Require authentication on a request
 * Returns user ID if authenticated, error response otherwise
 */
export function requireAuth(request: NextRequest): { success: true; userId: string } | ValidationFailure {
  const userId = request.cookies.get('prepgenie-user-id')?.value;

  if (!userId) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    userId,
  };
}

/**
 * Combine multiple validations
 *
 * @example
 * ```typescript
 * const result = await combineValidations(
 *   () => requireAuth(request),
 *   () => validateApiRequest(request, schema)
 * );
 *
 * if (!result.success) {
 *   return result.error;
 * }
 *
 * const [{ userId }, { data }] = result.data;
 * ```
 */
export async function combineValidations<T extends readonly any[]>(
  ...validators: Array<() => Promise<any> | any>
): Promise<{ success: true; data: T } | ValidationFailure> {
  const results: any[] = [];

  for (const validator of validators) {
    const result = await validator();

    if (!result.success) {
      return result; // Return first error
    }

    results.push(result);
  }

  return {
    success: true,
    data: results as T,
  };
}
