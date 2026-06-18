const { randomBytes } = require('crypto');

const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../../users/repositories/UserRepository');
const PasswordResetTokenRepository = require('../../password-reset/repositories/PasswordResetTokenRepository');

const { generateHash } = require('../../../shared/providers/hash/bcrypt.provider');

class ForgotPasswordService {
  async execute(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await PasswordResetTokenRepository.invalidateAllByUser(user.id);

    const token = randomBytes(32).toString('hex');

    const tokenHash = await generateHash(token);

    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 1);

    await PasswordResetTokenRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    return {
      message: 'Password recovery request created successfully',

      token,
    };
  }
}

module.exports = new ForgotPasswordService();
