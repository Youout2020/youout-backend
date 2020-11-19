const Game = require('../models/Game');
const History = require('../models/History');

const gameServiceError = (message, err) => {
  console.error(`🔥 Game Service Error => ${message}`);
  throw Error(err);
};

exports.findById = async ({ gameId }) => {
  try {
    return await Game.findById(gameId);
  } catch (err) {
    gameServiceError('findById', err);
  }
};

exports.findByLocation = async ({ lat, lng, page = 1, limit = 10 }) => {
  try {
    const result = await Game.paginate({
      location: {
        $geoWithin: {
          $center: [[lng, lat], 1] // 1 radius is 111km
        }
      }
    }, { page, limit });

    return result;
  } catch (err) {
    gameServiceError('findByLocation', err);
  }
};

exports.findByHistory = async ({ userId, page = 1, limit = 10 }) => {
  try {
    const result = await History.paginate(
      { 'users.id': userId },
      { page, limit, sort: { createdAt: -1 }}
    );

    return result;
  } catch (err) {
    gameServiceError('findByHistory', err);
  }
};

exports.findByUser = async ({ userId, page = 1, limit = 10 }) => {
  try {
    const result = await Game.paginate(
      { owner: userId },
      { page, limit, sort: { createdAt: -1 } },
    );

    return result;
  } catch (err) {
    gameServiceError('findByUser', err);
  }
};

exports.create = async ({ userId, body }) => {
  try {
    const result = await Game.create({
      owner: userId,
      ...body,
    });

    return result;
  } catch (err) {
    gameServiceError('create', err);
  }
};

exports.update = async ({ gameId, body }) => {
  try {
    return await Game.findByIdAndUpdate(gameId, body, { new: true });
  } catch (err) {
    gameServiceError('update', err);
  }
};
