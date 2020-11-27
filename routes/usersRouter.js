const express = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = express.Router();

// get
usersRouter.get("/:id", usersController.show)
usersRouter.get("/", usersController.index);

// post
usersRouter.post("/", usersController.create);

// delete
usersRouter.delete("/:id", usersController.destroy);

module.exports = usersRouter;
