import request from 'supertest';
import app from '../../src/app';

describe('Startups Integration Tests', () => {
  it('should require authentication for startup profile access', async () => {
    const response = await request(app)
      .get('/api/startups/profile');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should require authentication for listing startups', async () => {
    const response = await request(app)
      .get('/api/startups');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
