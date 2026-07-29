const environment = require('../../config/environment');
const authConfig = require('../../config/auth');

const { sendMail } = require('../providers/mail/smtp.provider');

const verifyEmailTemplate = require('../../templates/mail/users/verify-email.template');

class SendVerificationEmailService {
  async execute({ user, token }) {
    const verificationUrl = new URL('/verify-email', environment.frontendUrl);

    verificationUrl.searchParams.set('token', token);

    const message = verifyEmailTemplate({
      userName: user.first_name || user.name || 'usuário',
      verificationLink: verificationUrl.toString(),
      expiresInHours: authConfig.emailVerification.expiresInHours,
    });

    return sendMail({
      to: user.email,
      ...message,
    });
  }
}

module.exports = new SendVerificationEmailService();
