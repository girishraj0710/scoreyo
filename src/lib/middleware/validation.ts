/**
 * Validation Middleware
 *
 * Wraps API route handlers with automatic request validation.
 * Provides consistent error handling and logging.
 *
 * @example
 * ```typescript
 * export const POST = withValidation(
 *   loginSchema,
 *   async (request, validatedData) => {
 *     // validatedData is typed and validated
 *     const { email, name } = validatedData;
 *     // ... handle request
 *   }
 * );
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/lib/logger';
import { formatValidationErrors } from '@/lib/validation/schemas';

export type ValidatedHandler<T> = (
  request: NextRequest,
  validatedData: T
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap an API route handler with request validation
 *
 * Benefits:
 * - Automatic validation with Zod
 * - Consistent error responses
 * - Type-safe handler function
 * - Centralized logging
 *
 * @param schema - Zod schema to validate against
 * @param handler - Handler function receiving validated data
 * @returns Next.js route handler
 */
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedHandler<T>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    console.log('🔥🔥🔥 [VALIDATION MIDDLEWARE] withValidation CALLED 🔥🔥🔥');
    try {
      // Parse and validate request body
      const body = await request.json();
      console.log('[VALIDATION] Body received:', JSON.stringify(body, null, 2));

      const validatedData = schema.parse(body);
      console.log('[VALIDATION] ✅ Validation passed');

      // Call handler with validated data
      return await handler(request, validatedData);

    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const errors = formatValidationErrors(error);
        console.log('[VALIDATION] ❌ Validation failed:', errors);
        logger.warn('Validation error', {
          path: request.nextUrl.pathname,
          method: request.method,
          errors
        });

        return NextResponse.json(
          {
            error: 'Validation failed',
            details: errors
          },
          { status: 400 }
        );
      }

      // Handle JSON parsing errors
      if (error instanceof SyntaxError) {
        logger.warn('Invalid JSON', {
          path: request.nextUrl.pathname,
          method: request.method,
        });

        return NextResponse.json(
          {
            error: 'Invalid JSON',
            message: 'Request body must be valid JSON'
          },
          { status: 400 }
        );
      }

      // Re-throw other errors to be handled by route
      throw error;
    }
  };
}

/**
 * Wrap a GET route handler with query parameter validation
 *
 * @example
 * ```typescript
 * export const GET = withQueryValidation(
 *   paginationSchema,
 *   async (request, validatedParams) => {
 *     const { page, limit } = validatedParams;
 *     // ... handle request
 *   }
 * );
 * ```
 */
export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedHandler<T>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      // Extract query parameters
      const params: any = {};
      request.nextUrl.searchParams.forEach((value, key) => {
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

      // Validate parameters
      const validatedData = schema.parse(params);

      // Call handler with validated data
      return await handler(request, validatedData);

    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatValidationErrors(error);
        logger.warn('Query validation error', {
          path: request.nextUrl.pathname,
          errors
        });

        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: errors
          },
          { status: 400 }
        );
      }

      throw error;
    }
  };
}

/**
 * Authentication middleware
 * Checks for valid user session and adds userId to request
 *
 * @example
 * ```typescript
 * export const POST = withAuth(async (request, userId) => {
 *   // userId is guaranteed to exist
 *   // ... handle authenticated request
 * });
 * ```
 */
export function withAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const userId = request.cookies.get('prepgenie-user-id')?.value;

    if (!userId) {
      logger.warn('Unauthorized request', {
        path: request.nextUrl.pathname,
        method: request.method,
      });

      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        },
        { status: 401 }
      );
    }

    return await handler(request, userId);
  };
}

/**
 * Combine multiple middleware functions
 * Executes validation -> auth -> handler
 *
 * @example
 * ```typescript
 * export const POST = withMiddleware(
 *   [withValidation(schema), withAuth],
 *   async (request, validatedData, userId) => {
 *     // Both validation and auth passed
 *     // ... handle request
 *   }
 * );
 * ```
 */
export function withAuthAndValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, validatedData: T, userId: string) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return withAuth(async (request, userId) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return await handler(request, validatedData, userId);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatValidationErrors(error);
        return NextResponse.json(
          { error: 'Validation failed', details: errors },
          { status: 400 }
        );
      }
      throw error;
    }
  });
}

/**
 * Error handling middleware
 * Wraps handler with try-catch and provides consistent error responses
 *
 * @example
 * ```typescript
 * export const POST = withErrorHandling(async (request) => {
 *   // Errors are automatically caught and formatted
 *   throw new Error('Something went wrong');
 * });
 * ```
 */
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      logger.error('Route handler error', {
        path: request.nextUrl.pathname,
        method: request.method,
      }, error as Error);

      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === 'development'
        ? (error instanceof Error ? error.message : String(error))
        : 'An unexpected error occurred';

      return NextResponse.json(
        {
          error: 'Internal server error',
          message
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Rate limiting middleware
 * Can be used to wrap routes that need rate limiting
 *
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   { limit: 5, window: 60 }, // 5 requests per minute
 *   async (request) => {
 *     // ... handle request
 *   }
 * );
 * ```
 */
export function withRateLimit(
  options: { limit: number; window: number },
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    // Rate limiting implementation would go here
    // For now, just pass through
    return await handler(request);
  };
}
