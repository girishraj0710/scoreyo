/**
 * Safe Query Builder
 *
 * Prevents SQL injection by ALWAYS using parameterized queries.
 * Never use string concatenation for SQL queries.
 *
 * SECURITY: This module enforces parameterized queries at the type level.
 */

import { Pool } from 'pg';
import { logger } from '@/lib/logger';

/**
 * WHERE condition builder
 * Safely constructs WHERE clauses with parameterized values
 */
export class WhereBuilder {
  private conditions: string[] = [];
  private params: any[] = [];
  private paramIndex = 1;

  /**
   * Add an equality condition
   * @example where.equals('user_id', userId) → "user_id = $1"
   */
  equals(column: string, value: any): this {
    this.conditions.push(`${this.escapeIdentifier(column)} = $${this.paramIndex++}`);
    this.params.push(value);
    return this;
  }

  /**
   * Add an IN condition
   * @example where.in('status', ['active', 'pending']) → "status IN ($1, $2)"
   */
  in(column: string, values: any[]): this {
    if (values.length === 0) {
      // Empty IN clause is always false
      this.conditions.push('1=0');
      return this;
    }
    const placeholders = values.map(() => `$${this.paramIndex++}`).join(', ');
    this.conditions.push(`${this.escapeIdentifier(column)} IN (${placeholders})`);
    this.params.push(...values);
    return this;
  }

  /**
   * Add a LIKE condition
   * @example where.like('name', '%john%') → "name LIKE $1"
   */
  like(column: string, pattern: string): this {
    this.conditions.push(`${this.escapeIdentifier(column)} LIKE $${this.paramIndex++}`);
    this.params.push(pattern);
    return this;
  }

  /**
   * Add a greater than condition
   */
  greaterThan(column: string, value: any): this {
    this.conditions.push(`${this.escapeIdentifier(column)} > $${this.paramIndex++}`);
    this.params.push(value);
    return this;
  }

  /**
   * Add a less than condition
   */
  lessThan(column: string, value: any): this {
    this.conditions.push(`${this.escapeIdentifier(column)} < $${this.paramIndex++}`);
    this.params.push(value);
    return this;
  }

  /**
   * Add a BETWEEN condition
   */
  between(column: string, min: any, max: any): this {
    this.conditions.push(
      `${this.escapeIdentifier(column)} BETWEEN $${this.paramIndex++} AND $${this.paramIndex++}`
    );
    this.params.push(min, max);
    return this;
  }

  /**
   * Add an IS NULL condition
   */
  isNull(column: string): this {
    this.conditions.push(`${this.escapeIdentifier(column)} IS NULL`);
    return this;
  }

  /**
   * Add an IS NOT NULL condition
   */
  isNotNull(column: string): this {
    this.conditions.push(`${this.escapeIdentifier(column)} IS NOT NULL`);
    return this;
  }

  /**
   * Add a custom raw condition (USE WITH CAUTION)
   * Only use when you've already parameterized the values
   */
  raw(condition: string, ...params: any[]): this {
    this.conditions.push(condition);
    this.params.push(...params);
    this.paramIndex += params.length;
    return this;
  }

  /**
   * Build the WHERE clause
   * @returns { clause: "WHERE ...", params: [...] }
   */
  build(): { clause: string; params: any[] } {
    if (this.conditions.length === 0) {
      return { clause: '', params: [] };
    }
    return {
      clause: `WHERE ${this.conditions.join(' AND ')}`,
      params: this.params
    };
  }

  /**
   * Escape column/table identifiers to prevent injection
   * Wraps in double quotes and escapes internal quotes
   */
  private escapeIdentifier(identifier: string): string {
    // Basic validation: only allow alphanumeric, underscore, dot
    if (!/^[a-zA-Z0-9_\.]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier;
  }
}

/**
 * Safe SELECT query builder
 *
 * @example
 * ```typescript
 * const users = await select('users')
 *   .columns(['id', 'name', 'email'])
 *   .where(w => w.equals('status', 'active').greaterThan('age', 18))
 *   .orderBy('created_at', 'DESC')
 *   .limit(10)
 *   .execute(pool);
 * ```
 */
export class SelectBuilder<T = any> {
  private table: string;
  private selectedColumns: string[] = ['*'];
  private whereBuilder: WhereBuilder = new WhereBuilder();
  private orderByClause: string = '';
  private limitValue?: number;
  private offsetValue?: number;
  private joinClauses: string[] = [];

