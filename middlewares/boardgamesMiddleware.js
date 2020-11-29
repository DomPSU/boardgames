const boardgamesModel = require("../models/boardgamesModel");
const createError = require("http-errors");

const setBoardgameFromReqParam = async (req, res, next) => {
  try {
    const boardgame = await boardgamesModel.getBoardgameFromID(
      req.params.boardgameID
    );
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

const areAllReqKeysValid = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);
  if (!boardgamesModel.validKeys(sentKeys)) {
    return next(
      createError(
        400,
        "The keys name, minPlayers and maxPlayers are required. No extra keys are allowed."
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

  next();
};

const isNameAndUserUniq = async (req, res, next) => {
  queryKeys = ["user.id", "name"];
  queryValues = [res.locals.user.id, req.body.name];
  const cursor = null;

  let dbRes;
  try {
    dbRes = await boardgamesModel.getBoardgames(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  if (dbRes.boardgames.length > 1) {
    return next(
      createError(500, "Duplicate composite key for user.id + boardgame.name.")
    );
  }

  if (req.method === "POST" && dbRes.boardgames.length === 1) {
    return next(
      createError(400, "User and boardgame combination already exists.")
    );
  } else if (
    dbRes.boardgames.length === 1 &&
    dbRes.boardgames[0].id !== res.locals.boardgame.id
  ) {
    return next(
      createError(400, "User and boardgame combination already exists.")
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
  areAllReqKeysValid,
  arePartialReqKeysValid,
  isReqBodyValid,
  setMissingReqBodyValues,
  isNameAndUserUniq,
};
