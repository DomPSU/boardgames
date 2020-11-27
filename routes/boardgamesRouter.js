const express = require("express");
const boardgamesService = require("../services/boardgamesService");
const { isAuth } = require("../middlewares/auth");
const {
  setBoardgameFromReqParam,
  isUserInDB,
  areAllReqKeysValid,
  isReqBodyValid,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
} = require("../middlewares/boardgames");

const boardgamesRouter = express.Router();
boardgamesRouter.use(isAuth, isUserInDB);

// get
boardgamesRouter.get(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesService.show
);

boardgamesRouter.get("/", boardgamesService.index);

// post
boardgamesRouter.post(
  "/",
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesService.create
);

// delete
boardgamesRouter.delete(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesService.destroy
);

// put
boardgamesRouter.put(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesService.update
);

// patch
boardgamesRouter.patch(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  boardgamesService.update
);

module.exports = boardgamesRouter;
