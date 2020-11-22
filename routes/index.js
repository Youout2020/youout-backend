const express = require('express');
const router = express.Router();
const loginRouter = require('./login');
const gamesRouter = require('./games');
const userRouter = require('./user');
const historiesRouter = require('./histories');

router.use('/login', loginRouter);
router.use('/games', gamesRouter);
router.use('/user', userRouter);
router.use('/histories', historiesRouter);

module.exports = router;
