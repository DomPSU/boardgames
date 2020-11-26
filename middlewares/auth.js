const google = require("../config/google");
const createError = require("http-errors");
const userModel = require("../models/usersModel");

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
    const user = await userModel.getUserFromSub(sub);
    res.locals.userID = user.id;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  isAuth,
};
