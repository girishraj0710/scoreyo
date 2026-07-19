import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Get student user
  const userRes = await pool.query(
    "SELECT id, name, email, role, current_exam, enrolled_exams FROM users WHERE email = 'girish.raj0710@gmail.com'"
  );
  
  if (userRes.rows.length === 0) {
    console.log('❌ Student user not found');
    await pool.end();
    process.exit(0);
  }
  
  const student = userRes.rows[0];
  console.log('✅ Student user found:');
  console.log('   ID:', student.id);
  console.log('   Name:', student.name);
  console.log('   Role:', student.role);
  console.log('   Current Exam:', student.current_exam);
  console.log('   Enrolled Exams:', student.enrolled_exams);
  console.log('');
  
  // Check quiz sessions
  const sessionsRes = await pool.query(
    'SELECT COUNT(*) as count, exam_id FROM quiz_sessions WHERE user_id = $1 GROUP BY exam_id',
    [student.id]
  );
  console.log('📊 Quiz sessions by exam:');
  if (sessionsRes.rows.length === 0) {
    console.log('   No quiz sessions found');
  } else {
    sessionsRes.rows.forEach(row => {
      console.log(`   ${row.exam_id}: ${row.count} sessions`);
    });
  }
  console.log('');
  
  // Check total stats
  const totalRes = await pool.query(
    'SELECT COUNT(*) as total_sessions, SUM(total_questions) as total_questions, SUM(correct_answers) as correct_answers FROM quiz_sessions WHERE user_id = $1',
    [student.id]
  );
  const totals = totalRes.rows[0];
  console.log('📈 Total stats:');
  console.log('   Sessions:', totals.total_sessions);
  console.log('   Questions:', totals.total_questions || 0);
  console.log('   Correct:', totals.correct_answers || 0);
  console.log('');
  
  // Check user_stats table
  const userStatsRes = await pool.query(
    'SELECT * FROM user_stats WHERE user_id = $1',
    [student.id]
  );
  
  if (userStatsRes.rows.length > 0) {
    const stats = userStatsRes.rows[0];
    console.log('📊 user_stats table:');
    console.log('   Total sessions:', stats.total_sessions);
    console.log('   Total questions:', stats.total_questions);
    console.log('   Total correct:', stats.total_correct);
    console.log('   Streak:', stats.streak);
  } else {
    console.log('⚠️  No user_stats record found');
  }
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
