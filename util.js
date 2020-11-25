// returns false if sentKeys does not contain every requiredKeys. true otherwise
const validKeys = (sentKeys, requiredKeys) => {
  let validKey = true;

  if (sentKeys.length !== requiredKeys.length) {
    return false;
  }

  requiredKeys.forEach((requiredkey) => {
    if (sentKeys.indexOf(requiredkey) === -1) {
      validKey = false;
    }
  });

  return validKey;
};

const getURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/";
  }

  return "https://lupod-portfolio.wl.r.appspot.com/";
};

const removeCursorFromQueryString = (queryKeys, queryValues) => {
  for (let i = 0; i < queryKeys.length; i += 1) {
    if (queryKeys[i] === "cursor") {
      queryKeys.splice(i, i + 1);
      queryValues.splice(i, i + 1);
      return;
    }
  }
  return;
};

const PORT = process.env.PORT || 3000;
const USER = "User";
const BOARDGAME = "Boardgame";
const PLAY = "Play";
const PAGINATION_LIMIT = 5;

module.exports = {
  validKeys,
  getURL,
  removeCursorFromQueryString,
  PORT,
  USER,
  BOARDGAME,
  PLAY,
  PAGINATION_LIMIT,
};
