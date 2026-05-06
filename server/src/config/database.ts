// Database Configuration
// This file creates and exports the Prisma Client instance
// Use this instance throughout your application to interact with the database

import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Create Prisma Client instance
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test database connection
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  console.log('👋 Database disconnected');
};

// Export prisma instance
export { prisma };
