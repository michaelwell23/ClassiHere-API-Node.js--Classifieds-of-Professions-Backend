const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');

const UserPhoneVerificationRepository = require('../repositories/UserPhoneVerificationRepository');

const LocalPhoneProvider = require('../../../shared/providers/phone/local.provider');

const {
  generatePhoneVerificationCode,
  hashPhoneVerificationCode,
} = require('../providers/phone-verification-code.provider');

class SendPhoneVerificationService {
  async execute({ authenticatedUserId }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (!user.phone) {
      throw new AppError('User does not have a phone number.', 400);
    }

    if (user.is_phone_verified) {
      return {
        message: 'Phone number is already verified.',
      };
    }

    const resendThreshold = new Date(
      Date.now() - authConfig.phoneVerification.resendIntervalSeconds * 1000
    );

    const recentVerification = await UserPhoneVerificationRepository.findRecentPendingByUserId(
      user.id,
      resendThreshold
    );

    if (recentVerification) {
      throw new AppError('Please wait before requesting another verification code.', 429);
    }

    const code = generatePhoneVerificationCode();

    const verification = await UserPhoneVerificationRepository.create({
      user_id: user.id,
      code_hash: hashPhoneVerificationCode(code),
      expires_at: new Date(Date.now() + authConfig.phoneVerification.expiresInMinutes * 60 * 1000),
      attempts: 0,
    });

    try {
      await LocalPhoneProvider.send({
        phone: user.phone,
        code,
        expiresAt: verification.expires_at,
      });
    } catch (error) {
      await UserPhoneVerificationRepository.deleteById(verification.id);

      throw error;
    }

    await UserPhoneVerificationRepository.invalidatePendingByUserIdExcept(user.id, verification.id);

    return {
      message: 'Verification code sent successfully.',
    };
  }
}

module.exports = new SendPhoneVerificationService();
