class Unit{
    constructor(data) {
        this.id = data.id;
        this.definitionId = data.definitionId;
        this.currentRarity = data.currentRarity;
        this.currentLevel = data.currentLevel;
        this.currentXp = data.currentXp;
        this.promotionRecipeReferenceId = data.promotionRecipeReferenceId;
        this.currentTier = data.currentTier;
        this.relic=new Relic(data.relic);
    }

}

class Relic {
    constructor(data) {
        Object.assign(this, data);
    }
}   

module.exports = Unit;