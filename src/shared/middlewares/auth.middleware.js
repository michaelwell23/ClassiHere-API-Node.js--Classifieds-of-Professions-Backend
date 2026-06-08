const jwt = require('jsonwebtoken');

const AppError = require('../errors/AppError');

const authConfig = require('../../config/auth');

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token not provided', 401));
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret);

    request.user = {
      id: decoded.sub,
    };

    return next();
  } catch {
    return next(new AppError('Invalid token', 401));
  }
}

module.exports = authMiddleware;
