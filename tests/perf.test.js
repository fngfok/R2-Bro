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

describe('Performance - Player Profile Caching', () => {
  const ComlinkStub = require('@swgoh-utils/comlink');
  let getPlayerSpy;

  beforeAll(() => {
    getPlayerSpy = jest.spyOn(ComlinkStub.prototype, 'getPlayer').mockResolvedValue({
      name: 'Test Player',
      allyCode: '123456789',
      level: 85,
      rosterUnit: [],
      profileStat: [{ nameKey: 'stat_power', index: 1, value: 1000000 }]
    });
  });

  afterAll(() => {
    getPlayerSpy.mockRestore();
  });

  test('should have Cache-Control header for player profiles', async () => {
    const response = await request(app).get('/player/123456789');
    expect(response.headers['cache-control']).toContain('public');
    expect(response.headers['cache-control']).toContain('max-age=300');
  });
});
