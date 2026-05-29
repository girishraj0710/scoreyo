// PostgreSQL adapter for Supabase - provides same interface as Turso client
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected pool error:', err);
    });
  }
  return pool;
}

// Adapter to match Turso's @libsql/client interface
export interface PostgresClient {
  execute(sql: string, params?: any[]): Promise<{ rows: any[]; columns: string[] }>;
  executeMultiple(sql: string): Promise<void>;
}

export function createPostgresClient(): PostgresClient {
  const pool = getPool();

  return {
    async execute(sql: string, params: any[] = []) {
      const client = await pool.connect();
      try {
        const result = await client.query(sql, params);
        return {
          rows: result.rows,
          columns: result.fields.map(f => f.name)
        };
      } finally {
        client.release();
      }
    },

    async executeMultiple(sql: string) {
      const client = await pool.connect();
      try {
        await client.query(sql);
      } finally {
        client.release();
      }
    }
  };
}
