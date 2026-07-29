const UserRepository = require('../../users/repositories/UserRepository');
const PasswordResetTokenRepository = require('../repositories/PasswordResetTokenRepository');

const authConfig = require('../../../config/auth');

const { generateOpaqueToken, hashOpaqueToken } = require('../providers/opaque-token.provider');

const SendPasswordResetEmailService = require('../../../shared/services/SendPasswordResetEmailService');

const genericResponse = {
  message: 'If the email exists, password recovery instructions have been sent.',
};

class ForgotPasswordService {
  async execute({ email }) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !user.is_active) {
      return genericResponse;
    }

    await PasswordResetTokenRepository.invalidateAllByUserId(user.id);

    const token = generateOpaqueToken();
    const tokenHash = hashOpaqueToken(token);

    const expiresAt = new Date(Date.now() + authConfig.passwordReset.expiresInMinutes * 60 * 1000);

    const resetToken = await PasswordResetTokenRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    try {
      await SendPasswordResetEmailService.execute({
        user,
        resetId: resetToken.id,
        token,
      });
    } catch (error) {
      await PasswordResetTokenRepository.markAsUsed(resetToken.id);

      throw error;
    }

    return genericResponse;
  }
}

module.exports = new ForgotPasswordService();
