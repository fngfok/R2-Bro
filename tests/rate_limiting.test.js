const request = require('supertest');

describe('Rate Limiting', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../app');
  });

  test('should return 429 after 10 requests from the same IP', async () => {
    // 10 requests should pass
    for (let i = 0; i < 10; i++) {
      const response = await request(app).get('/');
      // Root route does not have rate limiter, so it should be 200
      expect(response.status).toBe(200);
    }

    // Now test a rate-limited route
    for (let i = 0; i < 10; i++) {
        const response = await request(app).post('/player-search').send('allyCode=123456789');
        expect(response.status).toBe(302);
    }

    // The 11th request to a rate-limited route should fail
    const limitedResponse = await request(app).post('/player-search').send('allyCode=123456789');
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.text).toContain('Too many requests');
  });
});
