const bcrypt = require('bcryptjs');

const authConfig = require('../../../config/auth');

async function generateHash(payload) {
  return bcrypt.hash(payload, authConfig.password.saltRounds);
}

async function compareHash(payload, hashedPayload) {
  return bcrypt.compare(payload, hashedPayload);
}

module.exports = {
  generateHash,
  compareHash,
};
