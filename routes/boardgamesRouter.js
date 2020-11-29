const express = require("express");
const boardgamesController = require("../controllers/boardgamesController");
const {
  methodNotAllowed,
  onlyReturnsJSON,
} = require("../middlewares/generalMiddleware");
const { isAuth, isUserInDB } = require("../middlewares/authMiddleware");
const {
  setBoardgameFromReqParam,
  areAllReqKeysValid,
  isReqBodyValid,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isNameAndUserUniq,
} = require("../middlewares/boardgamesMiddleware");

const boardgamesRouter = express.Router();
boardgamesRouter.use(isAuth, isUserInDB);

// get
boardgamesRouter.get(
  "/:boardgameID",
  onlyReturnsJSON,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.show
);

boardgamesRouter.get("/", onlyReturnsJSON, boardgamesController.index);

// post
boardgamesRouter.post("/:boardgameID", onlyReturnsJSON, methodNotAllowed);

boardgamesRouter.post(
  "/",
  onlyReturnsJSON,
  areAllReqKeysValid,
  isReqBodyValid,
  isNameAndUserUniq,
  boardgamesController.create
);

// delete
boardgamesRouter.delete(
  "/:boardgameID",
  setBoardgameFromReqParam,
  isUsersBoardgame,
  boardgamesController.destroy
);

boardgamesRouter.delete("/", onlyReturnsJSON, methodNotAllowed);

// put
boardgamesRouter.put(
  "/:boardgameID",
  onlyReturnsJSON,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  areAllReqKeysValid,
  isReqBodyValid,
  isNameAndUserUniq,
  boardgamesController.update
);

boardgamesRouter.put("/", onlyReturnsJSON, methodNotAllowed);

// patch
boardgamesRouter.patch(
  "/:boardgameID",
  onlyReturnsJSON,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  isNameAndUserUniq,
  boardgamesController.update
);

boardgamesRouter.patch("/", onlyReturnsJSON, methodNotAllowed);

module.exports = boardgamesRouter;
