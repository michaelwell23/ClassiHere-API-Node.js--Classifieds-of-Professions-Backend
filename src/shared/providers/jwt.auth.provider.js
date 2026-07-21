const { randomUUID } = require('crypto');

const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth');

function generateAccessToken(payload) {
  return jwt.sign(payload, authConfig.jwt.accessToken.secret, {
    expiresIn: authConfig.jwt.accessToken.expiresIn,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, authConfig.jwt.refreshToken.secret, {
    expiresIn: authConfig.jwt.refreshToken.expiresIn,
  });
}

function generateJti() {
  return randomUUID();
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
  verifyAccessToken,
  verifyRefreshToken,
};
