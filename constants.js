const PORT = process.env.PORT || 3000;
const USER = "User";
const BOARDGAME = "Boardgame";
const BOARDGAME_KEYS = ["name", "minPlayers", "maxPlayers"];
const PLAY = "Play";
const PAGINATION_LIMIT = 5;
const STRING_LIMIT = 100;

module.exports = {
  PORT,
  USER,
  BOARDGAME,
  BOARDGAME_KEYS,
  PLAY,
  PAGINATION_LIMIT,
  STRING_LIMIT,
};
