const express = require("express");
const playsController = require("../controllers/playsController");
const { isAuth, isUserInDB } = require("../middlewares/authMiddleware");
const {
  setPlayFromReqParam,
  areAllReqKeysValid,
  isReqBodyValid,
  isUsersPlay,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isPlayBoardgameValid,
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
  setPlayFromReqParam,
  isUsersPlay,
  playsController.show
);

playsRouter.get("/", playsController.index);

// post
playsRouter.post(
  "/",
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.create
);

// delete
playsRouter.delete(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  playsController.destroy
);

playsRouter.delete(
  "/:playID/boardgames/:boardgameID",
  setPlayFromReqParam,
  isUsersPlay,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  // TODO check relation exists
  // TODO disallow req body values
  playsController.removeBoardgame
);

// put
playsRouter.put(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.update
);

// patch
playsRouter.patch(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  playsController.update
);

playsRouter.patch(
  "/:playID/boardgames/:boardgameID",
  setPlayFromReqParam,
  isUsersPlay,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  // TODO disallow req body values
  setMissingReqBodyValues,
  isPlayBoardgameValid, // TODO validate play number compatibility
  playsController.update
);

module.exports = playsRouter;
