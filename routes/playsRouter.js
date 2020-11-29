const express = require("express");
const playsController = require("../controllers/playsController");
const {
  isReqBodyEmpty,
  methodNotAllowed,
  onlyReturnsJSON,
} = require("../middlewares/generalMiddleware");
const { isAuth, isUserInDB } = require("../middlewares/authMiddleware");
const {
  setPlayFromReqParam,
  areAllReqKeysValid,
  isReqBodyValid,
  isUsersPlay,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isPlayBoardgameValid,
  isPlayBoardgameNull,
  isPlayAndBoardgameRelated,
} = require("../middlewares/playsMiddleware");
const {
  setBoardgameFromReqParam,
  isUsersBoardgame,
} = require("../middlewares/boardgamesMiddleware");

const playsRouter = express.Router();
playsRouter.use(isAuth, isUserInDB);

// get
playsRouter.get(
  "/:playID",
  onlyReturnsJSON,
  setPlayFromReqParam,
  isUsersPlay,
  playsController.show
);

playsRouter.get("/", onlyReturnsJSON, playsController.index);

// post
playsRouter.post("/:playID", onlyReturnsJSON, methodNotAllowed);

playsRouter.post(
  "/",
  onlyReturnsJSON,
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.create
);

// delete
playsRouter.delete(
  "/:playID/boardgames/:boardgameID",
  onlyReturnsJSON,
  isReqBodyEmpty,
  setPlayFromReqParam,
  isUsersPlay,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  isPlayAndBoardgameRelated,
  playsController.removeBoardgame
);

playsRouter.delete("/:playID/boardgames", onlyReturnsJSON, methodNotAllowed);

playsRouter.delete(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  playsController.destroy
);

playsRouter.delete("/", onlyReturnsJSON, methodNotAllowed);

// put
playsRouter.put(
  "/:playID",
  onlyReturnsJSON,
  setPlayFromReqParam,
  isUsersPlay,
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.update
);

playsRouter.put("/", onlyReturnsJSON, methodNotAllowed);

// patch
playsRouter.patch(
  "/:playID/boardgames/:boardgameID",
  onlyReturnsJSON,
  isReqBodyEmpty,
  setPlayFromReqParam,
  isUsersPlay,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  isPlayBoardgameNull,
  setMissingReqBodyValues,
  isPlayBoardgameValid,
  playsController.update
);

playsRouter.patch("/:playID/boardgames", onlyReturnsJSON, methodNotAllowed);

playsRouter.patch(
  "/:playID",
  onlyReturnsJSON,
  setPlayFromReqParam,
  isUsersPlay,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  playsController.update
);

playsRouter.patch("/", onlyReturnsJSON, methodNotAllowed);

module.exports = playsRouter;
