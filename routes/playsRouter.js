const express = require("express");
const playsController = require("../controllers/playsController");
const {
  isReqBodyEmpty,
  methodNotAllowed,
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
  setPlayFromReqParam,
  isUsersPlay,
  playsController.show
);

playsRouter.get("/", playsController.index);

// post
playsRouter.post("/:playID", methodNotAllowed);

playsRouter.post(
  "/",
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.create
);

// delete
playsRouter.delete(
  "/:playID/boardgames/:boardgameID",
  isReqBodyEmpty,
  setPlayFromReqParam,
  isUsersPlay,
  setBoardgameFromReqParam,
  isUsersBoardgame,
  isPlayAndBoardgameRelated,
  playsController.removeBoardgame
);

playsRouter.delete("/:playID/boardgames", methodNotAllowed);

playsRouter.delete(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  playsController.destroy
);

playsRouter.delete("/", methodNotAllowed);

// put
playsRouter.put(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  areAllReqKeysValid,
  isReqBodyValid,
  playsController.update
);

playsRouter.put("/", methodNotAllowed);

// patch
playsRouter.patch(
  "/:playID/boardgames/:boardgameID",
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

playsRouter.patch("/:playID/boardgames", methodNotAllowed);

playsRouter.patch(
  "/:playID",
  setPlayFromReqParam,
  isUsersPlay,
  arePartialReqKeysValid,
  setMissingReqBodyValues,
  isReqBodyValid,
  playsController.update
);

playsRouter.patch("/", methodNotAllowed);

module.exports = playsRouter;
