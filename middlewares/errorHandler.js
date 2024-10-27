// errorHandler.js
const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ error: 'An unexpected error occurred!' });
};

module.exports = errorHandler;
