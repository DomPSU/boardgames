const usersModel = require("../models/usersModel");
const google = require("../config/google");
const { getURL, removeCursorFromQueryString } = require("../util");
const createError = require("http-errors");

const show = async (req, res, next) => {
  let user;
  try {
    user = await usersModel.getUserFromID(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (user[0] === undefined) {
    return next(createError(404, "No user with this user_id exists"));
  }

  res.status(200).json({
    id: req.params.id,
    usb: user[0].sub,
    self: `${getURL()}users/${req.params.id}`,
  });
};

const index = async (req, res, next) => {
  let queryKeys = Object.keys(req.query);
  let queryValues = Object.values(req.query);

  const cursor = queryKeys.includes("cursor") ? req.query.cursor : null;
  removeCursorFromQueryString(queryKeys, queryValues);

  let dbRes;
  try {
    dbRes = await usersModel.getUsers(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  let { users, isMoreResults, endCursor } = dbRes;

  users.forEach((user) => {
    user.self = `${getURL()}users/${user.id}`;
  });

  if (isMoreResults === true) {
    let nextURL = `${getURL()}users/?cursor=${endCursor}`;
    res.status(200).json({ users: users, next: nextURL });
  } else {
    res.status(200).json({ users: users });
  }
};

const create = async (req, res, next) => {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return next(createError(401, "Unauthorized"));
  }

  const ticket = await google.verify(idToken);
  if (!ticket) {
    return next(createError(403, "Forbidden"));
  }

  const sub = await google.getUserSub(ticket);

  let user;
  try {
    user = await usersModel.getUserFromSub(sub);
  } catch (err) {
    return next(err);
  }

  if (user.length === 0) {
    try {
      user = await usersModel.create(sub);
    } catch (err) {
      return next(err);
    }
  }

  res.status(200).json({ sub: user[0].sub });
};

const destroy = async (req, res, next) => {
  let boardgames;

  // TODO check if user exists and get boardgames

  // TODO destroy board games for this user

  let dbRes;
  try {
    dbRes = await usersModel.destroy(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (dbRes[0].indexUpdates === 0) {
    return next(createError(404, "No user with this user_id exists"));
  }

  res.status(204).end();
};

module.exports = {
  show,
  index,
  create,
  destroy,
};
