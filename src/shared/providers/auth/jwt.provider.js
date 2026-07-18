const { randomUUID } = require('crypto');

const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth');

function generateAccessToken(payload) {
  return jwt.sign(payload, authConfig.accessToken.secret, {
    expiresIn: authConfig.accessToken.expiresIn,
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, authConfig.refreshToken.secret, {
    expiresIn: authConfig.refreshToken.expiresIn,
  });
}

function generateJti() {
  return randomUUID();
}

function verifyAccessToken(token) {
  return jwt.verify(token, authConfig.accessToken.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, authConfig.refreshToken.secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  verifyAccessToken,
  verifyRefreshToken,
};
