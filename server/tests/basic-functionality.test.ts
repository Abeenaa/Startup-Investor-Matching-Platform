// Basic Functionality Test
// Simple test to verify core features work

import request from 'supertest';
import app from '../src/app';

describe('Basic Functionality', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Server is running');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route not found');
  });

  it('should require authentication for protected routes', async () => {
    const response = await request(app).get('/api/auth/me');
    
    expect(response.status).toBe(401);
  });

  it('should validate registration input', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123', // Too weak
        role: 'INVALID_ROLE',
      });
    
    expect(response.status).toBe(400);
  });

  it('should enforce rate limiting on auth endpoints', async () => {
    // Make multiple rapid requests
    const promises = Array(6).fill(null).map(() =>
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword',
        })
    );

    const responses = await Promise.all(promises);
    
    // At least one should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});