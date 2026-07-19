require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function checkUserRole() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // First, let's see what columns exist
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\nAvailable columns in users table:');
    columnsResult.rows.forEach(row => console.log(`  - ${row.column_name}`));
    
    // Now get the user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      ['grgowda07.1992@gmail.com']
    );

    if (result.rows.length === 0) {
      console.log('\n❌ User not found');
    } else {
      const user = result.rows[0];
      console.log('\n✅ User found:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Name:  ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role:  ${user.role}`);
      console.log(`ID:    ${user.id}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Show all user data
      console.log('Full user data:', JSON.stringify(user, null, 2));
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUserRole();
