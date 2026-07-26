const { createHash, randomUUID } = require('crypto');

const jwt = require('jsonwebtoken');

const authConfig = require('../../../config/auth');

function generateAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
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
    },
    authConfig.jwt.refreshToken.secret,
    {
      expiresIn: authConfig.jwt.refreshToken.expiresIn,
      jwtid: jti,
    }
  );
}

function generateJti() {
  return randomUUID();
}

function hashRefreshToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function verifyAccessToken(token) {
  return jwt.verify(token, authConfig.jwt.accessToken.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, authConfig.jwt.refreshToken.secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  hashRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
