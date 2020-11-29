const playsModel = require("../models/playsModel");
const boardgamesModel = require("../models/boardgamesModel");
const { getURL, removeCursorFromQueryString } = require("../utils");

const show = async (req, res, next) => {
  const { id, date_started, num_of_players, winner } = res.locals.play;
  let boardgame = res.locals.play.boardgame;

  if (boardgame !== null) {
    boardgame.self = `${getURL()}boardgames/${boardgame.id}`;
  }

  res.status(200).json({
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

  const { isMoreResults, endCursor, numOfPlays } = dbRes;
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
    res
      .status(200)
      .json({ plays: plays, next: nextURL, number_of_plays: numOfPlays });
  } else {
    res.status(200).json({ plays: plays, number_of_plays: numOfPlays });
  }
};

const create = async (req, res, next) => {
  let play;
  try {
    play = await playsModel.create(req.body, res.locals.user.id);
  } catch (err) {
    return next(err);
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

const destroy = async (req, res, next) => {
  if (res.locals.play.boardgame) {
    try {
      await boardgamesModel.deletePlay(
        res.locals.play.boardgame.id,
        res.locals.play.id
      );
    } catch (err) {
      return next(err);
    }
  }

  try {
    await playsModel.destroy(res.locals.play.id);
  } catch (err) {
    return next(err);
  }

  res.status(204).end();
};

const update = async (req, res, next) => {
  const priorPlay = res.locals.play;
  const boardgame = res.locals.boardgame
    ? { id: res.locals.boardgame.id }
    : priorPlay.boardgame;

  let updateValues = {
    id: priorPlay.id,
    date_started: req.body.dateStarted,
    num_of_players: req.body.numOfPlayers,
    winner: req.body.winner,
    boardgame: boardgame,
    user: {
      id: priorPlay.user.id,
    },
  };

  let updatedPlay;
  try {
    updatedPlay = await playsModel.update(updateValues);
  } catch (err) {
    return next(err);
  }

  if (res.locals.boardgame) {
    try {
      await boardgamesModel.addPlay(res.locals.boardgame.id, {
        id: updatedPlay.id,
      });
    } catch (err) {
      return next(err);
    }
  }

  const { id, date_started, num_of_players, winner } = updatedPlay;
  let updatedBoardgame = updatedPlay.boardgame;

  if (updatedBoardgame !== null) {
    updatedBoardgame.self = `${getURL()}boardgames/${updatedBoardgame.id}`;
  }

  res.status(200).json({
    id: id,
    date_started: date_started,
    num_of_players: num_of_players,
    winner: winner,
    boardgame: updatedBoardgame,
    user: {
      id: updatedPlay.user.id,
      self: `${getURL()}users/${updatedPlay.user.id}`,
    },
    self: `${getURL()}plays/${id}`,
  });
};

const removeBoardgame = async (req, res, next) => {
  const priorPlay = res.locals.play;

  let updateValues = {
    id: priorPlay.id,
    date_started: priorPlay.date_started,
    num_of_players: priorPlay.num_of_players,
    winner: priorPlay.winner,
    boardgame: null,
    user: {
      id: priorPlay.user.id,
    },
  };

  let updatedPlay;
  try {
    updatedPlay = await playsModel.update(updateValues);
  } catch (err) {
    return next(err);
  }

  try {
    await boardgamesModel.deletePlay(res.locals.boardgame.id, updatedPlay.id);
  } catch (err) {
    return next(err);
  }

  const { id, date_started, num_of_players, winner, boardgame } = updatedPlay;

  res.status(200).json({
    id: id,
    date_started: date_started,
    num_of_players: num_of_players,
    winner: winner,
    boardgame: boardgame,
    user: {
      id: updatedPlay.user.id,
      self: `${getURL()}users/${updatedPlay.user.id}`,
    },
    self: `${getURL()}plays/${id}`,
  });
};

module.exports = {
  show,
  index,
  create,
  destroy,
  update,
  removeBoardgame,
};
