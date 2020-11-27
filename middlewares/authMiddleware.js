const google = require("../config/google");
const createError = require("http-errors");
const usersModel = require("../models/usersModel");

const isAuth = async (req, res, next) => {
  let idToken = req.headers.authorization;

  if (idToken === undefined) {
    return next(
      createError(401, "Unauthorized. Please send jwt in Authorization header.")
    );
  }

  idToken = idToken.substring(7); // strip off "Bearer " from jwt
  let sub;

  try {
    const ticket = await google.verify(idToken);
    sub = ticket.getPayload().sub;
  } catch (err) {
    return next(createError(401, "Unauthorized. Please send valid jwt."));
  }

  try {
    const user = await usersModel.getUserFromSub(sub);
    res.locals.user = {
      id: user.id,
    };
    next();
  } catch (err) {
    return next(err);
  }
};

const isUserInDB = async (req, res, next) => {
  let user;
  try {
    user = await usersModel.getUserFromID(res.locals.user.id);
  } catch (err) {
    next(err);
  }

  if (user === undefined) {
    return next(
      createError(500, "Valid credentials but user is not stored in database.")
    );
  }

  next();
};

module.exports = {
  isAuth,
  isUserInDB,
};
