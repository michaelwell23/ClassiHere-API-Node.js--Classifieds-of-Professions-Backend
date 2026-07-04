const AppError = require('../../../../shared/errors/AppError');
const UserPhoneVerificationRepository = require('../../Repositories/UserPhoneVerificationRepository');
const UserRepository = require('../../../users/repositories/UserRepository');

class VerifyPhoneService {
  async execute({ userId, code }) {
    const verification = await UserPhoneVerificationRepository.findValidCode(userId, code);

    if (!verification) {
      throw new AppError('Invalid verification code.', 400);
    }

    if (verification.expires_at < new Date()) {
      throw new AppError('Verification code has expired.', 400);
    }

    verification.verified_at = new Date();

    await UserPhoneVerificationRepository.save(verification);

    await UserRepository.update(userId, {
      is_phone_verified: true,
    });

    return {
      success: true,
      message: 'Phone verified successfully.',
    };
  }
}

module.exports = new VerifyPhoneService();
