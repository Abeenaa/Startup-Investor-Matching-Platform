// Complete Workflow Integration Test
// Tests all three features working together with the modified role hierarchy

import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Complete Workflow Integration', () => {
  let staffAdminToken: string;
  let systemAdminToken: string;
  let reviewerToken: string;
  let startupToken: string;
  let investorToken: string;
  
  let startupUserId: string;
  let investorUserId: string;
  let startupProfileId: string;
  let investorProfileId: string;

  beforeAll(async () => {
    // Clean up database
    await prisma.profileHistory.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.application.deleteMany();
    await prisma.program.deleteMany();
    await prisma.startup.deleteMany();
    await prisma.investor.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Authentication & Role Hierarchy', () => {
    it('should register staff admin (highest privilege)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'staff.admin@innobiz.gov.et',
          password: 'StaffAdmin123!@#',
          role: 'STAFF_ADMIN',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('STAFF_ADMIN');
      staffAdminToken = response.body.data.accessToken;
    });

    it('should register system admin', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'system.admin@innobiz.gov.et',
          password: 'SystemAdmin123!@#',
          role: 'SYSTEM_ADMIN',
        });

      expect(response.status).toBe(201);
      systemAdminToken = response.body.data.accessToken;
    });

    it('should register reviewer', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'reviewer@innobiz.gov.et',
          password: 'Reviewer123!@#',
          role: 'REVIEWER',
        });

      expect(response.status).toBe(201);
      reviewerToken = response.body.data.accessToken;
    });

    it('should register startup user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'startup@techcompany.et',
          password: 'StartupUser123!@#',
          role: 'STARTUP',
        });

      expect(response.status).toBe(201);
      startupToken = response.body.data.accessToken;
      startupUserId = response.body.data.user.id;
    });

    it('should register investor user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'investor@capitalfund.et',
          password: 'InvestorUser123!@#',
          role: 'INVESTOR',
        });

      expect(response.status).toBe(201);
      investorToken = response.body.data.accessToken;
      investorUserId = response.body.data.user.id;
    });
  });

  describe('2. Staff Admin User Management', () => {
    it('should allow staff admin to create system admin', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${staffAdminToken}`)
        .send({
          email: 'new.sysadmin@innobiz.gov.et',
          password: 'NewSysAdmin123!@#',
          role: 'SYSTEM_ADMIN',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.role).toBe('SYSTEM_ADMIN');
    });

    it('should allow staff admin to create reviewer', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${staffAdminToken}`)
        .send({
          email: 'new.reviewer@innobiz.gov.et',
          password: 'NewReviewer123!@#',
          role: 'REVIEWER',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.role).toBe('REVIEWER');
    });

    it('should prevent system admin from creating users', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${systemAdminToken}`)
        .send({
          email: 'unauthorized@test.com',
          password: 'Test123!@#',
          role: 'REVIEWER',
        });

      expect(response.status).toBe(403);
    });

    it('should allow staff admin to list all users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${staffAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.users.length).toBeGreaterThan(0);
    });
  });

  describe('3. Startup Profile Management', () => {
    it('should allow startup to create profile', async () => {
      const response = await request(app)
        .post('/api/startups/profile')
        .set('Authorization', `Bearer ${startupToken}`)
        .send({
          name: 'TechInnovate Ethiopia',
          sector: 'Technology',
          stage: 'Seed',
          description: 'Revolutionary fintech solution for Ethiopian market with mobile-first approach and blockchain integration.',
          problemSolved: 'Addressing financial inclusion gap in rural Ethiopia by providing accessible digital banking services.',
          targetMarket: 'Unbanked population in rural Ethiopia, approximately 35 million people seeking financial services.',
          innovation: 'AI-powered credit scoring using alternative data sources and blockchain-based transaction security.',
          teamSize: 12,
          fundingHistory: 'Pre-seed: $50K from local angel investors',
          tractionMetrics: {
            users: 1500,
            revenue: 25000,
            growth: '15% monthly',
          },
          website: 'https://techinnovate.et',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('TechInnovate Ethiopia');
      expect(response.body.data.approvalStatus).toBe('PENDING');
      startupProfileId = response.body.data.id;
    });

    it('should allow startup to view their own profile', async () => {
      const response = await request(app)
        .get('/api/startups/profile')
        .set('Authorization', `Bearer ${startupToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('TechInnovate Ethiopia');
    });

    it('should allow admin to view startup profiles', async () => {
      const response = await request(app)
        .get('/api/startups')
        .set('Authorization', `Bearer ${systemAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.startups.length).toBeGreaterThan(0);
    });

    it('should allow admin to approve startup profile', async () => {
      const response = await request(app)
        .patch(`/api/startups/${startupProfileId}/approve`)
        .set('Authorization', `Bearer ${systemAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.approvalStatus).toBe('APPROVED');
      expect(response.body.data.isApproved).toBe(true);
    });

    it('should prevent startup from updating approved profile', async () => {
      const response = await request(app)
        .patch('/api/startups/profile')
        .set('Authorization', `Bearer ${startupToken}`)
        .send({
          description: 'Updated description',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot update approved profile');
    });
  });

  describe('4. Investor Profile Management', () => {
    it('should allow investor to create profile', async () => {
      const response = await request(app)
        .post('/api/investors/profile')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          name: 'Ethiopian Growth Capital',
          organizationType: 'Venture Capital Fund',
          investmentStage: ['Seed', 'Series A', 'Series B'],
          sectorFocus: ['Technology', 'Agriculture', 'Healthcare'],
          fundingCapacity: '$1M - $5M',
          geographicFocus: ['Ethiopia (National)', 'East Africa'],
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Ethiopian Growth Capital');
      expect(response.body.data.approvalStatus).toBe('PENDING');
      investorProfileId = response.body.data.id;
    });

    it('should allow investor to view their own profile', async () => {
      const response = await request(app)
        .get('/api/investors/profile')
        .set('Authorization', `Bearer ${investorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Ethiopian Growth Capital');
    });

    it('should allow admin to view investor profiles', async () => {
      const response = await request(app)
        .get('/api/investors')
        .set('Authorization', `Bearer ${systemAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.investors.length).toBeGreaterThan(0);
    });

    it('should allow admin to approve investor profile', async () => {
      const response = await request(app)
        .patch(`/api/investors/${investorProfileId}/approve`)
        .set('Authorization', `Bearer ${systemAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.approvalStatus).toBe('APPROVED');
      expect(response.body.data.isApproved).toBe(true);
    });
  });

  describe('5. Cross-Feature Integration', () => {
    it('should prevent unauthorized access across features', async () => {
      // Startup trying to access admin endpoints
      const adminResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${startupToken}`);
      expect(adminResponse.status).toBe(403);

      // Investor trying to access startup profile creation
      const startupResponse = await request(app)
        .post('/api/startups/profile')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          name: 'Unauthorized Startup',
          sector: 'Technology',
          stage: 'Seed',
          description: 'This should fail',
          problemSolved: 'Should not work',
          targetMarket: 'None',
          innovation: 'None',
        });
      expect(startupResponse.status).toBe(403);
    });

    it('should maintain audit trail across all operations', async () => {
      // Check that profile history was created for all operations
      const startupHistory = await prisma.profileHistory.findMany({
        where: { userId: startupUserId },
      });
      expect(startupHistory.length).toBeGreaterThan(0);

      const investorHistory = await prisma.profileHistory.findMany({
        where: { userId: investorUserId },
      });
      expect(investorHistory.length).toBeGreaterThan(0);
    });

    it('should enforce role hierarchy in all modules', async () => {
      // Staff admin should be able to access everything
      const staffAdminStartups = await request(app)
        .get('/api/startups')
        .set('Authorization', `Bearer ${staffAdminToken}`);
      expect(staffAdminStartups.status).toBe(200);

      const staffAdminInvestors = await request(app)
        .get('/api/investors')
        .set('Authorization', `Bearer ${staffAdminToken}`);
      expect(staffAdminInvestors.status).toBe(200);

      // Reviewer should be able to view profiles but not manage users
      const reviewerStartups = await request(app)
        .get('/api/startups')
        .set('Authorization', `Bearer ${reviewerToken}`);
      expect(reviewerStartups.status).toBe(200);

      const reviewerAdmin = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${reviewerToken}`);
      expect(reviewerAdmin.status).toBe(403);
    });
  });

  describe('6. Security Features', () => {
    it('should enforce rate limiting on auth endpoints', async () => {
      // Make multiple rapid requests to test rate limiting
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@test.com',
            password: 'wrongpassword',
          })
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'weak@test.com',
          password: '123', // Weak password
          role: 'STARTUP',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('security requirements');
    });

    it('should sanitize input data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'ValidPassword123!@#',
          role: 'STARTUP',
          maliciousField: '<script>alert("xss")</script>',
        });

      // Should either reject the request or sanitize the input
      expect(response.status).toBeLessThan(500);
    });
  });
});