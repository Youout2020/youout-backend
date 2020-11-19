const History = require('../models/History');

const createHistory = async ({ users, gameId }) => {
  return await History.create({ users, game: { id: gameId } });
};

module.exports = {
  createHistory,
};