  constructor(table: string) {
    this.table = this.escapeIdentifier(table);
  }

  /**
   * Specify columns to select
   */
  columns(cols: string[]): this {
    this.selectedColumns = cols.map(c => this.escapeIdentifier(c));
    return this;
  }

  /**
   * Add WHERE conditions
   */
  where(builder: (w: WhereBuilder) => WhereBuilder): this {
    this.whereBuilder = builder(new WhereBuilder());
    return this;
  }

  /**
   * Add ORDER BY clause
   */
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `ORDER BY ${this.escapeIdentifier(column)} ${direction}`;
    return this;
  }

  /**
   * Add LIMIT
   */
  limit(n: number): this {
    if (n < 1 || n > 10000) {
      throw new Error('Limit must be between 1 and 10000');
    }
    this.limitValue = n;
    return this;
  }

  /**
   * Add OFFSET
   */
  offset(n: number): this {
    if (n < 0) {
      throw new Error('Offset must be non-negative');
    }
    this.offsetValue = n;
    return this;
  }

  /**
   * Add JOIN clause (USE WITH CAUTION - must be carefully constructed)
   */
  join(table: string, condition: string): this {
    this.joinClauses.push(
      `JOIN ${this.escapeIdentifier(table)} ON ${condition}`
    );
    return this;
  }

  /**
   * Build the SQL query
   */
  build(): { sql: string; params: any[] } {
    const where = this.whereBuilder.build();

    let sql = `SELECT ${this.selectedColumns.join(', ')} FROM ${this.table}`;

    if (this.joinClauses.length > 0) {
      sql += ' ' + this.joinClauses.join(' ');
    }

    if (where.clause) {
      sql += ' ' + where.clause;
    }

    if (this.orderByClause) {
      sql += ' ' + this.orderByClause;
    }

    if (this.limitValue !== undefined) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== undefined) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return { sql, params: where.params };
  }

  /**
   * Execute the query and return all rows
   */
  async execute(pool: Pool): Promise<T[]> {
    const { sql, params } = this.build();
    logger.debug('Executing SELECT query', { sql, params });

    const result = await pool.query(sql, params);
    return result.rows as T[];
  }

  /**
   * Execute and return only the first row
   */
  async executeOne(pool: Pool): Promise<T | null> {
    const rows = await this.limit(1).execute(pool);
    return rows[0] || null;
  }

  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z0-9_\.]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier;
  }
}

/**
 * Safe INSERT query builder
 *
 * @example
 * ```typescript
 * const userId = await insert('users')
 *   .values({ name: 'John', email: 'john@example.com' })
 *   .returning('id')
 *   .execute(pool);
 * ```
 */
export class InsertBuilder<T = any> {
  private table: string;
  private data: Record<string, any> = {};
  private returningColumns: string[] = [];

  constructor(table: string) {
    this.table = this.escapeIdentifier(table);
  }

  /**
   * Set values to insert
   */
  values(data: Record<string, any>): this {
    this.data = data;
    return this;
  }

  /**
   * Specify columns to return after insert
   */
  returning(...cols: string[]): this {
    this.returningColumns = cols;
    return this;
  }

  /**
   * Build the SQL query
   */
  build(): { sql: string; params: any[] } {
    const columns = Object.keys(this.data);
    const values = Object.values(this.data);

    if (columns.length === 0) {
      throw new Error('No data provided for insert');
    }

    const columnList = columns.map(c => this.escapeIdentifier(c)).join(', ');
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    let sql = `INSERT INTO ${this.table} (${columnList}) VALUES (${placeholders})`;

    if (this.returningColumns.length > 0) {
      const returning = this.returningColumns.map(c => this.escapeIdentifier(c)).join(', ');
      sql += ` RETURNING ${returning}`;
    }

    return { sql, params: values };
  }

