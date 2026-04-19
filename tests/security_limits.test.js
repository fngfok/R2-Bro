const request = require('supertest');
const app = require('../app');

describe('Security Limits', () => {
  test('should reject a request body larger than 1kb', async () => {
    // Creating a payload slightly larger than 1kb
    const largePayload = 'a'.repeat(2 * 1024);
    const response = await request(app)
      .post('/player-search')
      .send(`allyCode=${largePayload}`);

    // Before fix, this might be 400 (Invalid Ally Code) because default limit is 100kb
    // After fix, this should be 413 (Payload Too Large)
    expect(response.status).toBe(413);
  });

  test('should reject an ally code longer than 20 characters', async () => {
    const longAllyCode = '1'.repeat(21);
    const response = await request(app)
      .post('/player-search')
      .send(`allyCode=${longAllyCode}`);

    // It should return 400 (Invalid Ally Code)
    expect(response.status).toBe(400);
  });
});
