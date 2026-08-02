const { createHmac, randomInt, timingSafeEqual } = require('crypto');

const authConfig = require('../../../config/auth');

function generatePhoneVerificationCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashPhoneVerificationCode(code) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    throw new TypeError('Phone verification code must contain exactly 6 digits.');
  }

  return createHmac('sha256', authConfig.phoneVerification.codeSecret).update(code).digest('hex');
}

function comparePhoneVerificationCode(code, storedHash) {
  if (typeof code !== 'string' || typeof storedHash !== 'string' || !/^\d{6}$/.test(code)) {
    return false;
  }

  const calculatedHash = hashPhoneVerificationCode(code);

  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (calculatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, storedBuffer);
}

module.exports = {
  generatePhoneVerificationCode,
  hashPhoneVerificationCode,
  comparePhoneVerificationCode,
};
