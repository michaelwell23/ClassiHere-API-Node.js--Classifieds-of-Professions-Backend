const environment = require('../../../config/environment');

const authConfig = require('../../../config/auth');

const { sendMail } = require('../../../shared/providers/mail/smtp.provider');

const verifyEmailTemplate = require('./templates/verify-email.template');

class SendVerificationEmailService {
  async execute({ user, token }) {
    const baseUrl = environment.appUrl.replace(/\/+$/, '');

    const verificationUrl = `${baseUrl}/auth/verify-email/${token}`;

    const message = verifyEmailTemplate({
      userName: user.first_name,

      verificationLink: verificationUrl,

      expiresInHours: authConfig.emailVerification.expiresInHours,
    });

    return sendMail({
      to: user.email,
      ...message,
    });
  }
}

module.exports = new SendVerificationEmailService();
