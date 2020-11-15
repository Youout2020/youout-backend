const express = require('express');
const passport = require('passport');

const loginController = require('./controllers/login.controller');

const router = express.Router();

router.get('/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  loginController.login,
);

module.exports = router;
