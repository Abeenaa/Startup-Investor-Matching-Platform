// Database Configuration
// This file creates and exports the Prisma Client instance
// Use this instance throughout your application to interact with the database

import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Create Prisma Client instance with connection retry
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

// Test database connection with retry logic
export const connectDatabase = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connected successfully');
      return;
    } catch (error: any) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('\n🔴 Database connection failed after all retries.');
        console.error('\n📋 Troubleshooting steps:');
        console.error('1. Check if your Supabase project is active (not paused)');
        console.error('2. Verify your DATABASE_URL in .env file');
        console.error('3. Check your internet connection');
        console.error('4. Verify Supabase credentials are correct');
        console.error('5. Try using the direct connection URL instead of pooler');
        console.error('\n💡 To continue without database (for frontend development):');
        console.error('   Comment out the connectDatabase() call in server.ts\n');
        
        // Don't exit immediately - allow graceful shutdown
        throw error;
      }
    }
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
};

// Export prisma instance
export { prisma };
