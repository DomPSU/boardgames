const express = require("express");
const boardgamesController = require("../controllers/boardgamesController");
const { isAuth } = require("../middlewares/authMiddleware");
const {
  setBoardgameFromReqParam,
  isUserInDB,
  areAllReqKeysValid,
  isReqBodyValid,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
} = require("../middlewares/boardgamesMiddleware");

const boardgamesRouter = express.Router();
boardgamesRouter.use(isAuth, isUserInDB);

// get
boardgamesRouter.get(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.show
);

boardgamesRouter.get("/", boardgamesController.index);

// post
boardgamesRouter.post(
  "/",
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesController.create
);

// delete
boardgamesRouter.delete(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.destroy
);

// put
boardgamesRouter.put(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesController.update
);

// patch
boardgamesRouter.patch(
  "/:id",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  boardgamesController.update
);

module.exports = boardgamesRouter;
