/**
 * Production-grade structured logger
 * Replaces console.log statements to prevent memory leaks
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.debug('User action', { userId, action: 'quiz_start' });
 *   logger.error('API error', { endpoint: '/api/quiz' }, error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;

  constructor() {
    const env = process.env.NODE_ENV;
    const logLevel = (process.env.LOG_LEVEL as LogLevel) || (env === 'production' ? 'error' : 'debug');

    this.config = {
      level: logLevel,
      enableConsole: env !== 'production',  // No console.log in production
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (!this.shouldLog('debug') || !this.config.enableConsole) return;
    console.log(this.formatMessage('debug', message, context));
  }

  info(message: string, context?: LogContext) {
    if (!this.shouldLog('info') || !this.config.enableConsole) return;
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    if (!this.shouldLog('warn')) return;
    if (this.config.enableConsole) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, context?: LogContext, error?: Error) {
    if (!this.shouldLog('error')) return;

    // Always log errors (can be sent to external service in future)
    if (this.config.enableConsole) {
      console.error(this.formatMessage('error', message, context), error);
    }
  }

  // Specialized methods for common patterns
  cacheHit(key: string) {
    this.debug('Cache hit', { key });
  }

  cacheMiss(key: string) {
    this.debug('Cache miss', { key });
  }
}

export const logger = new Logger();

// Export helper for performance tracking
export async function trackPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = performance.now();

  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);
    logger.debug(`${operation} completed`, { duration, ...context });
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    logger.error(`${operation} failed`, { duration, ...context }, error as Error);
    throw error;
  }
}
