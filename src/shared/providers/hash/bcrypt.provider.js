const bcrypt = require('bcryptjs');

const authConfig = require('../../../config/auth');

async function hashPassword(password) {
  return bcrypt.hash(password, authConfig.password.saltRounds);
}

async function comparePassword(password, passwordHash) {
  if (typeof password !== 'string' || typeof passwordHash !== 'string') {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
