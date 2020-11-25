const usersModel = require("../models/usersModel");
const google = require("../config/google");
const util = require("../util");

const index = async (req, res, next) => {};

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
