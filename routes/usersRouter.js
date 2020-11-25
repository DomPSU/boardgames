const express = require("express");
const usersService = require("../services/usersService");
const usersRouter = express.Router();

// get
usersRouter.get("/", usersService.index);

// post
usersRouter.post("/", usersService.create);

module.exports = usersRouter;
