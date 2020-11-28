const boardgamesModel = require("../models/boardgamesModel");
const usersModel = require("../models/usersModel");
const playsModel = require("../models/playsModel");
const { getURL, removeCursorFromQueryString } = require("../utils");

const show = async (req, res, next) => {
  const { id, name, min_players, max_players } = res.locals.boardgame;
  let { plays } = res.locals.boardgame;

  if (plays !== null) {
    plays.forEach((play) => {
      play.self = `${getURL()}plays/${play.id}`;
    });
  }

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

    boardgame.plays.forEach((play) => {
      play.self = `${getURL()}plays/${play.id}`;
    });
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
    return next(err);
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
  if (res.locals.boardgame.plays.length !== 0) {
    res.locals.boardgame.plays.forEach(async (play) => {
      try {
        await playsModel.deleteBoardgame(play.id);
      } catch (err) {
        return next(err);
      }
    });
  }

  try {
    await usersModel.deleteBoardgame(
      res.locals.user.id,
      res.locals.boardgame.id
    );
  } catch (err) {
    return next(err);
  }

  try {
    await boardgamesModel.destroy(res.locals.boardgame.id);
  } catch (err) {
    return next(err);
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

  if (priorBoardgame.name !== updatedBoardgame.name) {
    try {
      await usersModel.updateBoardgame(res.locals.user.id, {
        name: updatedBoardgame.name,
        id: updatedBoardgame.id,
      });
    } catch (err) {
      return next(err);
    }
  }

  // TODO add middleware to ensure number of player conflict does not exist

  // TODO add boardgame.name to plays.boardgame if boardgame name updated,
  // update all plays

  const { id, name, min_players, max_players } = updatedBoardgame;
  let { plays } = updatedBoardgame;

  if (plays) {
    plays.forEach((play) => {
      play.self = `${getURL()}plays/${play.id}`;
    });
  }

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
