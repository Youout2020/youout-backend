const User = require('../models/User');

const userServiceError = (message, err) => {
  console.error(`🔥 Game Service Error => ${message}`);
  throw Error(err);
};

const findUser = async ({ email }) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    userServiceError('findUser', err);
  }
};

const createUser = async ({ name, email, image }) => {
  try {
    return await User.create({ name, email, image });
  } catch (err) {
    userServiceError('createUser', err);
  }
};

const loginUser = async ({ name, email, image }) => {
  try {
    const user = await findUser({ email });

    if (user) {
      return user;
    }

    return await createUser({ name, email, image });
  } catch (err) {
    userServiceError('loginUser', err);
  }
};

module.exports = {
  findUser,
  createUser,
  loginUser,
};
