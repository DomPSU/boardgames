const PORT = process.env.PORT || 3000;
const USER = "User";
const BOARDGAME = "Boardgame";
const BOARDGAME_KEYS = ["name", "minPlayers", "maxPlayers"];
const PLAY = "Play";
const PLAY_KEYS = ["dateStarted", "numOfPlayers", "winner"]
const PAGINATION_LIMIT = 5;
const STRING_LIMIT = 100;

module.exports = {
  PORT,
  USER,
  BOARDGAME,
  BOARDGAME_KEYS,
  PLAY,
  PLAY_KEYS,
  PAGINATION_LIMIT,
  STRING_LIMIT,
};
