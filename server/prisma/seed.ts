// Seed Script - Populate database with initial data
// This script creates default admin users and test data
// Run: npm run db:seed

import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/passwords';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@innobiz.et' },
    update: {},
    create: {
      email: 'admin@innobiz.et',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test reviewer
  const reviewerPassword = await hashPassword('Reviewer@123');
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@innobiz.et' },
    update: {},
    create: {
      email: 'reviewer@innobiz.et',
      passwordHash: reviewerPassword,
      role: Role.REVIEWER,
      isActive: true,
    },
  });

  console.log('✅ Created reviewer user:', reviewer.email);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
