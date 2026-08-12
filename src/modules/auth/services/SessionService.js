const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');

const userResponseDTO = require('../../users/dtos/user-response.dto');

const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const { comparePassword } = require('../../../shared/providers/hash/bcrypt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  hashRefreshToken,
  compareRefreshTokenHash,
  verifyRefreshToken,
} = require('../providers/jwt.provider');

class SessionService {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    const now = new Date();

    if (user.locked_until && user.locked_until > now) {
      throw new AppError('Account temporarily locked due to multiple failed login attempts.', 423);
    }

    let failedLoginAttempts = user.failed_login_attempts || 0;

    if (user.locked_until && user.locked_until <= now) {
      failedLoginAttempts = 0;

      await UserRepository.update(user, {
        failed_login_attempts: 0,
        locked_until: null,
      });
    }

    const passwordMatches = await comparePassword(password, user.password_hash);

    if (!passwordMatches) {
      const attempts = failedLoginAttempts + 1;

      if (attempts >= authConfig.loginSecurity.maxAttempts) {
        const lockedUntil = new Date(
          now.getTime() + authConfig.loginSecurity.lockDurationMinutes * 60 * 1000
        );

        await UserRepository.update(user, {
          failed_login_attempts: attempts,

          locked_until: lockedUntil,
        });

        throw new AppError(
          'Account temporarily locked due to multiple failed login attempts.',
          423
        );
      }

      await UserRepository.update(user, {
        failed_login_attempts: attempts,

        locked_until: null,
      });

      throw new AppError('Invalid email or password.', 401);
    }

    if (user.failed_login_attempts > 0 || user.locked_until) {
      await UserRepository.update(user, {
        failed_login_attempts: 0,
        locked_until: null,
      });
    }

    if (!user.is_email_verified) {
      throw new AppError('Email verification is required.', 403);
    }

    const jti = generateJti();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, jti);

    const refreshTokenPayload = verifyRefreshToken(refreshToken);
    await UserRefreshTokenRepository.create({
      user_id: user.id,
      jti,
      token_hash: hashRefreshToken(refreshToken),
      expires_at: new Date(refreshTokenPayload.exp * 1000),
    });

    const updatedUser = await UserRepository.update(user, {
      last_login_at: now,
    });

    return {
      user: userResponseDTO(updatedUser),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  async logout({ refresh_token }) {
    const tokenHash = hashRefreshToken(refresh_token);
    const session = await UserRefreshTokenRepository.findByTokenHash(tokenHash);

    if (session) {
      await UserRefreshTokenRepository.deleteById(session.id);
    }

    return {
      message: 'Logout completed successfully.',
    };
  }

  async logoutAll({ authenticatedUserId }) {
    await UserRefreshTokenRepository.deleteAllByUserId(authenticatedUserId);
    return {
      message: 'All sessions have been revoked successfully.',
    };
  }

  async getCurrentUser({ authenticatedUserId }) {
    const user = await UserRepository.findById(authenticatedUserId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return {
      user: userResponseDTO(user),
    };
  }

  async refresh({ refresh_token }) {
    let payload;

    try {
      payload = verifyRefreshToken(refresh_token);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const session = await UserRefreshTokenRepository.findByJti(payload.jti);

    if (!session) {
      throw new AppError('Invalid or revoked refresh token.', 401);
    }

    const tokenMatches = compareRefreshTokenHash(refresh_token, session.token_hash);

    if (!tokenMatches) {
      throw new AppError('Invalid or revoked refresh token.', 401);
    }

    if (session.user_id !== payload.sub) {
      throw new AppError('Invalid refresh token.', 401);
    }

    if (session.expires_at <= new Date()) {
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

    if (!user.is_email_verified) {
      await UserRefreshTokenRepository.deleteAllByUserId(user.id);

      throw new AppError('Email verification is required.', 403);
    }

    const newJti = generateJti();
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id, newJti);
    const newRefreshPayload = verifyRefreshToken(newRefreshToken);
    const rotatedSession = await UserRefreshTokenRepository.rotate(session.id, {
      user_id: user.id,
      jti: newJti,
      token_hash: hashRefreshToken(newRefreshToken),
      expires_at: new Date(newRefreshPayload.exp * 1000),
    });

    if (!rotatedSession) {
      throw new AppError('Refresh token has already been used.', 401);
    }

    return {
      tokens: {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
    };
  }
}

module.exports = new SessionService();
