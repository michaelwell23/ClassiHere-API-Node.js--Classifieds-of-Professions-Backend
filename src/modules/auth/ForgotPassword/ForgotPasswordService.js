const UserRepository = require('../../users/repositories/UserRepository');
const PasswordResetTokenRepository = require('../repositories/PasswordResetTokenRepository');

const authConfig = require('../../../config/auth');
const environment = require('../../../config/environment');

const { generateOpaqueToken, hashOpaqueToken } = require('../providers/opaque-token.provider');

const { sendMail } = require('../../../shared/providers/mail/smtp.provider');

const passwordResetTemplate = require('../../../templates/mail/users/password-reset.template');

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

    const resetUrl = new URL('/reset-password', environment.frontendUrl);

    resetUrl.searchParams.set('id', resetToken.id);
    resetUrl.searchParams.set('token', token);

    const message = passwordResetTemplate({
      userName: user.name,
      resetLink: resetUrl.toString(),
      expiresInMinutes: authConfig.passwordReset.expiresInMinutes,
    });

    try {
      await sendMail({
        to: user.email,
        ...message,
      });
    } catch (error) {
      await PasswordResetTokenRepository.markAsUsed(resetToken.id);

      throw error;
    }

    return genericResponse;
  }
}

module.exports = new ForgotPasswordService();
