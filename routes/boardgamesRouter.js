const express = require("express");
const boardgamesService = require("../services/boardgamesService");
const boardgamesRouter = express.Router();
const { isAuth } = require("../middlewares/auth");

// get
boardgamesRouter.get("/:id", isAuth, boardgamesService.show);
boardgamesRouter.get("/", isAuth, boardgamesService.index);

// post
boardgamesRouter.post("/", isAuth, boardgamesService.create);

// delete
boardgamesRouter.delete("/:id", isAuth, boardgamesService.destroy);

// put
boardgamesRouter.put("/:id", isAuth, boardgamesService.updateAll);

// patch
boardgamesRouter.patch("/:id", isAuth, boardgamesService.updatePartial);

module.exports = boardgamesRouter;
