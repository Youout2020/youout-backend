const jwt = require('jsonwebtoken');
const userService = require('../../services/user.service');

exports.login = async (req, res, next) => {
  let id;
  const { name, email, image } = req.body;

  try {
    const user = await userService.findUser({ email });

    if (user) {
      id = user._id;
    } else {
      const newUser = await userService.createUser({ name, email, image });
      id = newUser._id;
    }

    const userInfo = { id, name, email, image };
    jwt.sign(
      userInfo,
      process.env.SECRET_TOKEN_KEY,
      (err, token) => {
        if (err) next(err);
        res.status(200).json({
          result: 'ok',
          data: { token, user: userInfo },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};
