const playsModel = require("../models/playsModel");
const createError = require("http-errors");

const setPlayFromReqParam = async (req, res, next) => {
  try {
    const play = await playsModel.getPlayFromID(req.params.playID);
    res.locals.play = play;
  } catch (err) {
    return next(createError(404, "No play with this id exists."));
  }

  next();
};

const isUsersPlay = async (req, res, next) => {
  if (res.locals.user.id !== res.locals.play.user.id) {
    return next(
      createError(403, "Forbidden. Play is owned by a different user.")
    );
  }

  next();
};

const areAllReqKeysValid = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);
  if (!playsModel.validKeys(sentKeys)) {
    return next(
      createError(
        400,
        "The keys dateStarted, numOfPlayers and winner are required. No extra keys are allowed."
      )
    );
  }

  next();
};

const arePartialReqKeysValid = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);
  if (!playsModel.validPartialKeys(sentKeys)) {
    return next(
      createError(
        400,
        "Only dateStarted, numOfPlayers and winner keys are allowed."
      )
    );
  }

  next();
};

const isReqBodyValid = async (req, res, next) => {
  // TODO
  next();
};

const setMissingReqBodyValues = async (req, res, next) => {
  const priorPlay = res.locals.play;

  req.body.dateStarted = req.body.dateStarted
    ? req.body.dateStarted
    : priorPlay.date_started;

  req.body.numOfPlayers = req.body.numOfPlayers
    ? req.body.numOfPlayers
    : priorPlay.num_of_players;

  req.body.winner = req.body.winner ? req.body.winner : priorPlay.winner;

  next();
};

const isPlayBoardgameValid = async (req, res, next) => {
  // TODO
  next();
};

const isPlayBoardgameNull = async (req, res, next) => {
  if (res.locals.play.boardgame) {
    return next(createError(400, "Play is already related to a boardgame."));
  }

  next();
};

const isPlayAndBoardgameRelated = async (req, res, next) => {
  if (
    !res.locals.play.boardgame ||
    res.locals.play.boardgame.id !== res.locals.boardgame.id
  ) {
    return next(createError(400, "Play and boardgame are not related."));
  }

  next();
};

module.exports = {
  setPlayFromReqParam,
  isUsersPlay,
  areAllReqKeysValid,
  arePartialReqKeysValid,
  isReqBodyValid,
  setMissingReqBodyValues,
  isPlayBoardgameValid,
  isPlayBoardgameNull,
  isPlayAndBoardgameRelated,
};
