const { createHash, randomUUID, timingSafeEqual } = require('crypto');

const jwt = require('jsonwebtoken');

const authConfig = require('../../../config/auth');

function generateAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
      type: 'access',
    },
    authConfig.jwt.accessToken.secret,
    {
      expiresIn: authConfig.jwt.accessToken.expiresIn,
    }
  );
}

function generateRefreshToken(userId, jti) {
  return jwt.sign(
    {
      sub: userId,
      jti,
      type: 'refresh',
    },
    authConfig.jwt.refreshToken.secret,
    {
      expiresIn: authConfig.jwt.refreshToken.expiresIn,
    }
  );
}

function verifyAccessToken(token) {
  const payload = jwt.verify(token, authConfig.jwt.accessToken.secret);

  if (!payload.sub || payload.type !== 'access') {
    throw new jwt.JsonWebTokenError('Invalid access token payload');
  }

  return payload;
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, authConfig.jwt.refreshToken.secret);

  if (!payload.sub || !payload.jti || payload.type !== 'refresh') {
    throw new jwt.JsonWebTokenError('Invalid refresh token payload');
  }

  return payload;
}

function generateJti() {
  return randomUUID();
}

function hashRefreshToken(token) {
  if (typeof token !== 'string' || !token) {
    throw new TypeError('Refresh token must be a non-empty string.');
  }

  return createHash('sha256').update(token).digest('hex');
}

function compareRefreshTokenHash(token, storedHash) {
  if (typeof token !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const calculatedHash = hashRefreshToken(token);

  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (calculatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, storedBuffer);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateJti,
  hashRefreshToken,
  compareRefreshTokenHash,
};
