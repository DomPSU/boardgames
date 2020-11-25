const usersModel = require("../models/usersModel");
const google = require("../config/google");
const { getURL, removeCursorFromQueryString } = require("../util");

const show = async (req, res, next) => {
  try {
    const user = await usersModel.getUserFromID(req.params.id);

    if (user[0] === undefined) {
      throw new Error();
    }

    res.status(200).json({
      id: req.params.id,
      usb: user[0].sub,
      self: `${getURL()}users/${req.params.id}`,
    });
  } catch (e) {
    console.log(e);

    res.status(404).json({ Error: "No user with this user_id exists" });

    return;
  }
};

const index = async (req, res, next) => {
  let queryKeys = Object.keys(req.query);
  let queryValues = Object.values(req.query);

  const cursor = queryKeys.includes("cursor") ? req.query.cursor : null;
  removeCursorFromQueryString(queryKeys, queryValues);

  try {
    const dbRes = await usersModel.getUsers(cursor, queryKeys, queryValues);

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

  // TODO add self link to users

  res.status(200).json({ sub: user[0].sub });
};

const destroy = async (req, res, next) => {
  let boardgames;

  // TODO check if user exists and get boardgames

  // TODO destroy board games for this user

  try {
    const dbRes = await usersModel.destroy(req.params.id);

    if (dbRes[0].indexUpdates === 0) {
      throw new Error();
    }

    res.status(204).end();
    return;
  } catch (e) {
    console.log(e);

    res.status(404).json({ Error: "No user with this user_id exists" });
    return;
  }
};

module.exports = {
  show,
  index,
  create,
  destroy,
};
