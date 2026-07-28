const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');

const UserPhoneVerificationRepository = require('../repositories/UserPhoneVerificationRepository');

const { comparePhoneVerificationCode } = require('../providers/phone-verification-code.provider');

class VerifyPhoneService {
  async execute({ authenticatedUserId, code }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (user.is_phone_verified) {
      return {
        message: 'Phone number is already verified.',
      };
    }

    const verification = await UserPhoneVerificationRepository.findLatestPendingByUserId(user.id);

    if (!verification) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    if (verification.expires_at <= new Date()) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    if (verification.attempts >= authConfig.phoneVerification.maxAttempts) {
      throw new AppError('Verification code attempt limit exceeded. Request a new code.', 429);
    }

    const codeMatches = comparePhoneVerificationCode(code, verification.code_hash);

    if (!codeMatches) {
      await UserPhoneVerificationRepository.incrementAttempts(verification.id);

      throw new AppError('Invalid or expired verification code.', 400);
    }

    await database.transaction(async (transaction) => {
      const verificationConsumed = await UserPhoneVerificationRepository.markAsVerified(
        verification.id,
        {
          transaction,
        }
      );

      if (!verificationConsumed) {
        throw new AppError('Verification code has already been used.', 400);
      }

      await UserRepository.update(
        user,
        {
          is_phone_verified: true,
        },
        {
          transaction,
        }
      );

      await UserPhoneVerificationRepository.invalidatePendingByUserIdExcept(
        user.id,
        verification.id,
        {
          transaction,
        }
      );
    });

    return {
      message: 'Phone verified successfully.',
    };
  }
}

module.exports = new VerifyPhoneService();
