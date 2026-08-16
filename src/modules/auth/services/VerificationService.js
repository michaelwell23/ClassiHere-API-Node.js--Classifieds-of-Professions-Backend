const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const UserVerificationRepository = require('../repositories/UserVerificationRepository');

const UserPhoneVerificationRepository = require('../repositories/UserPhoneVerificationRepository');

const { hashOpaqueToken } = require('../providers/opaque-token.provider');

const { comparePhoneVerificationCode } = require('../providers/phone-verification-code.provider');

class VerificationService {
  async verifyEmail({ token }) {
    const tokenHash = hashOpaqueToken(token);

    const verification = await UserVerificationRepository.findActiveByTokenHash(tokenHash);

    if (!verification) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    const user = await UserRepository.findById(verification.user_id);

    if (!user) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (user.is_email_verified) {
      await UserVerificationRepository.invalidateAllByUserId(user.id);

      return {
        message: 'Email is already verified.',
      };
    }

    await database.transaction(async (transaction) => {
      const consumed = await UserVerificationRepository.markAsUsed(verification.id, {
        transaction,
      });

      if (!consumed) {
        throw new AppError('Verification token has already been used.', 400);
      }

      await UserRepository.update(
        user,
        {
          is_email_verified: true,
        },
        {
          transaction,
        }
      );

      await UserVerificationRepository.invalidateOthersByUserId(user.id, verification.id, {
        transaction,
      });
    });

    return {
      message: 'Email verified successfully.',
    };
  }

  async verifyPhone({ authenticatedUserId, code }) {
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

    const verification = await UserPhoneVerificationRepository.findLatestPendingByUserId(user.id);

    if (!verification) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    if (verification.expires_at <= new Date()) {
      throw new AppError('Invalid or expired verification code.', 400);
    }

    const maxAttempts = 5;

    if (verification.attempts >= maxAttempts) {
      throw new AppError('Verification code attempt limit exceeded.', 429);
    }

    const codeMatches = comparePhoneVerificationCode(code, verification.code_hash);

    if (!codeMatches) {
      const nextAttempt = verification.attempts + 1;

      await UserPhoneVerificationRepository.incrementAttempts(verification.id);

      if (nextAttempt >= maxAttempts) {
        throw new AppError('Verification code attempt limit exceeded.', 429);
      }

      throw new AppError('Invalid verification code.', 400);
    }

    await database.transaction(async (transaction) => {
      const consumed = await UserPhoneVerificationRepository.markAsVerified(verification.id, {
        transaction,
      });

      if (!consumed) {
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

module.exports = new VerificationService();
