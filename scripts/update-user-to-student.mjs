import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Update user to student
  const updateRes = await pool.query(
    "UPDATE users SET role = 'student' WHERE email = 'grgowda07.1992@gmail.com' RETURNING id, name, email, role"
  );
  
  if (updateRes.rows.length === 0) {
    console.log('❌ User not found');
    await pool.end();
    process.exit(1);
  }
  
  const user = updateRes.rows[0];
  console.log('✅ User updated to student:');
  console.log('   ID:', user.id);
  console.log('   Name:', user.name);
  console.log('   Email:', user.email);
  console.log('   Role:', user.role);
  console.log('');
  console.log('🎓 This user is now a regular student with single-exam access.');
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
