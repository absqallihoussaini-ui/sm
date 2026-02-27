import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

interface DbRow {
  id?: number;
  email?: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  enrollmentNumber?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

let db: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!db) {
    const dbUrl = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    db = createClient({
      url: dbUrl,
      authToken: authToken
    });
  }
  return db;
}

export async function initializeDb() {
  const database = getDb();

  // Create users table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create students table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      enrollmentNumber TEXT UNIQUE NOT NULL,
      dateOfBirth TEXT,
      address TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create default admin user if it doesn't exist
  const adminUserResult = await database.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: ['admin@example.com']
  });

  if (!adminUserResult.rows || adminUserResult.rows.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    await database.execute({
      sql: `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
      args: ['admin@example.com', hashedPassword, 'Administrator']
    });
  }
}

export async function getStudents() {
  const database = getDb();
  const result = await database.execute('SELECT * FROM students ORDER BY createdAt DESC');
  return result.rows || [];
}

export async function getStudentById(id: number) {
  const database = getDb();
  const result = await database.execute({
    sql: 'SELECT * FROM students WHERE id = ?',
    args: [id]
  });
  return result.rows?.[0] || null;
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
  const database = getDb();
  return await database.execute({
    sql: `
      INSERT INTO students (firstName, lastName, email, phone, enrollmentNumber, dateOfBirth, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      data.firstName,
      data.lastName,
      data.email,
      data.phone || null,
      data.enrollmentNumber,
      data.dateOfBirth || null,
      data.address || null
    ]
  });
}

export async function updateStudent(id: number, data: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  dateOfBirth: string;
  address: string;
}>) {
  const database = getDb();
  const updates: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = ?`);
    values.push(value);
  });

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);

  return await database.execute({
    sql: `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
    args: values
  });
}

export async function deleteStudent(id: number) {
  const database = getDb();
  return await database.execute({
    sql: 'DELETE FROM students WHERE id = ?',
    args: [id]
  });
}

export async function getUserByEmail(email: string) {
  const database = getDb();
  const result = await database.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  return result.rows?.[0] || null;
}
