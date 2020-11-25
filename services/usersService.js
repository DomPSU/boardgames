const usersModel = require("../models/usersModel");
const google = require("../config/google");
const util = require("../util");

const index = async (req, res, next) => {};

const create = async (req, res, next) => {
  console.log("Creating a user");

  let idToken = req.headers.authorization;

  console.log(req.headers);

  // get validated user from idToken
  const verify = async () => {
    const ticket = await google.verify(idToken);
    const insertCredentials = await google.getUserSub(ticket);

    console.log("INSERT CREDENTIALS");
    console.log(insertCredentials);

    // insert new validated user
    try {
      // TODO insert user
    } catch (e) {
      console.log("error");
      next(e);
    }
  };
  verify().catch(console.error);

  console.log("return 200");
  res.status(200).end();
};

module.exports = {
  index,
  create,
};
