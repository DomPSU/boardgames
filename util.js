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

const PORT = process.env.PORT || 3000;
const USER = "User";
const BOARDGAME = "Boardgame";
const PLAY = "Play";

module.exports = {
  validKeys,
  getURL,
  PORT,
  USER,
  BOARDGAME,
  PLAY,
};
