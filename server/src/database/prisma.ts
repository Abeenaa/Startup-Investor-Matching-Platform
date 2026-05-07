// Prisma Client Singleton
// Exports a single shared Prisma instance for the entire application

import { PrismaClient } from '@prisma/client';
import { NODE_ENV } from '../config/env';

// Prevent multiple Prisma instances in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  global.__prisma ??
  new PrismaClient({
    log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
