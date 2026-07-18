const AppError = require('../../../../shared/errors/AppError');
const UserPhoneVerificationRepository = require('../../Repositories/UserPhoneVerificationRepository');
const UserRepository = require('../../../users/repositories/UserRepository');

class VerifyPhoneService {
  async execute({ userId, code }) {
    const verification = await UserPhoneVerificationRepository.findByUserIdAndCode(userId, code);

    if (!verification) {
      throw new AppError('Invalid verification code.', 400);
    }

    if (verification.verified_at) {
      throw new AppError('Verification code has already been used.', 400);
    }

    if (verification.expires_at < new Date()) {
      throw new AppError('Verification code has expired.', 400);
    }

    await UserPhoneVerificationRepository.invalidate(verification.id);

    const user = await UserRepository.findById(userId);

    await user.update({
      is_phone_verified: true,
    });

    return {
      message: 'Phone verified successfully.',
    };
  }
}

module.exports = new VerifyPhoneService();
