const express = require('express');
const router = express.Router();
const historiesController = require('./controllers/histories.controller');

router.get('/:history_id', historiesController.sendHistory);

module.exports = router;
