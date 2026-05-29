import { createClient } from "@libsql/client";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function tryLocalReplica() {
  console.log('Attempting to create local replica...');
  
  try {
    // Try creating an embedded replica (downloads data locally)
    const client = createClient({
      url: "file:local-replica.db",
      syncUrl: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    console.log('Syncing data from Turso...');
    await (client as any).sync();
    
    console.log('✅ Local replica created! Now reading data...');
    const result = await client.execute('SELECT COUNT(*) as count FROM fact_exam_questions');
    console.log('Question count:', result.rows[0]);
    
    console.log('Success! Data is now in local-replica.db file');
  } catch (error) {
    console.error('Failed:', error);
  }
}

tryLocalReplica();
