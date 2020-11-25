const google = require("../config/google");

const isAuth = async (req, res, next) => {
  console.log("is auth");

  let idToken = req.headers.authorization;

  if (idToken === undefined) {
    // send 401 unauthorized status if user is not logged in
    console.log("401 unauthorized.");
    res.status(401).end();
    return;
  }

  idToken = idToken.substring(7); // strip off "Bearer "

  // get validated user from id token
  try {
    const ticket = await google.verify(idToken);
    res.locals.sub = ticket.getPayload().sub;
    next();
  } catch (e) {
    // send 401 unauthorized status if user is not logged in
    console.log("401 unauthorized.");
    res.status(401).end();
  }
};

// set Auth based on jwt
const setAuth = async (req, res, next) => {
  console.log("set Auth");

  let idToken = req.headers.authorization;
  if (idToken === undefined) {
    res.locals.sub = null;
    return next();
  }

  idToken = idToken.substring(7); // strip off "Bearer "

  try {
    // set user to sub from jwt
    const ticket = await google.verify(idToken);
    res.locals.sub = ticket.getPayload().sub;
    return next();
  } catch (e) {
    // set user to null
    res.locals.sub = null;
    return next();
  }
};

module.exports = {
  isAuth,
  setAuth,
};
