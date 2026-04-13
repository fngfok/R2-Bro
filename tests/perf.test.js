const request = require('supertest');
const app = require('../app');

describe('Performance Optimizations', () => {
  test('should have Cache-Control header for static assets in production', async () => {
    // This test expects NODE_ENV=production to be set when running tests
    if (process.env.NODE_ENV === 'production') {
      const response = await request(app).get('/css/style.css');
      expect(response.headers['cache-control']).toContain('max-age=86400');
    } else {
      console.warn('Skipping Cache-Control test because NODE_ENV is not production');
    }
  });
});
