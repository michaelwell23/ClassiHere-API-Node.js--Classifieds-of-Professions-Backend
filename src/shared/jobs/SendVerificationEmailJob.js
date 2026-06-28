const logger = console;

const SendVerificationEmailService = require('../../shared/services/SendVerificationEmailService');

class SendVerificationEmailJob {
  async execute(payload) {
    try {
      await SendVerificationEmailService.execute(payload);

      logger.info('[MAIL_JOB] verification email sent');
    } catch (error) {
      logger.error('[MAIL_JOB_ERROR]', error);
    }
  }
}

module.exports = new SendVerificationEmailJob();
