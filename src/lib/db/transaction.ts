/**
 * Database Transaction Wrapper
 *
 * Provides ACID guarantees for multi-step database operations.
 * Use this for any operation that involves multiple queries that must all succeed or all fail.
 *
 * @example
 * ```typescript
 * await withTransaction(async (tx) => {
 *   await tx.query('INSERT INTO users ...', [userId]);
 *   await tx.query('INSERT INTO subscriptions ...', [userId, plan]);
 *   // Both succeed or both rollback
 * });
 * ```
 */

import { Pool, PoolClient } from 'pg';
import { logger } from '@/lib/logger';

export class Transaction {
  constructor(private client: PoolClient) {}

  /**
   * Execute a parameterized query within this transaction
   * Always use parameterized queries to prevent SQL injection
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.client.query(sql, params);
    return result.rows as T[];
  }

  /**
   * Execute a query and return the first row
   */
  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const result = await this.client.query(sql, params);
    return result.rows[0] as T || null;
  }

  /**
   * Execute a query that doesn't return data (INSERT, UPDATE, DELETE)
   */
  async execute(sql: string, params: any[] = []): Promise<number> {
    const result = await this.client.query(sql, params);
    return result.rowCount || 0;
  }
}

/**
 * Execute a function within a database transaction
 *
 * Automatically handles:
 * - BEGIN transaction
 * - COMMIT on success
 * - ROLLBACK on error
 * - Connection release
 *
 * @param pool - PostgreSQL connection pool
 * @param callback - Function to execute within transaction
 * @returns Result of the callback
 * @throws Error if transaction fails (after rollback)
 */
export async function withTransaction<T>(
  pool: Pool,
  callback: (tx: Transaction) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  const startTime = Date.now();

  try {
    await client.query('BEGIN');
    logger.debug('Transaction started');

    const tx = new Transaction(client);
    const result = await callback(tx);

    await client.query('COMMIT');
    const duration = Date.now() - startTime;
    logger.info('Transaction committed', { duration });

    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    const duration = Date.now() - startTime;
    logger.error('Transaction rolled back', { duration }, error as Error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Execute a function with automatic retry on deadlock
 *
 * PostgreSQL can have deadlocks with concurrent transactions.
 * This wrapper automatically retries with exponential backoff.
 *
 * @param pool - PostgreSQL connection pool
 * @param callback - Function to execute
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Result of the callback
 */
export async function withTransactionRetry<T>(
  pool: Pool,
  callback: (tx: Transaction) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTransaction(pool, callback);
    } catch (error: any) {
      lastError = error;

      // Check if it's a deadlock error (PostgreSQL error code 40P01)
      const isDeadlock = error.code === '40P01' || error.message?.includes('deadlock');

      if (!isDeadlock || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = 100 * Math.pow(2, attempt);
      logger.warn('Deadlock detected, retrying transaction', {
        attempt: attempt + 1,
        maxRetries,
        delay
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Batch multiple queries within a single transaction
 * Useful for bulk inserts/updates
 *
 * @example
 * ```typescript
 * await batchInTransaction(pool, [
 *   { sql: 'INSERT INTO users VALUES ($1, $2)', params: ['user1', 'Alice'] },
 *   { sql: 'INSERT INTO users VALUES ($1, $2)', params: ['user2', 'Bob'] },
 * ]);
 * ```
 */
export async function batchInTransaction(
  pool: Pool,
  queries: Array<{ sql: string; params: any[] }>
): Promise<void> {
  await withTransaction(pool, async (tx) => {
    for (const query of queries) {
      await tx.execute(query.sql, query.params);
    }
  });
}
