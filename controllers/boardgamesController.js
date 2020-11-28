const boardgamesModel = require("../models/boardgamesModel");
const usersModel = require("../models/usersModel");
const { getURL, removeCursorFromQueryString } = require("../utils");

const show = async (req, res, next) => {
  const { id, name, min_players, max_players, plays } = res.locals.boardgame;

  res.status(200).json({
    id: id,
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: {
      id: res.locals.user.id,
      self: `${getURL()}users/${res.locals.user.id}`,
    },
    self: `${getURL()}boardgames/${id}`,
  });
};

const index = async (req, res, next) => {
  let queryKeys = Object.keys(req.query);
  let queryValues = Object.values(req.query);

  queryKeys.push("user.id");
  queryValues.push(res.locals.user.id);

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
  let boardgame;
  try {
    boardgame = await boardgamesModel.create(req.body, res.locals.user.id);
  } catch (err) {
    next(err);
  }

  try {
    await usersModel.addBoardgame(res.locals.user.id, {
      name: boardgame.name,
      id: boardgame.id,
    });
  } catch (err) {
    next(err);
  }

  const { id, name, min_players, max_players, plays } = boardgame;

  res.status(201).json({
    id: id,
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: {
      id: res.locals.user.id,
      self: `${getURL()}users/${res.locals.user.id}`,
    },
    self: `${getURL()}boardgames/${id}`,
  });
};

const destroy = async (req, res, next) => {
  // check if board game has plays

  // delete all plays

  try {
    await boardgamesModel.destroy(res.locals.boardgame.id);
  } catch (err) {
    return next(err);
  }

  try {
    await usersModel.deleteBoardgame(res.locals.user.id, boardgame.id);
  } catch (err) {
    next(err);
  }

  res.status(204).end();
};

const update = async (req, res, next) => {
  const priorBoardgame = res.locals.boardgame;

  let updateValues = {
    id: priorBoardgame.id,
    name: req.body.name,
    min_players: req.body.minPlayers,
    max_players: req.body.maxPlayers,
    plays: priorBoardgame.plays,
    user: {
      id: priorBoardgame.user.id,
    },
  };

  let updatedBoardgame;
  try {
    updatedBoardgame = await boardgamesModel.update(updateValues);
  } catch (err) {
    return next(err);
  }

  // TODO only need to call this if req.body.name is different from priorBoardgame
  try {
    await usersModel.updateBoardgame(res.locals.user.id, {
      name: boardgame.name,
      id: boardgame.id,
    });
  } catch (err) {
    next(err);
  }

  // TODO update plays. Note need to add middleware validation to ensure
  // updated min and max player does not conflict with Plays.num_of_players

  const { id, name, min_players, max_players, plays } = updatedBoardgame;

  res.status(200).json({
    id: id,
    name: name,
    min_players: min_players,
    max_players: max_players,
    plays: plays,
    user: {
      id: updatedBoardgame.user.id,
      self: `${getURL()}users/${updatedBoardgame.user.id}`,
    },
    self: `${getURL()}boardgames/${id}`,
  });
};

module.exports = {
  show,
  index,
  create,
  destroy,
  update,
};
