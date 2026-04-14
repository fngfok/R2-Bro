const request = require('supertest');
const app = require('../app');

describe('Performance: Static Asset Caching', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(() => {
    jest.resetModules();
  });

  test('should have Cache-Control header for static assets in production', async () => {
    process.env.NODE_ENV = 'production';
    const appProd = require('../app');
    const response = await request(appProd).get('/css/style.css');

    expect(response.status).toBe(200);
    // max-age=86400 corresponds to 1 day
    expect(response.headers['cache-control']).toBe('public, max-age=86400');
  });

  test('should NOT have long-term Cache-Control for static assets in development', async () => {
    process.env.NODE_ENV = 'development';
    const appDev = require('../app');
    const response = await request(appDev).get('/css/style.css');

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('public, max-age=0');
  });
});
