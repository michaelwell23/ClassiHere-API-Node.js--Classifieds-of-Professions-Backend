const UserRepository = require('../../../users/repositories/UserRepository');
const PasswordResetTokenRepository = require('../../Repositories/PasswordResetTokenRepository');

const AppError = require('../../../../shared/errors/AppError');
const { compareHash, generateHash } = require('../../../../shared/providers/hash/bcrypt.provider');

class ResetPasswordService {
  async execute({ email, token, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid token', 400);
    }

    const activeTokens = await PasswordResetTokenRepository.findActiveByUser(user.id);

    let validToken = null;

    for (const resetToken of activeTokens) {
      const match = await compareHash(token, resetToken.token_hash);

      if (match) {
        validToken = resetToken;

        break;
      }
    }

    if (!validToken) {
      throw new AppError('Invalid token', 400);
    }

    if (validToken.expires_at < new Date()) {
      throw new AppError('Expired token', 400);
    }

    const passwordHash = await generateHash(password);

    await UserRepository.update(user, {
      password: passwordHash,
      failed_login_attempts: 0,
      locked_until: null,
    });

    await PasswordResetTokenRepository.invalidateAllByUser(user.id);

    return {
      message: 'Password updated successfully',
    };
  }
}

module.exports = new ResetPasswordService();
