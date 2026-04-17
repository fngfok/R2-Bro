const request = require('supertest');
const app = require('../app');

describe('Performance Optimizations', () => {
  test('static assets should have Cache-Control header with max-age', async () => {
    const response = await request(app).get('/css/style.css');
    expect(response.status).toBe(200);
    // 1 day is 86400 seconds
    expect(response.headers['cache-control']).toContain('max-age=86400');
  });

  test('isValidAllyCode should reject excessively long strings early', async () => {
    // This is indirectly tested by the security test, but we can verify it here
    const longAllyCode = '1'.repeat(21);
    const response = await request(app)
      .post('/player-search')
      .send({ allyCode: longAllyCode });
    expect(response.status).toBe(400);
  });

  test('app should handle URL-encoded form data correctly with extended: false', async () => {
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=123456789');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/player/123456789');
  });
});
