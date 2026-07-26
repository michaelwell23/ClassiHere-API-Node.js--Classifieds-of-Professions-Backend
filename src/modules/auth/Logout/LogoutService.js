const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const { hashRefreshToken } = require('../providers/jwt.provider');

class LogoutService {
  async execute({ refresh_token }) {
    const session = await UserRefreshTokenRepository.findByTokenHash(
      hashRefreshToken(refresh_token)
    );

    if (session) {
      await UserRefreshTokenRepository.deleteById(session.id);
    }

    return {
      message: 'Logout completed successfully.',
    };
  }
}

module.exports = new LogoutService();
