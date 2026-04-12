const request = require('supertest');
const app = require('../app');

describe('Performance Optimizations', () => {
  test('should not have X-Powered-By header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  describe('Production Environment', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalEnv;
    });

    test('should have Cache-Control with max-age for static assets', async () => {
      // Need to re-require app to pick up the production staticOptions
      jest.resetModules();
      const productionApp = require('../app');
      const response = await request(productionApp).get('/css/style.css');
      expect(response.headers['cache-control']).toBe('public, max-age=86400');
    });

    test('should have view cache enabled', () => {
       jest.resetModules();
       const productionApp = require('../app');
       expect(productionApp.get('view cache')).toBe(true);
    });
  });

  describe('Development Environment', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalEnv;
    });

    test('should have max-age=0 for static assets in development', async () => {
      jest.resetModules();
      const devApp = require('../app');
      const response = await request(devApp).get('/css/style.css');
      expect(response.headers['cache-control']).toBe('public, max-age=0');
    });

    test('should not have view cache enabled in development', () => {
       jest.resetModules();
       const devApp = require('../app');
       expect(devApp.get('view cache')).toBeUndefined();
    });
  });
});
