const AppError = require('../errors/AppError');

const { verifyToken } = require('../providers/auth/jwt.provider');

const UserRepository = require('../../modules/users/repositories/UserRepository');

async function authMiddleware(request, response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authentication token missing', 401);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Invalid token format', 401);
    }

    const decoded = verifyToken(token);

    const user = await UserRepository.findById(decoded.sub);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.is_active) {
      throw new AppError('User account disabled', 403);
    }

    request.user = {
      id: user.id,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
