const playsModel = require("../models/playsModel");
const usersModel = require("../models/usersModel");
const { getURL, removeCursorFromQueryString } = require("../utils");

const show = async (req, res, next) => {
  const { id, date_started, num_of_players, winner } = res.locals.play;
  let boardgame = res.locals.play.boardgame;

  if (boardgame !== null) {
    boardgame.self = `${getURL()}boardgames/${boardgame.id}`;
  }

  res.status(201).json({
    id: id,
    date_started: date_started,
    num_of_players: num_of_players,
    winner: winner,
    boardgame: boardgame,
    user: {
      id: res.locals.user.id,
      self: `${getURL()}users/${res.locals.user.id}`,
    },
    self: `${getURL()}plays/${id}`,
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
    dbRes = await playsModel.getPlays(cursor, queryKeys, queryValues);
  } catch (err) {
    return next(err);
  }

  const { isMoreResults, endCursor } = dbRes;
  let { plays } = dbRes;

  plays.forEach((play) => {
    play.self = `${getURL()}plays/${play.id}`;
    play.user.self = `${getURL()}users/${play.user.id}`;

    if (play.boardgame !== null) {
      play.boardgame.self = `${getURL()}boardgames/${play.boardgame.id}`;
    }
  });

  if (isMoreResults === true) {
    let nextURL = `${getURL()}plays/?cursor=${endCursor}`;
    res.status(200).json({ plays: plays, next: nextURL });
  } else {
    res.status(200).json({ plays: plays });
  }
};

const create = async (req, res, next) => {
  let play;
  try {
    play = await playsModel.create(req.body, res.locals.user.id);
  } catch (err) {
    next(err);
  }

  const { id, date_started, num_of_players, winner } = play;

  res.status(201).json({
    id: id,
    date_started: date_started,
    num_of_players: num_of_players,
    winner: winner,
    boardgame: null,
    user: {
      id: res.locals.user.id,
      self: `${getURL()}users/${res.locals.user.id}`,
    },
    self: `${getURL()}plays/${id}`,
  });
};

const destroy = async (req, res, next) => {};

const update = async (req, res, next) => {};

module.exports = {
  show,
  index,
  create,
  destroy,
  update,
};
