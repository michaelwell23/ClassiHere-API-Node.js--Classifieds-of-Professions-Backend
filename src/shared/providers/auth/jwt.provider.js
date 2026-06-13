const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../config/jwt.config');

function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = {
  generateToken,
  verifyToken,
};
