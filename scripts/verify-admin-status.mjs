import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Check both users
  const usersRes = await pool.query(
    "SELECT email, role FROM users WHERE email IN ('girish.raj@salesforce.com', 'girish.raj0710@gmail.com') ORDER BY email"
  );
  
  console.log('👥 Current User Roles:');
  usersRes.rows.forEach(user => {
    console.log(`   ${user.email}: ${user.role}`);
  });
  console.log('');
  
  // Check quiz data for girish.raj0710@gmail.com
  const userRes = await pool.query(
    "SELECT id FROM users WHERE email = 'girish.raj0710@gmail.com'"
  );
  
  if (userRes.rows.length > 0) {
    const userId = userRes.rows[0].id;
    
    const statsRes = await pool.query(
      'SELECT COUNT(*) as sessions, SUM(total_questions) as questions FROM quiz_sessions WHERE user_id = $1',
      [userId]
    );
    
    console.log('📊 Quiz Data for girish.raj0710@gmail.com:');
    console.log('   Sessions:', statsRes.rows[0].sessions);
    console.log('   Questions:', statsRes.rows[0].questions || 0);
  }
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
