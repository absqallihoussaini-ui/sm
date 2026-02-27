import { initializeDb } from '@/lib/db';

async function setupDatabase() {
  try {
    console.log('Initializing database tables and default admin user...');
    await initializeDb();
    console.log('✅ Database initialized successfully!');
    console.log('\nDefault admin credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

setupDatabase();
