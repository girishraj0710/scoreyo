import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Get admin user
  const userRes = await pool.query(
    "SELECT id, name, email, role FROM users WHERE email = 'girish.raj@salesforce.com'"
  );
  
  if (userRes.rows.length === 0) {
    console.log('❌ Admin user not found');
    await pool.end();
    process.exit(0);
  }
  
  const adminUser = userRes.rows[0];
  console.log('✅ Admin user found:');
  console.log('   ID:', adminUser.id);
  console.log('   Name:', adminUser.name);
  console.log('   Role:', adminUser.role);
  console.log('');
  
  // Check quiz sessions
  const sessionsRes = await pool.query(
    'SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = $1',
    [adminUser.id]
  );
  console.log('📊 Quiz sessions:', sessionsRes.rows[0].count);
  
  // Check quiz results
  const resultsRes = await pool.query(
    'SELECT COUNT(*) as count FROM quiz_results WHERE user_id = $1',
    [adminUser.id]
  );
  console.log('📊 Quiz results:', resultsRes.rows[0].count);
  
  // Check user stats
  const statsRes = await pool.query(
    'SELECT * FROM user_stats WHERE user_id = $1',
    [adminUser.id]
  );
  
  if (statsRes.rows.length > 0) {
    console.log('');
    console.log('📈 User stats:');
    const stats = statsRes.rows[0];
    console.log('   Total sessions:', stats.total_sessions);
    console.log('   Total questions:', stats.total_questions);
    console.log('   Total correct:', stats.total_correct);
    console.log('   Streak:', stats.streak);
  } else {
    console.log('');
    console.log('⚠️  No user_stats record found');
  }
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
