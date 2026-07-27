const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const { compareHash, generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

class ChangePasswordService {
  async execute({ authenticatedUserId, currentPassword, newPassword }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const currentPasswordMatches = await compareHash(currentPassword, user.password);

    if (!currentPasswordMatches) {
      throw new AppError('Current password is invalid.', 400);
    }

    const newPasswordMatchesCurrent = await compareHash(newPassword, user.password);

    if (newPasswordMatchesCurrent) {
      throw new AppError('New password must be different from current password.', 400);
    }

    const passwordHash = await generateHash(newPassword);

    await UserRepository.update(user, {
      password: passwordHash,
      failed_login_attempts: 0,
      locked_until: null,
    });

    await UserRefreshTokenRepository.deleteAllByUserId(user.id);

    return {
      message: 'Password changed successfully. All sessions were revoked.',
    };
  }
}

module.exports = new ChangePasswordService();
