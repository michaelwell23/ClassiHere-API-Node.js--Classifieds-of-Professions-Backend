const AppError = require('../../../../shared/errors/AppError');

const UserRepository = require('../../../users/Repositories/UserRepository');

const UserRefreshTokenRepository = require('../../Repositories/UserRefreshTokenRepository');

const { compareHash, generateHash } = require('../../../../shared/providers/hash/bcrypt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateJti,
} = require('../../../../shared/providers/auth/jwt.provider');

class RefreshTokenService {
  async execute(refreshToken) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await UserRepository.findById(payload.sub);

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (!user) {
      throw new AppError('User not found', 401);
    }

    const session = await UserRefreshTokenRepository.findByJti(payload.jti);

    if (!session) {
      throw new AppError('Session not found', 401);
    }

    const match = await compareHash(refreshToken, session.token_hash);

    if (!match) {
      throw new AppError('Refresh token revoked', 401);
    }

    const newJti = generateJti();

    const newAccessToken = generateAccessToken({
      sub: user.id,
    });

    const newRefreshToken = generateRefreshToken({
      sub: user.id,
      jti: newJti,
    });

    await UserRepository.updateLastLogin(user.id);

    const newHash = await generateHash(newRefreshToken);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    await UserRefreshTokenRepository.delete(session.id);

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      jti: newJti,
      token_hash: newHash,
      expires_at: expiresAt,
    });

    return {
      tokens: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
    };
  }
}

module.exports = new RefreshTokenService();
