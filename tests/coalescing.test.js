const request = require('supertest');
const ComlinkStub = require('@swgoh-utils/comlink');

// Mock ComlinkStub prototype before requiring app
const getPlayerSpy = jest.spyOn(ComlinkStub.prototype, 'getPlayer').mockImplementation(async (allyCode) => {
    // Artificial delay to allow concurrent requests to overlap
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
        name: 'Test Player',
        allyCode: allyCode,
        level: 85,
        rosterUnit: [],
        profileStat: [{ nameKey: 'stat_power', index: 1, value: 1000000 }]
    };
});

const app = require('../app');

describe('Concurrent Request Coalescing', () => {
    afterEach(() => {
        getPlayerSpy.mockClear();
    });

    afterAll(() => {
        getPlayerSpy.mockRestore();
    });

    test('should coalesce multiple concurrent requests for the same ally code into one API call', async () => {
        const allyCode = '999888777';

        // Fire three concurrent requests
        const responses = await Promise.all([
            request(app).get(`/player/${allyCode}`),
            request(app).get(`/player/${allyCode}`),
            request(app).get(`/player/${allyCode}`)
        ]);

        // All should succeed
        responses.forEach(res => {
            expect(res.status).toBe(200);
            expect(res.text).toContain('Test Player');
        });

        // But getPlayer should only have been called ONCE
        expect(getPlayerSpy).toHaveBeenCalledTimes(1);
        expect(getPlayerSpy).toHaveBeenCalledWith(allyCode);
    });

    test('should make a new API call for different ally codes', async () => {
        const allyCode1 = '111222333';
        const allyCode2 = '444555666';

        const responses = await Promise.all([
            request(app).get(`/player/${allyCode1}`),
            request(app).get(`/player/${allyCode2}`)
        ]);

        responses.forEach(res => expect(res.status).toBe(200));

        // Should be called twice, once for each unique ally code
        expect(getPlayerSpy).toHaveBeenCalledTimes(2);
    });
});
