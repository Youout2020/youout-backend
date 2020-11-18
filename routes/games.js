const express = require('express');
const router = express.Router();
const gamesController = require('./controllers/games.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/',
  verifyToken,
  gamesController.sendGames,
);

router.put('/:game_id/update',
  verifyToken,
  gamesController.update,
);

router.get('/:game_id',
  verifyToken,
  gamesController.sendGame,
);

router.post('/',
  verifyToken,
  gamesController.create,
);

module.exports = router;
