const AppError = require('../utils/errors/AppError');

module.exports = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} Not Found`, 404));
};
