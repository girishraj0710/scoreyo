import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Get user ID
  const userRes = await pool.query(
    "SELECT id FROM users WHERE email = 'girish.raj0710@gmail.com'"
  );
  
  if (userRes.rows.length === 0) {
    console.log('❌ User not found');
    await pool.end();
    process.exit(1);
  }
  
  const userId = userRes.rows[0].id;
  console.log('User ID:', userId);
  console.log('');
  
  // Simulate what getUserStats does
  const totalSessions = await pool.query(
    "SELECT COUNT(*) as count FROM quiz_sessions WHERE user_id = $1",
    [userId]
  );
  
  const totalQuestions = await pool.query(
    "SELECT COALESCE(SUM(total_questions), 0) as total, COALESCE(SUM(correct_answers), 0) as correct FROM quiz_sessions WHERE user_id = $1",
    [userId]
  );
  
  console.log('📊 Stats API should return:');
  console.log('   totalSessions:', totalSessions.rows[0].count);
  console.log('   totalQuestions:', totalQuestions.rows[0].total);
  console.log('   totalCorrect:', totalQuestions.rows[0].correct);
  console.log('   accuracy:', Math.round((totalQuestions.rows[0].correct / totalQuestions.rows[0].total) * 100) + '%');
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
