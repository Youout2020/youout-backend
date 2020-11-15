const jwt = require('jsonwebtoken');
const userService = require('../../services/user.service');

const { CLIENT_URI, SECRET_TOKEN_KEY } = process.env;

exports.login = async (req, res, next) => {
  const { name, email, image } = req.user;

  try {
    const { _id: id } = await userService.loginUser({ name, email, image });
    const userInfo = { id, name, email, image };

    jwt.sign(userInfo, SECRET_TOKEN_KEY, (err, token) => {
        if (err) next(err);

        res.redirect(`${CLIENT_URI}/callback?token=${token}`);
      },
    );
  } catch (err) {
    next(err);
  }
};
