const boardgamesModel = require("../models/boardgamesModel");
const usersModel = require("../models/usersModel");
const { getURL, removeCursorFromQueryString } = require("../util");
const createError = require("http-errors");

const setBoardgameFromReqParam = async (req, res, next) => {
  try {
    boardgame = await boardgamesModel.getBoardgameFromID(req.params.id);
    res.locals.boardgame = boardgame;
  } catch (err) {
    return next(createError(404, "No boardgame with this id exists."));
  }

  next();
};

const isUsersBoardgame = async (req, res, next) => {
  if (res.locals.user.id !== res.locals.boardgame.user.id) {
    return next(
      createError(403, "Forbidden. Boardgame is owned by a different user.")
    );
  }

  next();
};

const isUserInDB = async (req, res, next) => {
  try {
    user = await usersModel.getUserFromID(res.locals.user.id);
  } catch (err) {
    next(err);
  }

  if (user === undefined) {
    return next(
      createError(500, "Valid credentials but user is not stored in database.")
    );
  }

  next();
};

const areAllReqKeysValid = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);
  if (!boardgamesModel.validKeys(sentKeys)) {
    return next(
      createError(
        400,
        "The keys name, min players and max players are required. No extra keys are allowed."
      )
    );
  }

  next();
};

const arePartialReqKeysValid = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);
  if (!boardgamesModel.validPartialKeys(sentKeys)) {
    return next(
      createError(
        400,
        "Only name, min players and max players keys are allowed."
      )
    );
  }

  next();
};

const isReqBodyValid = async (req, res, next) => {
  let errorSummary = "";
  if (!boardgamesModel.validName(req.body.name)) {
    errorSummary += "Invalid name. ";
  }

  if (!boardgamesModel.validMinPlayers(req.body.minPlayers)) {
    errorSummary += "Invalid min players. ";
  }

  if (!boardgamesModel.validMaxPlayers(req.body.maxPlayers)) {
    errorSummary += "Invalid max players. ";
  }

  if (errorSummary !== "") {
    return next(createError(400, errorSummary.slice(0, -2)));
  }

  if (
    !boardgamesModel.validMinMaxPlayerCombo(
      req.body.minPlayers,
      req.body.maxPlayers
    )
  ) {
    return next(createError(400, "Min players must be less than max players."));
  }

  queryKeys = ["user.id", "name"];
  queryValues = [res.locals.user.id, req.body.name];
  const cursor = null;

  let dbRes;
  try {
    dbRes = await boardgamesModel.getBoardgames(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  // TODO FIX incase someone enters in same boardgame currently updating
  if (dbRes.boardgames.length !== 0) {
    return next(
      createError(400, "User and boardgame name combination must be unique.")
    );
  }

  next();
};

const setMissingReqBodyValues = async (req, res, next) => {
  const priorBoardgame = res.locals.boardgame;

  req.body.name = req.body.name ? req.body.name : priorBoardgame.name;

  req.body.minPlayers = req.body.minPlayers
    ? req.body.minPlayers
    : priorBoardgame.min_players;

  req.body.maxPlayers = req.body.maxPlayers
    ? req.body.maxPlayers
    : priorBoardgame.max_players;

  next();
};

module.exports = {
  setBoardgameFromReqParam,
  isUsersBoardgame,
  isUserInDB,
  areAllReqKeysValid,
  arePartialReqKeysValid,
  isReqBodyValid,
  setMissingReqBodyValues,
};
