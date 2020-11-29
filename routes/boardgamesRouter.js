const express = require("express");
const boardgamesController = require("../controllers/boardgamesController");
const { methodNotAllowed } = require("../middlewares/generalMiddleware");
const { isAuth, isUserInDB } = require("../middlewares/authMiddleware");
const {
  setBoardgameFromReqParam,
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
  "/:boardgameID",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.show
);

boardgamesRouter.get("/", boardgamesController.index);

// post
boardgamesRouter.post("/:boardgameID", methodNotAllowed);

boardgamesRouter.post(
  "/",
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesController.create
);

// delete
boardgamesRouter.delete(
  "/:boardgameID",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.destroy
);

boardgamesRouter.delete("/", methodNotAllowed);

// put
boardgamesRouter.put(
  "/:boardgameID",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  areAllReqKeysValid,
  isReqBodyValid,
  boardgamesController.update
);

boardgamesRouter.put("/", methodNotAllowed);

// patch
boardgamesRouter.patch(
  "/:boardgameID",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  boardgamesController.update
);

boardgamesRouter.patch("/", methodNotAllowed);

module.exports = boardgamesRouter;
