// Seed Script - Populate database with initial data
// This script creates default admin users and test data
// Run: npm run db:seed

import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/passwords';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default staff admin user (super admin)
  const staffAdminPassword = await hashPassword('StaffAdmin@123');
  const staffAdmin = await prisma.user.upsert({
    where: { email: 'staff.admin@innobiz.et' },
    update: {},
    create: {
      email: 'staff.admin@innobiz.et',
      passwordHash: staffAdminPassword,
      role: Role.STAFF_ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created staff admin user:', staffAdmin.email);

  // Create default system admin user
  const systemAdminPassword = await hashPassword('SystemAdmin@123');
  const systemAdmin = await prisma.user.upsert({
    where: { email: 'system.admin@innobiz.et' },
    update: {},
    create: {
      email: 'system.admin@innobiz.et',
      passwordHash: systemAdminPassword,
      role: Role.SYSTEM_ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created system admin user:', systemAdmin.email);

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
