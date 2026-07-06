const AppError = require('../../../shared/errors/AppError');
const UserRepository = require('../repositories/UserRepository');
const UserRefreshTokenRepository = require('../../auth/repositories/UserRefreshTokenRepository');

class ChangeAccountStatusService {
  async execute({ id, action }) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (action === 'deactivate') {
      if (!user.is_active) {
        throw new AppError('User account is already deactivated.', 400);
      }

      await user.update({
        is_active: false,
        deactivated_at: new Date(),
      });

      await UserRefreshTokenRepository.deleteAllByUserId(user.id);

      return {
        message: 'User account deactivated successfully.',
      };
    }

    if (user.is_active) {
      throw new AppError('User account is already active.', 400);
    }

    await user.update({
      is_active: true,
      deactivated_at: null,
    });

    return {
      message: 'User account reactivated successfully.',
    };
  }
}

module.exports = new ChangeAccountStatusService();
