const { keys, cloneDeep } = require('lodash');
const { findById } = require('./game.service');

const SOCKET = {
  userJoin: 'USER_JOIN',
  userLeave: 'USER_LEAVE',
  gameStart: 'GAME_START',
  gameUpdate: 'GAME_UPDATE',
};

class SocketData {
  constructor() {
    this._games = {};
    this._sockets = {};
  }

  update({ target, data }) {
    const clone = cloneDeep(target);

    keys(data).forEach((key) => {
      const value = data[key];
      clone[key] = value;
    });

    return clone;
  }

  initGame({ gameId }) {
    this._games[gameId] = {
      _id: gameId,
      users: [],
      isPlaying: false,
      gameInfo: null,
    };

    return this;
  }

  getGames() {
    return keys(this._games).map((key) => {
      return this._games[key];
    });
  }

  getGame({ gameId }) {
    return cloneDeep(this._games[gameId]);
  }

  updateGame({ gameId, data }) {
    const target = this._games[gameId];
    const updated = this.update({ target, data });

    return this._games[gameId] = updated;
  }

  deleteGame({ gameId }) {
    delete this._games[gameId];
  }

  initSocket({ socketId }) {
    this._sockets[socketId] = { id: socketId };
    return this;
  }

  getSocket({ socketId }) {
    return cloneDeep(this._sockets[socketId]);
  }

  updateSocket({ socketId, data }) {
    const target = this._sockets[socketId];
    const updated = this.update({ target, data });

    return this._sockets[socketId] = updated;
  }

  deleteSocket({ socketId }) {
    delete this._sockets[socketId];
  }
}

module.exports = (server) => {
  const io = require('socket.io').listen(server);
  const socketData = new SocketData();

  io.on('connection', (socket) => {
    socketData.initSocket({ socketId: socket.id });

    socket.on(SOCKET.userJoin, ({ gameId, userId, username }) => {
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
      } else {
        socketData.deleteGame({ gameId });
      }
    });

    socket.on('disconnect', () => {
      const socketId = socket.id;
      const { gameId } = socketData.getSocket({ socketId });
      const game = socketData.getGame({ gameId });

      if (!game) return;

      if (gameId) {
        socket.leave(gameId);

        game.users = game.users.filter((user) => (
          user.socketId !== socketId
        ));

        socketData.updateGame({ gameId, data: game });

        if (game.users.length) {
          io.to(gameId).emit(SOCKET.userJoin, game);
        } else {
          socketData.deleteGame({ gameId });
        }
      }

      delete socketData.deleteSocket({ socketId });
    });

    socket.on(SOCKET.gameStart, async ({ gameId }) => {
      const game = socketData.getGame({ gameId });
      game.gameInfo = await findById({ gameId });

      socketData.updateGame({ gameId, data: game });

      io.to(gameId).emit(SOCKET.gameStart, game);
    });

    socket.on(SOCKET.gameUpdate, ({ gameId, userId }) => {
      const game = socketData.getGame({ gameId });
      game.users.map((user) => {
        if (user._id === userId) {
          user.gameIndex += 1;
        }
        return user;
      });

      socketData.updateGame({ gameId, data: game });
      io.to(gameId).emit(SOCKET.gameUpdate, {
        game,
        userId,
      });
    });
  });
};
