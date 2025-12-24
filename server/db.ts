import dotenv from 'dotenv';
dotenv.config(); // Load .env file first

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Get PostgreSQL database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️  No DATABASE_URL found. Database operations will not be available.');
  console.warn('📝 Note: The application will run with limited functionality');
} else {
  console.log('✅ PostgreSQL database connection configured');
  console.log('📊 Database URL (masked):', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
}

// Create PostgreSQL database connection
let db: ReturnType<typeof drizzle> | null = null;

if (DATABASE_URL) {
  try {
    const client = postgres(DATABASE_URL);
    db = drizzle(client, { schema });
    console.log('✅ Using PostgreSQL database for data storage');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    console.log('⚠️  Falling back to in-memory storage');
  }
} else {
  console.log('⚠️  Using in-memory storage (data will not persist between restarts)');
}

export { db };