const boardgamesModel = require("../models/boardgamesModel");
const usersModel = require("../models/usersModel");
const { getURL, removeCursorFromQueryString } = require("../util");
const createError = require("http-errors");

const show = async (req, res, next) => {
  if (res.locals.userID === undefined) {
    return next(
      createError(401, "Unauthorized. Authorization middleware is required.")
    );
  }

  let boardgame;
  try {
    boardgame = await boardgamesModel.getBoardgameFromID(req.params.id);
  } catch (err) {
    return next(createError(404, "No boardgame with this id exists."));
  }

  const { id, name, min_players, max_players, plays } = boardgame;

  if (res.locals.userID !== boardgame.user.id) {
    return next(
      createError(403, "Forbidden. Can only view your own boardgames.")
    );
  }

  res.status(200).json({
    id: id,
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: boardgame.user,
    self: `${getURL()}boardgames/${id}`,
  });
};

const index = async (req, res, next) => {
  if (res.locals.userID === undefined) {
    return next(
      createError(401, "Unauthorized. Authorization middleware is required.")
    );
  }

  let queryKeys = Object.keys(req.query);
  let queryValues = Object.values(req.query);

  queryKeys.push("user.id");
  queryValues.push(res.locals.userID);

  const cursor = queryKeys.includes("cursor") ? req.query.cursor : null;
  removeCursorFromQueryString(queryKeys, queryValues);

  let dbRes;
  try {
    dbRes = await boardgamesModel.getBoardgames(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  const { isMoreResults, endCursor } = dbRes;
  let { boardgames } = dbRes;

  boardgames.forEach((boardgame) => {
    boardgame.self = `${getURL()}boardgames/${boardgame.id}`;
    boardgame.user.self = `${getURL()}users/${boardgame.user.id}`;
  });

  if (isMoreResults === true) {
    let nextURL = `${getURL()}boardgames/?cursor=${endCursor}`;
    res.status(200).json({ boardgames: boardgames, next: nextURL });
  } else {
    res.status(200).json({ boardgames: boardgames });
  }
};

const create = async (req, res, next) => {
  if (res.locals.userID === undefined) {
    return next(
      createError(401, "Unauthorized. Authorization middleware is required.")
    );
  }

  let user;
  try {
    user = await usersModel.getUserFromID(res.locals.userID);
  } catch (err) {
    next(err);
  }

  if (user === undefined) {
    return next(
      createError(500, "Valid credentials but user is not stored in database.")
    );
  }

  const sentKeys = Object.keys(req.body);
  if (!boardgamesModel.validKeys(sentKeys)) {
    return next(
      createError(
        400,
        "The keys name, min players and max players are required. No extra keys are allowed."
      )
    );
  }

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
  queryValues = [res.locals.userID, req.body.name];
  const cursor = null;

  let dbRes;
  try {
    dbRes = await boardgamesModel.getBoardgames(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  if (dbRes.boardgames.length !== 0) {
    return next(
      createError(400, "User and boardgame name combination must be unique.")
    );
  }

  let boardgame;
  try {
    boardgame = await boardgamesModel.create(req.body, res.locals.userID);
  } catch (err) {
    next(err);
  }

  const { id, name, min_players, max_players, plays } = boardgame;
  const resUser = boardgame.user;

  res.status(201).json({
    id: id,
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: resUser,
    self: `${getURL()}boardgames/${id}`,
  });
};

const destroy = async (req, res, next) => {
  if (res.locals.userID === undefined) {
    return next(
      createError(401, "Unauthorized. Authorization middleware is required.")
    );
  }

  let boardgame;
  try {
    boardgame = await boardgamesModel.getBoardgameFromID(req.params.id);
  } catch (err) {
    return next(createError(404, "No boardgame with this id exists."));
  }

  if (res.locals.userID !== boardgame.user.id) {
    return next(
      createError(403, "Forbidden. Can only delete your own boardgames.")
    );
  }

  // update user by remove boardgame from user boardgames

  // check if board game has plays

  // delete all plays

  let dbRes;
  try {
    dbRes = await boardgamesModel.destroy(req.params.id);
  } catch (err) {
    return next(err);
  }

  res.status(204).end();
};

module.exports = {
  show,
  index,
  create,
  destroy,
};
