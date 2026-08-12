const jwt = require('jsonwebtoken');

const AppError = require('../errors/AppError');

const { verifyAccessToken } = require('../../modules/auth/providers/jwt.provider');

const UserRepository = require('../../modules/users/repositories/UserRepository');

async function authMiddleware(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppError('Authentication token is required.', 401);
    }

    const [scheme, token, extraValue] = authorization.trim().split(/\s+/);

    if (scheme !== 'Bearer' || !token || extraValue) {
      throw new AppError('Invalid authorization header.', 401);
    }

    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Access token has expired.', 401);
      }

      throw new AppError('Invalid access token.', 401);
    }

    const user = await UserRepository.findById(payload.sub);

    if (!user) {
      throw new AppError('Invalid access token.', 401);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (!user.is_email_verified) {
      throw new AppError('Email verification is required.', 403);
    }

    request.user = {
      id: user.id,
      email: user.email,
      is_email_verified: user.is_email_verified,
      is_phone_verified: user.is_phone_verified,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
