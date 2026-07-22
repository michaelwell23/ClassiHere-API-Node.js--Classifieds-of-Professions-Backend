const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

const UserRefreshTokenRepository = require('../../auth/repositories/UserRefreshTokenRepository');

class ChangeAccountStatusService {
  async execute({ id, authenticatedUserId }) {
    if (id !== authenticatedUserId) {
      throw new AppError('You are not allowed to deactivate this user', 403);
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.is_active) {
      throw new AppError('User account is already deactivated', 409);
    }

    await UserRefreshTokenRepository.deleteAllByUserId(user.id);

    await UserRepository.update(user, {
      is_active: false,
      deactivated_at: new Date(),
    });

    return {
      message: 'User account deactivated successfully',
    };
  }
}

module.exports = new ChangeAccountStatusService();
