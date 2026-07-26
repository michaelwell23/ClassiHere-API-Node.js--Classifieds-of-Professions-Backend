const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

class LogoutAllService {
  async execute({ authenticatedUserId }) {
    await UserRefreshTokenRepository.deleteAllByUserId(authenticatedUserId);

    return {
      message: 'All sessions have been revoked successfully.',
    };
  }
}

module.exports = new LogoutAllService();
