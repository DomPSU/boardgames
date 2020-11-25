const usersModel = require("../models/usersModel");
const google = require("../config/google");
const { getUrl, removeCursorFromQueryString } = require("../util");

const index = async (req, res, next) => {
  let queryKeys = Object.keys(req.query);
  let queryValues = Object.values(req.query);

  const cursor = queryKeys.includes("cursor") ? req.query.cursor : null;
  removeCursorFromQueryString(queryKeys, queryValues);

  try {
    const dbRes = await usersModel.getUsers(cursor, queryKeys, queryValues);

    let { users, isMoreResults, endCursor } = dbRes;

    if (isMoreResults === true) {
      let nextURL = `${getURL()}users/?cursor=${endCursor}`;

      res.status(200).json({ users: users, next: nextURL });
    } else {
      res.status(200).json({ users: users });
    }
  } catch (e) {
    // TODO 5000 error
    console.log(e);

    next(e);
  }
};

const create = async (req, res, next) => {
  const idToken = req.headers.authorization;

  const ticket = await google.verify(idToken);
  if (!ticket) {
    res.status(403).end();
    return;
  }

  const sub = await google.getUserSub(ticket);

  let user;
  try {
    user = await usersModel.getUserFromSub(sub);
  } catch (e) {
    // TODO 500 error
    return;
  }

  if (user.length === 0) {
    try {
      user = await usersModel.create(sub);
    } catch (e) {
      // TODO 500 error
    }
  }

  res.status(200).json({ sub: user[0].sub });
};

module.exports = {
  index,
  create,
};
