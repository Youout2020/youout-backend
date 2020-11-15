const User = require('../models/User');

exports.findUser = async ({ email }) => {
  return await User.findOne({ email });
};

exports.createUser = async ({ name, email, image }) => {
  return await User.create({ name, email, image });
};

exports.loginUser = async ({ name, email, image }) => {
  const user = await User.findOne({ email });

  if (user) {
    return user;
  }

  return await User.createUser({ name, email, image });
};
