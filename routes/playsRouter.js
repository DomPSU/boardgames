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
} = require("../middlewares/playsMiddleware");

const playsRouter = express.Router();
playsRouter.use(isAuth, isUserInDB);

// get
playsRouter.get("/:playID", setPlayFromReqParam, isUsersPlay, playsController.show);

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

module.exports = playsRouter;
