const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const UserRefreshTokenRepository = require('../../sessions/repositories/UserRefreshTokenRepository');

class LogoutAllService {
  async execute(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await UserRefreshTokenRepository.deleteAllByUser(userId);

    return {
      message: 'All sessions have been revoked successfully',
    };
  }
}

module.exports = new LogoutAllService();
