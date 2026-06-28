const AppError = require('../../../../shared/errors/AppError');

const { compareHash } = require('../../../../shared/providers/hash/bcrypt.provider');

const UserRefreshTokenRepository = require('../../Repositories/UserRefreshTokenRepository');

class LogoutService {
  async execute(refreshToken) {
    const sessions = await UserRefreshTokenRepository.findAll();

    let currentSession = null;

    for (const session of sessions) {
      const match = await compareHash(refreshToken, session.token);

      if (match) {
        currentSession = session;

        break;
      }
    }

    if (!currentSession) {
      throw new AppError('Session not found', 404);
    }

    await UserRefreshTokenRepository.delete(currentSession.id);

    return {
      message: 'Logout successfully',
    };
  }
}

module.exports = new LogoutService();
