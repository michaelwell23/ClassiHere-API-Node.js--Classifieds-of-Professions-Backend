const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const { compareHash, generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

class ChangePasswordService {
  async execute({ userId, currentPassword, newPassword }) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const passwordMatches = await compareHash(currentPassword, user.password);

    if (!passwordMatches) {
      throw new AppError('Current password is invalid', 400);
    }

    const samePassword = await compareHash(newPassword, user.password);

    if (samePassword) {
      throw new AppError('New password must be different from current password', 400);
    }

    const passwordHash = await generateHash(newPassword);

    await UserRepository.update(user.id, {
      password: passwordHash,
    });

    return {
      message: 'Password changed successfully',
    };
  }
}

module.exports = new ChangePasswordService();
