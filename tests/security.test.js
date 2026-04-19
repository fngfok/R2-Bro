const request = require('supertest');
const app = require('../app');

describe('Security and Validation', () => {
  test('should have security headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('0');
    expect(response.headers['strict-transport-security']).toContain('max-age=31536000');
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
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

    response = await request(app)
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

  test('should accept valid ally code with spaces', async () => {
    const response = await request(app)
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

  test('should reject excessively long ally code', async () => {
    const longAllyCode = '1'.repeat(21);
    const response = await request(app)
      .post('/player-search')
      .send(`allyCode=${longAllyCode}`);
    expect(response.status).toBe(400);
  });
});
