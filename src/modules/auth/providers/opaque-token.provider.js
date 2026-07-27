const { createHash, randomBytes, timingSafeEqual } = require('crypto');

function generateOpaqueToken(size = 32) {
  return randomBytes(size).toString('hex');
}

function hashOpaqueToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function compareOpaqueToken(token, storedHash) {
  if (!token || !storedHash) {
    return false;
  }

  const tokenHash = hashOpaqueToken(token);

  const tokenBuffer = Buffer.from(tokenHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (tokenBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, storedBuffer);
}

module.exports = {
  generateOpaqueToken,
  hashOpaqueToken,
  compareOpaqueToken,
};
