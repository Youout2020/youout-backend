const gameService = require('../../services/game.service');

const QUERY_TYPE = {
  location: 'location',
  user: 'user',
};

exports.sendGames = async (req, res, next) => {
  const { query } = req;
  switch (query.type.toLowerCase()) {
    case QUERY_TYPE.location: {
      const games = await gameService.findByLocation(query);
      res.json({ result: 'ok', data: games });
      return;
    };

    case QUERY_TYPE.user: {
      const { id } = res.locals.user;
      const SELECTION_TYPE = {
        history: 'history',
        games: 'games',
      };

      switch (query.selection.toLowerCase()) {
        case SELECTION_TYPE.history: {
          const games = await gameService.findByHistory({ ...query, userId: id });
          res.json({ result: 'ok', data: games });
          return;
        }

        case SELECTION_TYPE.games: {
          const games = await gameService.findByUser({ ...query, userId: id });
          res.json({ result: 'ok', data: games });
          return;
        }
      }

      res.status(400).json({
        result: 'fail', message: `${query.selection} is not valid type.`
      });
      return;
    };
  }

  res.status(400).json({
    result: 'fail', message: `${query.type} is not valid type.`
  });
};

exports.create = async (req, res, next) => {
  const { body } = req;
  const { id } = res.locals.user;
  try {
    const newGame = await gameService.create(id, body);
    res.status(200).json({ result: 'ok', data: newGame });
  } catch (err) {
    next(err);
  }
};
