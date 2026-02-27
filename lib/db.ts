import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'data', 'students.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(path.dirname(dbPath), { recursive: true });
} catch (error) {
  // Directory might already exist
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initializeDb() {
  const database = getDb();

  // Create users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create students table
  database.exec(`
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
  const adminUser = database.prepare('SELECT * FROM users WHERE email = ?').get('admin@example.com');
  if (!adminUser) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    database.prepare(`
      INSERT INTO users (email, password, name) 
      VALUES (?, ?, ?)
    `).run('admin@example.com', hashedPassword, 'Administrator');
  }
}

// Initialize database on import
initializeDb();

export function getStudents() {
  const database = getDb();
  return database.prepare('SELECT * FROM students ORDER BY createdAt DESC').all();
}

export function getStudentById(id: number) {
  const database = getDb();
  return database.prepare('SELECT * FROM students WHERE id = ?').get(id);
}

export function createStudent(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  enrollmentNumber: string;
  dateOfBirth?: string;
  address?: string;
}) {
  const database = getDb();
  return database.prepare(`
    INSERT INTO students (firstName, lastName, email, phone, enrollmentNumber, dateOfBirth, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.firstName,
    data.lastName,
    data.email,
    data.phone || null,
    data.enrollmentNumber,
    data.dateOfBirth || null,
    data.address || null
  );
}

export function updateStudent(id: number, data: Partial<{
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

  return database.prepare(`
    UPDATE students SET ${updates.join(', ')} WHERE id = ?
  `).run(...values);
}

export function deleteStudent(id: number) {
  const database = getDb();
  return database.prepare('DELETE FROM students WHERE id = ?').run(id);
}

export function getUserByEmail(email: string) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE email = ?').get(email);
}
