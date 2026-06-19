const UserRepository = require('../../users/repositories/UserRepository');
const PasswordResetTokenRepository = require('../../password-reset/repositories/PasswordResetTokenRepository');

const AppError = require('../../../shared/errors/AppError');
const { compareHash, generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

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

    await UserRepository.update(user.id, {
      password: passwordHash,
    });

    await PasswordResetTokenRepository.markAsUsed(validToken.id);

    return {
      message: 'Password updated successfully',
    };
  }
}

module.exports = new ResetPasswordService();
