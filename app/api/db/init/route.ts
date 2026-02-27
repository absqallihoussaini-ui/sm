import { initializeDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDb();
    return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
