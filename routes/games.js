const express = require('express');
const router = express.Router();
const gamesController = require('./controllers/games.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, gamesController.sendGames);
router.post('/', verifyToken, gamesController.create);

router.get('/:game_id', verifyToken, gamesController.sendGame);
router.put('/:game_id/update', verifyToken, gamesController.update);

module.exports = router;
