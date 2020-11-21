const History = require('../models/History');
const Game = require('../models/Game');

const createHistory = async ({ users, gameId }) => {
  const game = await Game.findById(gameId);
  const mappedUsers = users.map((user) => {
    user.lastSolvedQuiz = user.gameIndex;
    return user;
  });
  console.log('createHistory', game);

  return await History.create({ users: mappedUsers, game: { id: gameId, name: game.name } });
};

module.exports = {
  createHistory,
};
