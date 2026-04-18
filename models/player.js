/**
 * Represents a player in Star Wars: Galaxy of Heroes (SWGOH).
 * This class stores all player information returned by the SWGOH-COMLINK API.
 */
class Player {
  /**
   * Creates a new Player instance.
   * @param {Object} data - The JSON response from the SWGOH-COMLINK API.
   */
  constructor(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Player data must be an object');
    }
    // Dynamic assignment of all attributes for flexibility
    Object.assign(this, data);
  }

  /**
   * Returns the player's roster units.
   * @returns {Array} List of roster units.
   */
  getRoster() {
    return this.rosterUnit || [];
  }

  /**
   * Returns basic guild information.
   * @returns {Object} Object containing guildId and guildName.
   */
  getGuildInfo() {
    return {
      guildId: this.guildId || '',
      guildName: this.guildName || ''
    };
  }

  /**
   * Calculates the player's total Galactic Power (GP) from profileStat.
   * In SWGOH profileStat, index 1 usually corresponds to total GP.
   * @returns {number} Total Galactic Power.
   */
  getGalacticPower() {
    if (!this.profileStat || !Array.isArray(this.profileStat)) {
      return 0;
    }
    // Search for the stat with nameKey "Galactic Power" or use the known index (1)
    // Most reliable is searching by nameKey "stat_power" or similar if known,
    // but the issue description shows "nameKey": "string".
    // We'll try to find it by nameKey if possible, otherwise fallback to index 1 or sum.
    const gpStat = this.profileStat.find(stat => stat.nameKey === 'stat_power' || stat.index === 1);
    return gpStat ? parseInt(gpStat.value, 10) : 0;
  }
}

module.exports = Player;
