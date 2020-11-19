const { findById } = require('./game.service');
const { createHistory } = require('./history.service');
const SocketData = require('./SocketData');

const SOCKET = {
  userJoin: 'USER_JOIN',
  userLeave: 'USER_LEAVE',
  gameStart: 'GAME_START',
  gameUpdate: 'GAME_UPDATE',
};

module.exports = (server) => {
  const io = require('socket.io').listen(server);
  const socketData = new SocketData();

  io.on('connection', (socket) => {
    socketData.initSocket({ socketId: socket.id });

    socket.on(SOCKET.userJoin, ({ gameId, userId, username }) => {
      socketData.validateObjectId(userId);
      socketData.validateObjectId(gameId);

      if (!socketData.getGame({ gameId })) {
        socketData.initGame({ gameId });
      }

      const socketId = socket.id;
      const game = socketData.getGame({ gameId });
      const targetSocket = socketData.getSocket({ socketId });

      socket.join(gameId);
      targetSocket.gameId = gameId;
      game.users.push({
        _id: userId,
        socketId,
        username,
        gameIndex: -1
      });

      socketData.updateSocket({ socketId, data: targetSocket });
      socketData.updateGame({ gameId, data: game});

      io.to(gameId).emit(SOCKET.userJoin, game);
    });

    socket.on(SOCKET.userLeave, ({ gameId }) => {
      socketData.validateObjectId(gameId);

      const socketId = socket.id;
      const game = socketData.getGame({ gameId });
      const targetSocket = socketData.getSocket({ socketId });

      if (!game) return;

      socket.leave(gameId);

      targetSocket.gameId = null;
      game.users = game.users.filter((user) => (
        user.socketId !== socketId
      ));

      socketData.updateSocket({ socketId, data: targetSocket});
      socketData.updateGame({ gameId, data: game});

      if (game.users.length) {
        io.to(gameId).emit(SOCKET.userJoin, game);
        return;
      }

      if (game.isPlaying) {
        createHistory({ users: game.users, gameId });
      }

      socketData.deleteGame({ gameId });
    });

    socket.on('disconnect', () => {
      const socketId = socket.id;
      const { gameId } = socketData.getSocket({ socketId });
      const game = gameId && socketData.getGame({ gameId });

      if (!game) return;

      if (gameId) {
        socket.leave(gameId);

        game.users = game.users.filter((user) => (
          user.socketId !== socketId
        ));

        socketData.updateGame({ gameId, data: game });

        if (game.users.length) {
          io.to(gameId).emit(SOCKET.userJoin, game);
          return;
        }

        if (game.isPlaying) {
          createHistory({ users: game.users, gameId });
        }

        socketData.deleteGame({ gameId });
      }

      delete socketData.deleteSocket({ socketId });
    });

    socket.on(SOCKET.gameStart, async ({ gameId }) => {
      socketData.validateObjectId(gameId);

      const game = socketData.getGame({ gameId });
      game.gameInfo = await findById({ gameId });
      game.isPlaying = true;

      socketData.updateGame({ gameId, data: game });

      io.to(gameId).emit(SOCKET.gameStart, game);
    });

    socket.on(SOCKET.gameUpdate, ({ gameId, userId }) => {
      socketData.validateObjectId(gameId);
      socketData.validateObjectId(userId);

      const game = socketData.getGame({ gameId });
      game.users = game.users.map((user) => (
        user._id === userId ? user.gameIndex += 1 : user
      ));

      socketData.updateGame({ gameId, data: game });
      io.to(gameId).emit(SOCKET.gameUpdate, game);
    });

    socket.on(SOCKET.gameEnd, ({ gameId }) => {
      const game = socketData.getGame({ gameId });
      createHistory({ users: game.users, gameId });
      socketData.deleteGame({ gameId });
    });
  });
};
