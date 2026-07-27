const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const PasswordResetTokenRepository = require('../repositories/PasswordResetTokenRepository');

const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const { compareHash, generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

const { compareOpaqueToken } = require('../providers/opaque-token.provider');

class ResetPasswordService {
  async execute({ resetId, token, password }) {
    const resetToken = await PasswordResetTokenRepository.findActiveById(resetId);

    if (!resetToken) {
      throw new AppError('Invalid or expired password reset token.', 400);
    }

    const tokenMatches = compareOpaqueToken(token, resetToken.token_hash);

    if (!tokenMatches) {
      throw new AppError('Invalid or expired password reset token.', 400);
    }

    const user = await UserRepository.findById(resetToken.user_id);

    if (!user || !user.is_active) {
      throw new AppError('Invalid or expired password reset token.', 400);
    }

    const samePassword = await compareHash(password, user.password);

    if (samePassword) {
      throw new AppError('New password must be different from current password.', 400);
    }

    const passwordHash = await generateHash(password);

    await database.transaction(async (transaction) => {
      const tokenConsumed = await PasswordResetTokenRepository.markAsUsed(resetToken.id, {
        transaction,
      });

      if (!tokenConsumed) {
        throw new AppError('Password reset token has already been used.', 400);
      }

      await UserRepository.update(
        user,
        {
          password: passwordHash,
          failed_login_attempts: 0,
          locked_until: null,
        },
        {
          transaction,
        }
      );

      await PasswordResetTokenRepository.invalidateOthersByUserId(user.id, resetToken.id, {
        transaction,
      });

      await UserRefreshTokenRepository.deleteAllByUserId(user.id, {
        transaction,
      });
    });

    return {
      message: 'Password updated successfully. All sessions were revoked.',
    };
  }
}

module.exports = new ResetPasswordService();
