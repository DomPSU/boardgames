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

module.exports = {
  getUserFromID,
  getUserFromSub,
  getUsers,
  create,
  destroy,
};
