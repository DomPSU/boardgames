const express = require("express");
const boardgamesService = require("../services/boardgamesService");
const boardgamesRouter = express.Router();
const { isAuth } = require("../middlewares/auth");

// get
boardgamesRouter.get("/:id", boardgamesService.show);
boardgamesRouter.get("/", boardgamesService.index);

// post
boardgamesRouter.post("/", isAuth, boardgamesService.create);

// delete
boardgamesRouter.delete("/:id", boardgamesService.destroy);

module.exports = boardgamesRouter;
