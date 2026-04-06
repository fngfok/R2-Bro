const request = require('supertest');
const app = require('../app');

describe('Performance checks', () => {
  test('static files should have correct cache-control max-age', async () => {
    const res = await request(app).get('/css/style.css');
    // Express translates '1d' to 86400 seconds
    expect(res.headers['cache-control']).toBe('public, max-age=86400');
  });

  test('view cache should be enabled', () => {
    expect(app.get('view cache')).toBe(true);
  });
});
