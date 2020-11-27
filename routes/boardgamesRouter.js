const express = require("express");
const boardgamesService = require("../services/boardgamesService");
const boardgamesRouter = express.Router();
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

// get
boardgamesRouter.get(
  "/:id",
  isAuth,
  isUserInDB,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesService.show
);
boardgamesRouter.get("/", isAuth, boardgamesService.index);

// post
boardgamesRouter.post(
  "/",
  isAuth,
  isUserInDB,
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesService.create
);

// delete
boardgamesRouter.delete(
  "/:id",
  isAuth,
  isUserInDB,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesService.destroy
);

// put
boardgamesRouter.put(
  "/:id",
  isAuth,
  isUserInDB,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesService.updateAll
);

// patch
boardgamesRouter.patch(
  "/:id",
  isAuth,
  isUserInDB,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  boardgamesService.updatePartial
);

module.exports = boardgamesRouter;
