const express = require("express");
const playsController = require("../controllers/playsController");
const { isAuth } = require("../middlewares/authMiddleware");
// TODO middleware

const playsRouter = express.Router();
playsRouter.use(isAuth);

// get

// post

// delete

// put

module.exports = playsRouter;
