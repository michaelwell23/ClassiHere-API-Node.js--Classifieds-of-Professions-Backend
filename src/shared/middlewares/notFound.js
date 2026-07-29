const AppError = require('../errors/AppError');

function notFound(request, response, next) {
  return next(new AppError('Route not found.', 404));
}

module.exports = notFound;
