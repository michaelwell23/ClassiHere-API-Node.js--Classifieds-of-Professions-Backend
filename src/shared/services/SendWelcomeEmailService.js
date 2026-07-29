const { sendMail } = require('../providers/mail/smtp.provider');

const welcomeTemplate = require('../../templates/mail/users/welcome.template');

class SendWelcomeEmailService {
  async execute({ user }) {
    const message = welcomeTemplate({
      userName: user.first_name || user.name || 'usuário',
    });

    return sendMail({
      to: user.email,
      ...message,
    });
  }
}

module.exports = new SendWelcomeEmailService();
