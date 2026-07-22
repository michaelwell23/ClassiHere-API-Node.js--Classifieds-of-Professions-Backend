const AppError = require('../../../shared/errors/AppError');
const UserRepository = require('../../users/repositories/UserRepository');
const UserRefreshTokenRepository = require('../Repositories/UserRefreshTokenRepository');

const authConfig = require('../../../config/auth');

const { compareHash } = require('../../../shared/providers/hash/bcrypt.provider');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../../shared/providers/jwt.auth.provider');

class LoginService {
  async execute({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!user.is_active) {
      throw new AppError('User account is deactivated.', 403);
    }

    if (user.locked_until && user.locked_until > new Date()) {
      throw new AppError('Account temporarily locked due to multiple failed login attempts.', 423);
    }

    const passwordMatches = await compareHash(password, user.password);

    if (!passwordMatches) {
      const attempts = user.failed_login_attempts + 1;

      if (attempts >= authConfig.accountLock.maxFailedAttempts) {
        const lockedUntil = new Date();

        lockedUntil.setMinutes(lockedUntil.getMinutes() + authConfig.accountLock.lockDuration);

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
      });

      throw new AppError('Invalid email or password.', 401);
    }

    if (user.failed_login_attempts > 0 || user.locked_until) {
      await UserRepository.update(user, {
        failed_login_attempts: 0,
        locked_until: null,
      });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    await UserRefreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
    });

    await UserRepository.update(user, {
      last_login_at: new Date(),
    });

    return {
      user: user,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }
}

module.exports = new LoginService();
