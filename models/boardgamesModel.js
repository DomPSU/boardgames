const { datastore, addID, isMoreResultsFn } = require("./db");
const {
  BOARDGAME,
  PAGINATION_LIMIT,
  matchingKeys,
  validInt,
} = require("../util");

const getBoardgameFromID = async (id) => {
  const key = datastore.key([BOARDGAME, parseInt(id, 10)]);

  let entity = await datastore.get(key);
  const boardgame = entity.map(addID)[0];

  return boardgame;
};

const getBoardgames = async (cursor, queryKeys, queryValues) => {
  let q = datastore.createQuery(BOARDGAME).limit(PAGINATION_LIMIT);

  for (let i = 0; i < queryKeys.length; i += 1) {
    q.filter(queryKeys[i], "=", queryValues[i]);
  }

  if (cursor !== null) {
    q = q.start(cursor);
  }

  const entities = await datastore.runQuery(q);
  const { moreResults, endCursor } = entities[1];
  const isMoreResults = isMoreResultsFn(moreResults);

  return { boardgames: entities[0].map(addID), isMoreResults, endCursor };
};

const create = async (reqBody, userID) => {
  const { name, minPlayers, maxPlayers } = reqBody;

  let key = datastore.key(BOARDGAME);

  const newBoardgame = {
    name: name,
    min_players: minPlayers,
    max_players: maxPlayers,
    plays: [],
    user: {
      id: userID,
    },
  };

  await datastore.save({ key: key, data: newBoardgame });

  let entity = await datastore.get(key);
  boardgame = entity.map(addID)[0];

  return boardgame;
};

const destroy = async (id) => {
  const key = datastore.key([BOARDGAME, parseInt(id, 10)]);

  return datastore.delete(key);
};

const validName = (name) => {
  // cannot be null, undefined, NaN, empty string, 0 or false
  if (!name) {
    return false;
  }

  if (typeof name !== "string") {
    return false;
  }

  if (name.length > 100) {
    return false;
  }

  return true;
};

const validMinPlayers = (minPlayer) => {
  if (!validInt(minPlayer)) {
    return false;
  }

  if (minPlayer < 1) {
    return false;
  }

  return true;
};

const validMaxPlayers = (maxPlayer) => {
  if (!validInt(maxPlayer)) {
    return false;
  }

  if (maxPlayer > 1000) {
    return false;
  }

  return true;
};

const validMinMaxPlayerCombo = (minPlayer, maxPlayer) => {
  if (minPlayer >= maxPlayer) {
    return false;
  }

  return true;
};

const validKeys = (sentKeys) => {
  requiredKeys = ["name", "minPlayers", "maxPlayers"];

  return matchingKeys(sentKeys, requiredKeys);
};

const uniq = async () => {};

module.exports = {
  getBoardgameFromID,
  getBoardgames,
  create,
  destroy,
  validName,
  validMinPlayers,
  validMaxPlayers,
  validMinMaxPlayerCombo,
  validKeys,
  uniq,
};
