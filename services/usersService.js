const usersModel = require("../models/usersModel");
const google = require("../config/google");
const { getURL, removeCursorFromQueryString } = require("../util");
const createError = require("http-errors");

const show = async (req, res, next) => {
  let user;
  try {
    user = await usersModel.getUserFromID(req.params.id);
  } catch (err) {
    return next(createError(404, "No user with this user_id exists."));
  }

  res.status(200).json({
    id: user.id,
    sub: user.sub,
    self: `${getURL()}users/${user.id}`,
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

  const { isMoreResults, endCursor } = dbRes;
  let { users } = dbRes;

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
    return next(createError(401, "Unauthorized."));
  }

  let ticket;
  try {
    ticket = await google.verify(idToken);
  } catch (err) {
    return next(createError(403, "Forbidden."));
  }

  const sub = google.getUserSub(ticket);

  let user;
  try {
    user = await usersModel.getUserFromSub(sub);
  } catch (err) {
    return next(err);
  }

  if (user === undefined) {
    try {
      user = await usersModel.create(sub);
    } catch (err) {
      return next(err);
    }
  }

  res.status(200).json({ id: user.id });
};

// TODO only allow this in development
const destroy = async (req, res, next) => {
  let dbRes;
  try {
    dbRes = await usersModel.destroy(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (dbRes.indexUpdates === 0) {
    return next(createError(404, "No user with this user_id exists."));
  }

  res.status(204).end();
};

module.exports = {
  show,
  index,
  create,
  destroy,
};
