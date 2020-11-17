const jwt = require('jsonwebtoken');
const { SECRET_TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ result: 'fail', message: 'unauthorized' });
    return;
  }

  jwt.verify(token, SECRET_TOKEN_KEY, (err, decoded) => {
    if (err) next(err);

    res.locals.user = decoded;
    next();
  });
};

module.exports = verifyToken;
