const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function generateHash(payload) {
  return bcrypt.hash(payload, SALT_ROUNDS);
}

async function compareHash(payload, hashed) {
  return bcrypt.compare(payload, hashed);
}

module.exports = {
  generateHash,
  compareHash,
};
