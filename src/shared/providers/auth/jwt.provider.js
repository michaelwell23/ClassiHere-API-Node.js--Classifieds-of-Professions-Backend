const { randomUUID } = require('crypto');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../config/jwt.config');

function generateAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  });
}

function generateJti() {
  return randomUUID();
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.accessToken.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshToken.secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  verifyAccessToken,
  verifyRefreshToken,
};
