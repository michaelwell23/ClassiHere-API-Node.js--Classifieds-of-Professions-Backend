const AppError = require('../errors/AppError');

const { verifyAccessToken } = require('../providers/jwt.auth.provider');

const UserRepository = require('../../modules/users/repositories/UserRepository');

async function authMiddleware(request, response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authentication token missing', 401);
    }

    const authParts = authHeader.trim().split(/\s+/);

    if (authParts.length !== 2 || authParts[0] !== 'Bearer' || !authParts[1]) {
      throw new AppError('Invalid authentication token format', 401);
    }

    const token = authParts[1];

    const decoded = verifyAccessToken(token);

    if (!decoded.sub || typeof decoded.sub !== 'string') {
      throw new AppError('Invalid authentication token', 401);
    }

    const user = await UserRepository.findById(decoded.sub);

    if (!user) {
      throw new AppError('Invalid authentication token', 401);
    }

    if (!user.is_active) {
      throw new AppError('User account disabled', 403);
    }

    request.user = {
      id: user.id,
      email: user.email,
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Authentication token expired', 401));
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return next(new AppError('Invalid authentication token', 401));
    }

    return next(error);
  }
}

module.exports = authMiddleware;
