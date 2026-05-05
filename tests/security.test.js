const request = require('supertest');

describe('Security and Validation', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../app');
  });

  test('should have security headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('0');
    expect(response.headers['strict-transport-security']).toContain('max-age=31536000');
    expect(response.headers['strict-transport-security']).toContain('includeSubDomains');
    expect(response.headers['strict-transport-security']).toContain('preload');
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(response.headers['permissions-policy']).toBe('camera=(), microphone=(), geolocation=()');
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    expect(response.headers['content-security-policy']).toContain("style-src 'self'");
    expect(response.headers['content-security-policy']).not.toContain("'unsafe-inline'");
    expect(response.headers['content-security-policy']).toContain("base-uri 'self'");
    expect(response.headers['content-security-policy']).toContain("form-action 'self'");
    expect(response.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response.headers['content-security-policy']).toContain("upgrade-insecure-requests");
  });

  test('should reject invalid ally code in search', async () => {
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=invalid');
    expect(response.status).toBe(400);
    expect(response.text).toContain('Invalid Ally Code');
  });

  test('should reject ally code with too many digits', async () => {
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=1234567890');
    expect(response.status).toBe(400);
  });

  test('should reject excessively long ally code (DoS prevention)', async () => {
    const longAllyCode = '1'.repeat(21);
    const response = await request(app)
      .post('/player-search')
      .send(`allyCode=${longAllyCode}`);
    expect(response.status).toBe(400);
    expect(response.text).toContain('Invalid Ally Code');
  });

  test('should accept valid ally code with dashes or spaces', async () => {
    let response = await request(app)
      .post('/player-search')
      .send('allyCode=123-456-789');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/player/123456789');

    // Resetting app for next check in same test to avoid rate limit
    jest.resetModules();
    const app2 = require('../app');
    response = await request(app2)
      .post('/player-search')
      .send('allyCode=123 456 789');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/player/123456789');
  });

  test('should accept valid ally code with spaces', async () => {
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=123 456 789');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/player/123456789');
  });

  test('should reject excessively long ally code', async () => {
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=123456789012345678901');
    expect(response.status).toBe(400);
  });

  test('should reject invalid ally code in direct URL', async () => {
    const response = await request(app).get('/player/123-abc-456');
    expect(response.status).toBe(400);
  });

  test('should reject excessively long ally code again', async () => {
    const longAllyCode = '1'.repeat(21);
    const response = await request(app)
      .post('/player-search')
      .send(`allyCode=${longAllyCode}`);
    expect(response.status).toBe(400);
  });

  test('should rate limit requests', async () => {
    // Make 10 requests (the limit)
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/player-search')
        .send('allyCode=123456789');
    }

    // The 11th request should be rate limited
    const response = await request(app)
      .post('/player-search')
      .send('allyCode=123456789');

    expect(response.status).toBe(429);
    expect(response.text).toContain('Too many requests');
  });
});
