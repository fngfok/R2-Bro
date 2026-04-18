const Player = require('../models/player');

describe('Player Class', () => {
  /**
   * Generates a mock player response object.
   * @returns {Object} A mock SWGOH-COMLINK player response.
   */
  const generateMockPlayerData = () => {
    return {
      name: 'Darth Vader',
      level: 85,
      allyCode: '123456789',
      playerId: 'abc-123-def',
      rosterUnit: [
        {
          id: 'unit_vader',
          definitionId: 'VADER:VADER',
          currentRarity: 7,
          currentLevel: 85
        }
      ],
      profileStat: [
        { nameKey: 'stat_power', index: 1, value: 5000000 },
        { nameKey: 'stat_something_else', index: 2, value: 100 }
      ],
      guildId: 'guild-789',
      guildName: 'The Empire',
      pvpProfile: [
        {
          rank: 1,
          eventId: 'squad_arena'
        }
      ]
    };
  };

  test('should correctly instantiate a Player object from JSON data', () => {
    const mockData = generateMockPlayerData();
    const player = new Player(mockData);

    expect(player.name).toBe(mockData.name);
    expect(player.level).toBe(mockData.level);
    expect(player.allyCode).toBe(mockData.allyCode);
    expect(player.playerId).toBe(mockData.playerId);
  });

  test('should correctly return the roster unit array', () => {
    const mockData = generateMockPlayerData();
    const player = new Player(mockData);
    const roster = player.getRoster();

    expect(Array.isArray(roster)).toBe(true);
    expect(roster.length).toBe(1);
    expect(roster[0].id).toBe(mockData.rosterUnit[0].id);
  });

  test('should return an empty array if rosterUnit is missing', () => {
    const player = new Player({ name: 'Solo' });
    expect(player.getRoster()).toEqual([]);
  });

  test('should correctly return guild information', () => {
    const mockData = generateMockPlayerData();
    const player = new Player(mockData);
    const guildInfo = player.getGuildInfo();

    expect(guildInfo.guildId).toBe(mockData.guildId);
    expect(guildInfo.guildName).toBe(mockData.guildName);
  });

  test('should return empty guild information if fields are missing', () => {
    const player = new Player({ name: 'Lando' });
    const guildInfo = player.getGuildInfo();

    expect(guildInfo.guildId).toBe('');
    expect(guildInfo.guildName).toBe('');
  });

  test('should correctly calculate Galactic Power from profileStat', () => {
    const mockData = generateMockPlayerData();
    const player = new Player(mockData);
    const gp = player.getGalacticPower();

    expect(gp).toBe(5000000);
  });

  test('should return 0 GP if profileStat is missing', () => {
    const player = new Player({ name: 'Chewie' });
    expect(player.getGalacticPower()).toBe(0);
  });

  test('should throw an error if data is not an object', () => {
    expect(() => new Player(null)).toThrow('Player data must be an object');
    expect(() => new Player('not an object')).toThrow('Player data must be an object');
  });
});
