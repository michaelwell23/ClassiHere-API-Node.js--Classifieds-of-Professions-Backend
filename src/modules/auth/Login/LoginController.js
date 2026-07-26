const AppError = require('../../../shared/errors/AppError');

const authConfig = require('../../../config/auth');

const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../repositories/UserRefreshTokenRepository');

const UserResponseDTO = require('../../users/user-response.dto');

const { compareHash } = require('../../../shared/providers/hash/bcrypt.provider');

const {
  generateAccessToken,
  generateRefreshToken,
  generateJti,
  hashRefreshToken,
} = require('../providers/jwt.provider');

class LoginService {
  async execute({ email, password }) {
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

    const passwordMatches = await compareHash(password, user.password);

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

    const jti = generateJti();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, jti);

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      token: hashRefreshToken(refreshToken),
    });

    const updatedUser = await UserRepository.update(user, {
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: now,
    });

    return {
      user: UserResponseDTO(updatedUser),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }
}

module.exports = new LoginService();
