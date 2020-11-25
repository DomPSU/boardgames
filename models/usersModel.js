const { datastore, fromDatastore, isMoreResultsFn } = require("./db");
const util = require("../util");

const getUserFromID = async (id) => {
  const key = datastore.key([util.USER, parseInt(id, 10)]);

  return datastore.get(key);
};

const getUserFromSub = async (sub) => {
  let q = datastore.createQuery(util.USER);

  q.filter("sub", "=", sub);

  const entities = await datastore.runQuery(q);
  return entities[0];
};

const getUsers = async (cursor, queryKeys, queryValues) => {
  let q = datastore.createQuery(util.USER).limit(util.PAGINATION_LIMIT);

  for (let i = 0; i < queryKeys.length; i += 1) {
    q.filter(queryKeys[i], "=", queryValues[i]);
  }

  if (cursor !== null) {
    q = q.start(cursor);
  }

  const entities = await datastore.runQuery(q);
  const { moreResults, endCursor } = entities[1];
  const isMoreResults = isMoreResultsFn(moreResults);

  return { users: entities[0].map(fromDatastore), isMoreResults, endCursor };
};

const create = async (sub) => {
  let key = datastore.key(util.USER);

  const newUser = { sub: sub, boardgames: [] };

  return datastore.save({ key: key, data: newUser }).then(() => {
    return { key, newUser };
  });
};

const destroy = async (id) => {
  const key = datastore.key([util.USER, parseInt(id, 10)]);

  return datastore.delete(key);
};

module.exports = {
  getUserFromID,
  getUserFromSub,
  getUsers,
  create,
  destroy,
};
