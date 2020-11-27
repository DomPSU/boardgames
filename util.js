const isNumber = require("is-number");

const getIndexFromObjArray = (array, itemID) => {
  index = array
    .map(function (item) {
      return item.id;
    })
    .indexOf(itemID)
  
  return index;
}

const matchingKeys = (sentKeys, requiredKeys) => {
  let validKeys = true;

  if (sentKeys.length !== requiredKeys.length) {
    return false;
  }

  requiredKeys.forEach((requiredkey) => {
    if (sentKeys.indexOf(requiredkey) === -1) {
      validKeys = false;
    }
  });

  return validKeys;
};

const noExtraKeys = (sentKeys, validKeys) => {
  let validPartialKeys = true;

  sentKeys.forEach((sentKey) => {
    if (validKeys.indexOf(sentKey) === -1) {
      validPartialKeys = false;
    }
  });

  return validPartialKeys;
};

const validInt = (int) => {
  // cannot be null, undefined, NaN, empty string, 0 or false
  if (!int) {
    return false;
  }

  // number in string will pass e.g. "1"
  if (!isNumber(int)) {
    return false;
  }

  // cannot be a string or a float
  if (int !== parseInt(int, 10)) {
    return false;
  }

  return true;
};

const validString = (string) => {
  // cannot be null, undefined, NaN, empty string, 0 or false
  if (!string) {
    return false;
  }

  if (typeof string !== "string") {
    return false;
  }

  if (string.length > 100) {
    // TODO make 100 a constant
    return false;
  }

  return true;
};

// TODO env var?
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
const BOARDGAME_KEYS = ["name", "minPlayers", "maxPlayers"];
const PLAY = "Play";
const PAGINATION_LIMIT = 5;

module.exports = {
  getIndexFromObjArray,
  matchingKeys,
  noExtraKeys,
  validInt,
  validString,
  getURL,
  removeCursorFromQueryString,
  PORT,
  USER,
  BOARDGAME,
  BOARDGAME_KEYS,
  PLAY,
  PAGINATION_LIMIT,
};
