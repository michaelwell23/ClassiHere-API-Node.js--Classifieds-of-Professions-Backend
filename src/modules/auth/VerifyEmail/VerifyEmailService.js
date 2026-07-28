const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const UserVerificationRepository = require('../repositories/UserVerificationRepository');

const { hashOpaqueToken } = require('../providers/opaque-token.provider');

class VerifyEmailService {
  async execute({ token }) {
    const tokenHash = hashOpaqueToken(token);

    const verification = await UserVerificationRepository.findActiveByTokenHash(tokenHash);

    if (!verification) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    const user = await UserRepository.findById(verification.user_id);

    if (!user || !user.is_active) {
      throw new AppError('Invalid or expired verification token.', 400);
    }

    if (user.is_email_verified) {
      await UserVerificationRepository.invalidateAllByUserId(user.id);

      return {
        message: 'Email is already verified.',
      };
    }

    await database.transaction(async (transaction) => {
      const tokenConsumed = await UserVerificationRepository.markAsUsed(verification.id, {
        transaction,
      });

      if (!tokenConsumed) {
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
}

module.exports = new VerifyEmailService();