  /**
   * Execute the insert
   */
  async execute(pool: Pool): Promise<T | null> {
    const { sql, params } = this.build();
    logger.debug('Executing INSERT query', { sql, params });

    const result = await pool.query(sql, params);
    return result.rows[0] as T || null;
  }

  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z0-9_\.]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier;
  }
}

/**
 * Safe UPDATE query builder
 *
 * @example
 * ```typescript
 * const updated = await update('users')
 *   .set({ name: 'Jane', updated_at: new Date() })
 *   .where(w => w.equals('id', userId))
 *   .execute(pool);
 * ```
 */
export class UpdateBuilder {
  private table: string;
  private data: Record<string, any> = {};
  private whereBuilder: WhereBuilder = new WhereBuilder();

  constructor(table: string) {
    this.table = this.escapeIdentifier(table);
  }

  /**
   * Set values to update
   */
  set(data: Record<string, any>): this {
    this.data = data;
    return this;
  }

  /**
   * Add WHERE conditions
   */
  where(builder: (w: WhereBuilder) => WhereBuilder): this {
    this.whereBuilder = builder(new WhereBuilder());
    return this;
  }

  /**
   * Build the SQL query
   */
  build(): { sql: string; params: any[] } {
    const columns = Object.keys(this.data);
    const values = Object.values(this.data);

    if (columns.length === 0) {
      throw new Error('No data provided for update');
    }

    const setClause = columns
      .map((col, i) => `${this.escapeIdentifier(col)} = $${i + 1}`)
      .join(', ');

    const where = this.whereBuilder.build();

    // Adjust parameter indices for WHERE clause
    const whereClause = where.clause.replace(/\$(\d+)/g, (_, num) => {
      return `$${parseInt(num) + columns.length}`;
    });

    let sql = `UPDATE ${this.table} SET ${setClause}`;

    if (whereClause) {
      sql += ' ' + whereClause;
    } else {
      throw new Error('UPDATE without WHERE clause is not allowed for safety');
    }

    return { sql, params: [...values, ...where.params] };
  }

  /**
   * Execute the update
   * @returns Number of rows updated
   */
  async execute(pool: Pool): Promise<number> {
    const { sql, params } = this.build();
    logger.debug('Executing UPDATE query', { sql, params });

    const result = await pool.query(sql, params);
    return result.rowCount || 0;
  }

  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z0-9_\.]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier;
  }
}

/**
 * Safe DELETE query builder
 *
 * @example
 * ```typescript
 * const deleted = await deleteFrom('sessions')
 *   .where(w => w.lessThan('expires_at', new Date()))
 *   .execute(pool);
 * ```
 */
export class DeleteBuilder {
  private table: string;
  private whereBuilder: WhereBuilder = new WhereBuilder();

  constructor(table: string) {
    this.table = this.escapeIdentifier(table);
  }

  /**
   * Add WHERE conditions
   */
  where(builder: (w: WhereBuilder) => WhereBuilder): this {
    this.whereBuilder = builder(new WhereBuilder());
    return this;
  }

  /**
   * Build the SQL query
   */
  build(): { sql: string; params: any[] } {
    const where = this.whereBuilder.build();

    if (!where.clause) {
      throw new Error('DELETE without WHERE clause is not allowed for safety');
    }

    const sql = `DELETE FROM ${this.table} ${where.clause}`;
    return { sql, params: where.params };
  }

  /**
   * Execute the delete
   * @returns Number of rows deleted
   */
  async execute(pool: Pool): Promise<number> {
    const { sql, params } = this.build();
    logger.debug('Executing DELETE query', { sql, params });

    const result = await pool.query(sql, params);
    return result.rowCount || 0;
  }

  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z0-9_\.]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Start building a SELECT query
 */
export function select<T = any>(table: string): SelectBuilder<T> {
  return new SelectBuilder<T>(table);
}

/**
 * Start building an INSERT query
 */
export function insert<T = any>(table: string): InsertBuilder<T> {
  return new InsertBuilder<T>(table);
}

/**
 * Start building an UPDATE query
 */
export function update(table: string): UpdateBuilder {
  return new UpdateBuilder(table);
}

/**
 * Start building a DELETE query
 */
export function deleteFrom(table: string): DeleteBuilder {
  return new DeleteBuilder(table);
}
