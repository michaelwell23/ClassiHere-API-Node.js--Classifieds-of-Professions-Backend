const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');

const UserRefreshTokenRepository = require('../../sessions/repositories/UserRefreshTokenRepository');

const { compareHash, generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../../../shared/providers/auth/jwt.provider');

class RefreshTokenService {
  async execute(refreshToken) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await UserRepository.findById(payload.sub);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    const sessions = await UserRefreshTokenRepository.findAllByUser(user.id);

    let currentSession = null;

    for (const session of sessions) {
      const match = await compareHash(refreshToken, session.token);

      if (match) {
        currentSession = session;

        break;
      }
    }

    if (!currentSession) {
      throw new AppError('Refresh token revoked', 401);
    }

    if (currentSession.expires_at < new Date()) {
      throw new AppError('Refresh token expired', 401);
    }

    const newAccessToken = generateAccessToken({
      sub: user.id,
    });

    const newRefreshToken = generateRefreshToken({
      sub: user.id,
    });

    const newHash = await generateHash(newRefreshToken);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    await UserRefreshTokenRepository.delete(currentSession.id);

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      token: newHash,
      expires_at: expiresAt,
    });

    return {
      access_token: newAccessToken,

      refresh_token: newRefreshToken,
    };
  }
}

module.exports = new RefreshTokenService();
