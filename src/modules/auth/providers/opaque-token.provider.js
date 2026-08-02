const { createHash, randomBytes, timingSafeEqual } = require('crypto');

function generateOpaqueToken(byteLength = 32) {
  if (!Number.isInteger(byteLength) || byteLength < 16) {
    throw new TypeError('Opaque token byte length must be an integer greater than or equal to 16.');
  }

  return randomBytes(byteLength).toString('hex');
}

function hashOpaqueToken(token) {
  if (typeof token !== 'string' || !token) {
    throw new TypeError('Opaque token must be a non-empty string.');
  }

  return createHash('sha256').update(token).digest('hex');
}

function compareOpaqueToken(token, storedHash) {
  if (typeof token !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const calculatedHash = hashOpaqueToken(token);

  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (calculatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, storedBuffer);
}

module.exports = {
  generateOpaqueToken,
  hashOpaqueToken,
  compareOpaqueToken,
};
