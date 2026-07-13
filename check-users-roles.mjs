#!/usr/bin/env node
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
  const client = await pool.connect();

  try {
    console.log('👥 Checking Users and Roles...\n');

    // Get all users with their roles
    const users = await client.query(`
      SELECT
        id,
        name,
        email,
        role,
        exam_preparing_for,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 20
    `);

    console.log(`📊 Total users found: ${users.rows.length}\n`);

    // Group by role
    const adminUsers = users.rows.filter(u => u.role === 'admin' || u.role === 'contributor');
    const studentUsers = users.rows.filter(u => u.role === 'student');

    console.log('🔑 ADMIN/CONTRIBUTOR USERS:');
    if (adminUsers.length > 0) {
      adminUsers.forEach(user => {
        console.log(`  - ${user.name || 'Unnamed'} (${user.email})`);
        console.log(`    Role: ${user.role}`);
        console.log(`    ID: ${user.id}`);
        console.log(`    Created: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('  (No admin users found)\n');
    }

    console.log('\n👨‍🎓 REGULAR USERS (STUDENTS):');
    if (studentUsers.length > 0) {
      studentUsers.forEach(user => {
        console.log(`  - ${user.name || 'Unnamed'} (${user.email})`);
        console.log(`    Exam: ${user.exam_preparing_for || 'Not set'}`);
        console.log(`    ID: ${user.id}`);
        console.log('');
      });
    } else {
      console.log('  (No student users found)\n');
    }

    // Check enrollments for each user
    console.log('\n📚 EXAM ENROLLMENTS:');
    const enrollments = await client.query(`
      SELECT
        u.name,
        u.email,
        u.role,
        e.exam_id,
        e.is_primary
      FROM users u
      LEFT JOIN user_enrolled_exams e ON u.id = e.user_id
      ORDER BY u.role, u.created_at DESC
    `);

    const enrollmentsByUser = {};
    enrollments.rows.forEach(row => {
      const key = row.email;
      if (!enrollmentsByUser[key]) {
        enrollmentsByUser[key] = {
          name: row.name,
          role: row.role,
          exams: []
        };
      }
      if (row.exam_id) {
        enrollmentsByUser[key].exams.push({
          exam: row.exam_id,
          primary: row.is_primary === 1
        });
      }
    });

    Object.entries(enrollmentsByUser).forEach(([email, data]) => {
      console.log(`  ${data.name || 'Unnamed'} (${email}) - ${data.role.toUpperCase()}`);
      if (data.exams.length > 0) {
        data.exams.forEach(e => {
          console.log(`    - ${e.exam} ${e.primary ? '(CURRENT)' : ''}`);
        });
      } else {
        console.log(`    (No enrollments)`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUsers();
