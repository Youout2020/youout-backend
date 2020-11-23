const historyService = require('../../services/history.service');

const historiesControllerError = (message) => {
  console.error(`🔥 histories Controller Error => ${message}`);
};

exports.sendHistory = async (req, res, next) => {
  const { history_id } = req.params;

  try {
    const result = await historyService.getHistoryByGameId({ historyId: history_id });

    res.status(200);
    res.json({ result: 'ok', data: result });
  } catch (err) {
    historiesControllerError('sendHistory');
    next(err);
  }
};
