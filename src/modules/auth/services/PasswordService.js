const database = require('../../../database');

const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');

const PasswordResetTokenRepository = require('../repositories/PasswordResetTokenRepository');

const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const SendPasswordResetEmailService = require('../mail/SendPasswordResetEmailService');

const { hashPassword, comparePassword } = require('../../../shared/providers/hash/bcrypt.provider');

const {
  generateOpaqueToken,
  hashOpaqueToken,
  compareOpaqueToken,
} = require('../providers/opaque-token.provider');

const passwordResetResponse = {
  message: 'If the email exists, password recovery instructions have been sent.',
};

class PasswordService {
  async change({ authenticatedUserId, currentPassword, newPassword }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const currentPasswordMatches = await comparePassword(currentPassword, user.password_hash);

    if (!currentPasswordMatches) {
      throw new AppError('Current password is invalid.', 400);
    }

    const newPasswordMatchesCurrent = await comparePassword(newPassword, user.password_hash);

    if (newPasswordMatchesCurrent) {
      throw new AppError('New password must be different from current password.', 400);
    }

    const passwordHash = await hashPassword(newPassword);

    await database.transaction(async (transaction) => {
      await UserRepository.update(
        user,
        {
          password_hash: passwordHash,
          failed_login_attempts: 0,
          locked_until: null,
        },
        {
          transaction,
        }
      );

      await UserRefreshTokenRepository.deleteAllByUserId(user.id, {
        transaction,
      });
    });

    return {
      message: 'Password changed successfully. All sessions were revoked.',
    };
  }

  async requestReset({ email }) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !user.is_active) {
      return passwordResetResponse;
    }

    const token = generateOpaqueToken();

    const tokenHash = hashOpaqueToken(token);

    const expiresAt = new Date(Date.now() + authConfig.passwordReset.expiresInMinutes * 60 * 1000);

    await PasswordResetTokenRepository.invalidateAllByUserId(user.id);

    const resetToken = await PasswordResetTokenRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    try {
      await SendPasswordResetEmailService.execute({
        user,
        resetId: resetToken.id,
        token,
      });
    } catch (error) {
      await PasswordResetTokenRepository.markAsUsed(resetToken.id);

      throw error;
    }

    return passwordResetResponse;
  }

  async reset({ resetId, token, password }) {
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

    const newPasswordMatchesCurrent = await comparePassword(password, user.password_hash);

    if (newPasswordMatchesCurrent) {
      throw new AppError('New password must be different from current password.', 400);
    }

    const passwordHash = await hashPassword(password);

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
          password_hash: passwordHash,
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

module.exports = new PasswordService();
