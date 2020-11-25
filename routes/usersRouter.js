const express = require("express");
const usersService = require("../services/usersService");
const usersRouter = express.Router();

// get
usersRouter.get("/:id", usersService.show)
usersRouter.get("/", usersService.index);

// post
usersRouter.post("/", usersService.create);

// delete
usersRouter.delete("/:id", usersService.destroy);

module.exports = usersRouter;
