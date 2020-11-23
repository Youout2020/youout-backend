const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const userService = require('../../services/user.service');
const { SECRET_TOKEN_KEY } = process.env;
const sign = promisify(jwt.sign);

const loginControllerError = (message) => {
  console.error(`🔥 Login Controller Error => ${message}`);
};

exports.login = async (req, res, next) => {
  const user = {};

  // try {
  //   const { name, email, image } = req.body;
  //   const { _id: id } = await userService.loginUser({ name, email, image });
  //   Object.assign(user, { name, email, image, id });
  // } catch (err) {
  //   loginControllerError('login');
  //   next(err);
  // }

  try {
    // const token = await sign(user, SECRET_TOKEN_KEY);

    res.status(200);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.json({result: 'ok'});
  } catch (err) {
    loginControllerError('sign token');
    next(err);
  }
};
