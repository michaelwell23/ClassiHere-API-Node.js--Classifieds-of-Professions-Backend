const environment = require('../../config/environment');

const verifyEmailTemplate = require('../providers/mail/templates/verify-email.template');

const { sendMail } = require('../providers/mail/smtp.provider');

class SendVerificationEmailService {
  async execute({ user, token }) {
    const verificationUrl = `${environment.appUrl}/verify-email?token=${token}`;

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
