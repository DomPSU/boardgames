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

const index = async (req, res, next) => {};

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
