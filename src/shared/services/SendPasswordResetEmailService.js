const environment = require('../../config/environment');
const authConfig = require('../../config/auth');

const { sendMail } = require('../providers/mail/smtp.provider');

const passwordResetTemplate = require('../../templates/mail/users/password-reset.template');

class SendPasswordResetEmailService {
  async execute({ user, resetId, token }) {
    const resetUrl = new URL('/reset-password', environment.frontendUrl);

    resetUrl.searchParams.set('id', resetId);
    resetUrl.searchParams.set('token', token);

    const message = passwordResetTemplate({
      userName: user.first_name || user.name || 'usuário',
      resetLink: resetUrl.toString(),
      expiresInMinutes: authConfig.passwordReset.expiresInMinutes,
    });

    return sendMail({
      to: user.email,
      ...message,
    });
  }
}

module.exports = new SendPasswordResetEmailService();
