const SOCKET = {
  userJoin: 'USER_JOIN',
  userLeave: 'USER_LEAVE',
};

const GAMES = {};
const USERS = {};

module.exports = (server) => {
  const io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    const { id } = socket;
    USERS[id] = null;

    socket.on(SOCKET.userJoin, ({ gameId, userId, username }) => {
      if (!GAMES[gameId]) GAMES[gameId] = { users: [] };

      const { id } = socket;
      const { users } = GAMES[gameId];

      socket.join(gameId);
      USERS[id] = gameId;
      users.push({ socketId: id, userId, username });

      io.to(gameId).emit(SOCKET.userJoin, users);
    });

    socket.on(SOCKET.userLeave, ({ gameId }) => {
      if (!GAMES[gameId]) return;

      const { id } = socket;
      const { users } = GAMES[gameId];
      const filteredUsers = users.filter((user) => user.socketId !== id);

      socket.leave(gameId);
      USERS[id] = null;

      GAMES[gameId].users = filteredUsers;

      if (filteredUsers.length) {
        io.to(gameId).emit(SOCKET.userJoin, filteredUsers);
      } else {
        delete GAMES[gameId];
      }
    });

    socket.on('disconnect', () => {
      const { id } = socket;
      const gameId = USERS[id];

      if (gameId) {
        const { users } = GAMES[gameId];
        const filteredUsers = users.filter((user) => user.socketId !== id);

        socket.leave(gameId);
        GAMES[gameId].users = filteredUsers;

        if (filteredUsers.length) {
          io.to(gameId).emit(SOCKET.userJoin, filteredUsers);
        } else {
          delete GAMES[gameId];
        }
      }

      delete USERS[id];
    });
  });
};
