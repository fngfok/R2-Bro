const request = require('supertest');
const ComlinkStub = require('@swgoh-utils/comlink');

// Mock ComlinkStub prototype before requiring app
const getPlayerMock = jest.fn();
ComlinkStub.prototype.getPlayer = getPlayerMock;

const app = require('../app');

describe('Request Coalescing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should coalesce multiple concurrent requests for the same ally code', async () => {
    const allyCode = '111222333';
    const mockPlayerData = { name: 'Test Player', allyCode: allyCode, profileStat: [] };

    // Simulate a slow API call
    getPlayerMock.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockPlayerData), 100);
      });
    });

    // Fire 5 concurrent requests
    const requests = Array(5).fill().map(() => request(app).get(`/player/${allyCode}`));

    const responses = await Promise.all(requests);

    // Verify all responses are successful
    responses.forEach(res => {
      expect(res.status).toBe(200);
      expect(res.text).toContain('Test Player');
    });

    // CRITICAL: Verify that getPlayer was only called ONCE
    expect(getPlayerMock).toHaveBeenCalledTimes(1);
  });
});
