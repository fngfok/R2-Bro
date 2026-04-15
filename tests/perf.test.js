const request = require('supertest');

describe('Performance: Static Asset Caching', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });

  test('should have max-age=0 for static assets in development', async () => {
    process.env.NODE_ENV = 'development';
    const app = require('../app');
    const res = await request(app).get('/css/style.css');
    expect(res.headers['cache-control']).toBe('public, max-age=0');
  });

  test('should have max-age=1d for static assets in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = require('../app');
    const res = await request(app).get('/css/style.css');
    // '1d' in express.static translates to 86400 seconds
    expect(res.headers['cache-control']).toBe('public, max-age=86400');
  });
});
