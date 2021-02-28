function PlayerData(name) {
  this.playerId = 0;
  this.name = name;
  this.cards = [];
  this.foundCards = [];
  this.points = 0;
  this.rounds = 0;
  this.historicPoints = 0;
  this.historicRounds = 0;
  this.trapCardUsed = false;
}

module.exports = { PlayerData };
