const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  hashRefreshToken,
  verifyRefreshToken,
} = require('../providers/jwt.provider');

class RefreshTokenService {
  async execute({ refresh_token }) {
    let payload;

    try {
      payload = verifyRefreshToken(refresh_token);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    if (!payload.sub || !payload.jti) {
      throw new AppError('Invalid refresh token.', 401);
    }

    const session = await UserRefreshTokenRepository.findByJti(payload.jti);

    if (!session) {
      throw new AppError('Invalid or revoked refresh token.', 401);
    }

    if (session.token_hash !== hashRefreshToken(refresh_token)) {
      throw new AppError('Invalid or revoked refresh token.', 401);
    }

    if (session.user_id !== payload.sub) {
      throw new AppError('Invalid refresh token.', 401);
    }

    if (session.expires_at && session.expires_at <= new Date()) {
      await UserRefreshTokenRepository.deleteById(session.id);

      throw new AppError('Refresh token expired.', 401);
    }

    const user = await UserRepository.findById(payload.sub);

    if (!user) {
      await UserRefreshTokenRepository.deleteById(session.id);

      throw new AppError('Invalid refresh token.', 401);
    }

    if (!user.is_active) {
      await UserRefreshTokenRepository.deleteAllByUserId(user.id);

      throw new AppError('User account is deactivated.', 403);
    }

    const newJti = generateJti();

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id, newJti);

    const newPayload = verifyRefreshToken(newRefreshToken);

    const rotatedSession = await UserRefreshTokenRepository.rotate(session.id, {
      user_id: user.id,
      jti: newJti,
      token_hash: hashRefreshToken(newRefreshToken),
      expires_at: new Date(newPayload.exp * 1000),
    });

    if (!rotatedSession) {
      throw new AppError('Refresh token has already been used.', 401);
    }

    return {
      tokens: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      },
    };
  }
}

module.exports = new RefreshTokenService();
