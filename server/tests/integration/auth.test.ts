import request from 'supertest';
import app from '../../src/app';

describe('Auth Integration Tests', () => {
  it('should validate registration input and return 400', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'short',
        role: 'INVALID_ROLE',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should require authentication for protected user profile route', async () => {
    const response = await request(app)
      .get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
