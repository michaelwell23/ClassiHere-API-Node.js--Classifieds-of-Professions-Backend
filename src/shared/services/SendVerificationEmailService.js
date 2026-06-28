const mailConfig = require('../../config/mail');

const { sendMail } = require('../providers/mail/smtp.provider');

const verifyEmailTemplate = require('../providers/mail/templates/verify-email.template');

class SendVerificationEmailService {
  async execute({ user, token }) {
    const verificationUrl = `${mailConfig.appUrl}` + `/auth/verify-email/${token}`;

    const html = verifyEmailTemplate({
      firstName: user.first_name,
      verificationUrl,
    });

    await sendMail({
      to: user.email,
      subject: 'Confirme seu e-mail',
      html,
    });
  }
}

module.exports = new SendVerificationEmailService();
