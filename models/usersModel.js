const { datastore, addID, isMoreResultsFn } = require("./db");
const { PAGINATION_LIMIT, USER } = require("../util");

const getUserFromID = async (id) => {
  const key = datastore.key([USER, parseInt(id, 10)]);

  let entity = await datastore.get(key);
  const user = entity.map(addID)[0];

  return user;
};

const getUserFromSub = async (sub) => {
  let q = datastore.createQuery(USER);
  q.filter("sub", "=", sub);

  let entities = await datastore.runQuery(q);
  const user = entities[0].map(addID)[0];

  return user;
};

const getUsers = async (cursor, queryKeys, queryValues) => {
  let q = datastore.createQuery(USER).limit(PAGINATION_LIMIT);

  for (let i = 0; i < queryKeys.length; i += 1) {
    q.filter(queryKeys[i], "=", queryValues[i]);
  }

  if (cursor !== null) {
    q = q.start(cursor);
  }

  const entities = await datastore.runQuery(q);
  const { moreResults, endCursor } = entities[1];
  const isMoreResults = isMoreResultsFn(moreResults);

  return { users: entities[0].map(addID), isMoreResults, endCursor };
};

const create = async (sub) => {
  let key = datastore.key(USER);

  const newUser = { sub: sub, boardgames: [] };
  await datastore.save({ key: key, data: newUser });

  let entity = await datastore.get(key);
  user = entity.map(addID)[0];

  return user;
};

const destroy = async (id) => {
  const key = datastore.key([USER, parseInt(id, 10)]);
  const dbRes = await datastore.delete(key);
  return dbRes[0];
};

const update = async (values) => {
  const { id, sub, boardgames } = values;

  const updateUser = {
    id: id,
    sub: sub,
    boardgames: boardgames,
  };

  key = datastore.key([USER, parseInt(id, 10)]);
  await datastore.save({ key: key, data: updateUser });

  let entity = await datastore.get(key);
  user = entity.map(addID)[0];

  return user;
};

const addBoardgame = async (userID, boardgameObj) => {
  const user = await getUserFromID(userID);
  const { sub, id } = user;
  let { boardgames } = user;
  boardgames.push(boardgameObj);

  const updateUser = {
    id: id,
    sub: sub,
    boardgames: boardgames,
  };

  const updatedUser = await update(updateUser);
  return updatedUser;
};

const deleteBoardgame = async (userID, boardgameID) => {
  const user = await getUserFromID(userID);
  const { sub, id } = user;
  let { boardgames } = user;

  // TODO make a util
  const boardgameIndex = boardgames
    .map(function (boardgame) {
      return boardgame.id;
    })
    .indexOf(boardgameID);

  boardgames.splice(boardgameIndex, 1);

  const updateUser = {
    id: id,
    sub: sub,
    boardgames: boardgames,
  };

  const updatedUser = await update(updateUser);
  return updatedUser;
};

const updateBoardgame = async (userID, boardgameObj) => {
  const user = await getUserFromID(userID);
  const { sub, id } = user;
  let { boardgames } = user;

  // TODO make a util
  const boardgameIndex = boardgames
    .map(function (boardgame) {
      return boardgame.id;
    })
    .indexOf(boardgameObj.id);

  boardgames.splice(boardgameIndex, 1, boardgameObj);

  const updateUser = {
    id: id,
    sub: sub,
    boardgames: boardgames,
  };

  const updatedUser = await update(updateUser);
  return updatedUser;
};

module.exports = {
  getUserFromID,
  getUserFromSub,
  getUsers,
  create,
  destroy,
  addBoardgame,
  deleteBoardgame,
  updateBoardgame,
};
