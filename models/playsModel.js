const { datastore, addID, isMoreResultsFn } = require("./db");
const { PLAY, PLAY_KEYS, PAGINATION_LIMIT } = require("../constants");
const {
  matchingKeys,
  noExtraKeys,
  validInt,
  validString,
} = require("../utils");

const getPlayFromID = async (id) => {
  const key = datastore.key([PLAY, parseInt(id, 10)]);

  let entity = await datastore.get(key);
  const play = entity.map(addID)[0];

  return play;
};

const getPlays = async (cursor, queryKeys, queryValues) => {
  let q = datastore.createQuery(PLAY).limit(PAGINATION_LIMIT);

  for (let i = 0; i < queryKeys.length; i += 1) {
    q.filter(queryKeys[i], "=", queryValues[i]);
  }

  if (cursor !== null) {
    q = q.start(cursor);
  }

  const entities = await datastore.runQuery(q);
  const { moreResults, endCursor } = entities[1];
  const isMoreResults = isMoreResultsFn(moreResults);

  return { plays: entities[0].map(addID), isMoreResults, endCursor };
};

const create = async (values, userID) => {
  const { dateStarted, numOfPlayers, winner } = values;

  let key = datastore.key(PLAY);

  const newPlay = {
    date_started: dateStarted,
    num_of_players: numOfPlayers,
    winner: winner,
    boardgame: {
      id: null,
      name: null,
    },
    user: {
      id: userID,
    },
  };

  await datastore.save({ key: key, data: newPlay });

  let entity = await datastore.get(key);
  play = entity.map(addID)[0];

  return play;
};

const destroy = async (id) => {
  const key = datastore.key([PLAY, parseInt(id, 10)]);

  return datastore.delete(key);
};

const update = async (values) => {
// TODO
};

const validWinner = (winner) => {
  return validString(winner);
};

const validNumOfPlayers = (numOfPlayers) => {
  if (!validInt(numOfPlayers)) {
    return false;
  }

  if (numOfPlayers < 1 || numOfPlayers > 1000) {
    // TODO make max constant
    return false;
  }

  return true;
};

const validKeys = (sentKeys) => {
  return matchingKeys(sentKeys, PLAY_KEYS);
};

const validPartialKeys = (sentKeys) => {
  return noExtraKeys(sentKeys, PLAY_KEYS);
};

const validDate = () => {
// TODO
}

module.exports = {
  getPlayFromID,
  getPlays,
  create,
  destroy,
  update,
  validDate,
  validNumOfPlayers,
  validWinner,
  validKeys,
  validPartialKeys,
};
