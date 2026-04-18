const request = require('supertest');
const app = require('../app');

describe('Performance - Static Assets Caching', () => {
  test('should have Cache-Control header with max-age for static assets', async () => {
    const response = await request(app).get('/css/style.css');
    expect(response.headers['cache-control']).toMatch(/max-age=\d+/);
    const maxAgeMatch = response.headers['cache-control'].match(/max-age=(\d+)/);
    const maxAge = parseInt(maxAgeMatch[1], 10);
    expect(maxAge).toBeGreaterThan(0);
  });
});
