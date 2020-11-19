const express = require('express');
const router = express.Router();
const userController = require('./controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, userController.sendUserInfo);

module.exports = router;
