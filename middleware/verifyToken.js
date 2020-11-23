const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verify = promisify(jwt.verify);
const { SECRET_TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401);
    res.json({ result: 'fail', message: 'unauthorized' });
    return;
  }

  const decoded = await verify(token, SECRET_TOKEN_KEY);
  res.locals.user = decoded;
  next();
};

module.exports = verifyToken;
