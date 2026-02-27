import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initializeDb() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        "enrollmentNumber" TEXT UNIQUE NOT NULL,
        "dateOfBirth" TEXT,
        address TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user if it doesn't exist
    const adminUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@example.com']
    );

    if (adminUser.rows.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
        ['admin@example.com', hashedPassword, 'Administrator']
      );
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getStudents() {
  try {
    const result = await pool.query(
      'SELECT * FROM students ORDER BY "createdAt" DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export async function getStudentById(id: number) {
  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}

export async function createStudent(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  enrollmentNumber: string;
  dateOfBirth?: string;
  address?: string;
}) {
  try {
    const result = await pool.query(
      `INSERT INTO students (
        "firstName", "lastName", email, phone, "enrollmentNumber", "dateOfBirth", address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone || null,
        data.enrollmentNumber,
        data.dateOfBirth || null,
        data.address || null
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}

export async function updateStudent(
  id: number,
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    enrollmentNumber: string;
    dateOfBirth: string;
    address: string;
  }>
) {
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'firstName' || key === 'lastName' || key === 'enrollmentNumber' || key === 'dateOfBirth') {
        updates.push(`"${key}" = $${paramCount}`);
      } else {
        updates.push(`${key} = $${paramCount}`);
      }
      values.push(value);
      paramCount++;
    });

    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE students SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

export async function deleteStudent(id: number) {
  try {
    const result = await pool.query(
      'DELETE FROM students WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
