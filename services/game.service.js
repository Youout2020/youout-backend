const Game = require('../models/Game');
const History = require('../models/History');

exports.findByLocation = async ({ lat, lng, page = 1, limit = 10 }) => {
  const result = await Game.paginate({
    location: {
      $geoWithin: {
        $center: [[lat, lng], 1] // 1 radius is 111km
      }
    }
  }, { page, limit });
  return result;
};

exports.findByHistory = async ({ userId, page = 1, limit = 10 }) => {
  const result = await History.paginate(
    { 'users.id': userId },
    { page, limit, sort: { createdAt: -1 }}
  );

  return result;
};

exports.findByUser = async ({ userId, page = 1, limit = 10 }) => {
  const result = await Game.paginate(
    { owner: userId },
    { page, limit, sort: { createdAt: -1 } },
  );

  return result;
};

//Test function
exports.create = async (body) => {
  const result = await Game.create(body);

  return result;
};
