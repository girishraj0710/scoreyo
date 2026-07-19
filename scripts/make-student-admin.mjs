import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: process.env.POSTGRES_URL 
});

try {
  // Update student to admin
  const updateRes = await pool.query(
    "UPDATE users SET role = 'admin' WHERE email = 'girish.raj0710@gmail.com' RETURNING id, name, email, role"
  );
  
  if (updateRes.rows.length === 0) {
    console.log('❌ User not found');
    await pool.end();
    process.exit(1);
  }
  
  const user = updateRes.rows[0];
  console.log('✅ User updated to admin:');
  console.log('   ID:', user.id);
  console.log('   Name:', user.name);
  console.log('   Email:', user.email);
  console.log('   Role:', user.role);
  console.log('');
  console.log('🔄 Next steps:');
  console.log('   1. Clear browser cookies for localhost:3000');
  console.log('   2. Refresh the page (Cmd+Shift+R)');
  console.log('   3. Login again with girish.raj0710@gmail.com');
  console.log('   4. Should now see admin features + all quiz data!');
  
  await pool.end();
} catch (err) {
  console.error('Error:', err.message);
  await pool.end();
  process.exit(1);
}
