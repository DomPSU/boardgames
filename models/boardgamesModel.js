const { datastore, addID, isMoreResultsFn } = require("./db");
const {
  BOARDGAME,
  BOARDGAME_KEYS,
  PAGINATION_LIMIT,
  matchingKeys,
  noExtraKeys,
  validInt,
  validString,
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

const create = async (values, userID) => {
  const { name, minPlayers, maxPlayers } = values;

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

const update = async (values) => {
  const { id, name, min_players, max_players, plays } = values;

  const updateBoardgame = {
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: {
      id: values.user.id,
    },
  };

  key = datastore.key([BOARDGAME, parseInt(id, 10)]);
  await datastore.save({ key: key, data: updateBoardgame });

  let entity = await datastore.get(key);
  boardgame = entity.map(addID)[0];

  return boardgame;
};

const validName = (name) => {
  return validString(name);
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
  return matchingKeys(sentKeys, BOARDGAME_KEYS);
};

const validPartialKeys = (sentKeys) => {
  return noExtraKeys(sentKeys, BOARDGAME_KEYS);
};

module.exports = {
  getBoardgameFromID,
  getBoardgames,
  create,
  destroy,
  update,
  validName,
  validMinPlayers,
  validMaxPlayers,
  validMinMaxPlayerCombo,
  validKeys,
  validPartialKeys,
};
