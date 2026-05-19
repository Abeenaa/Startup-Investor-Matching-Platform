// Seed Script — uses raw SQL to avoid Supabase pgBouncer prepared-statement conflicts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/passwords';

const prisma = new PrismaClient();

function esc(s: string) {
  return s.replace(/'/g, "''");
}

async function main() {
  console.log('Starting database seeding...');

  const entries = [
    { email: 'staff.admin@innobiz.et',  role: 'STAFF_ADMIN',  password: 'StaffAdmin@123' },
    { email: 'system.admin@innobiz.et', role: 'SYSTEM_ADMIN',  password: 'SystemAdmin@123' },
    { email: 'reviewer@innobiz.et',     role: 'REVIEWER',     password: 'Reviewer@123456' },
  ];

  for (const entry of entries) {
    const hash = await hashPassword(entry.password);
    const sql = `
      INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at)
      VALUES (gen_random_uuid(), '${esc(entry.email)}', '${hash}', '${entry.role}', true, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `;
    await prisma.$executeRawUnsafe(sql);
    console.log(`Seeded ${entry.role}: ${entry.email}`);
  }

  console.log('Seeding completed.');
}

main().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
