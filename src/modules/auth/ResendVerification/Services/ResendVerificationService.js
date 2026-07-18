const UserRepository = require('../../../users/repositories/UserRepository');
const UserVerificationRepository = require('../../../users/repositories/UserVerificationRepository');

const SendVerificationEmailJob = require('../../../../shared/jobs/SendVerificationEmailJob');
const generateVerificationToken = require('../../../../shared/utils/generate-verification-token');

const authConfig = require('../../../../config/auth');

class ResendVerificationService {
  async execute(email) {
    const user = await UserRepository.findByEmail(email);

    if (!user || user.is_email_verified) {
      return {
        success: true,
        message: 'Se a conta ainda precisar de verificação, um novo e-mail foi enviado.',
      };
    }

    await UserVerificationRepository.deleteByUser(user.id);

    const token = generateVerificationToken();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + authConfig.emailVerification.expiresInHours);

    await UserVerificationRepository.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    SendVerificationEmailJob.execute({
      user,
      token,
    });

    return {
      success: true,
      message: 'Se a conta ainda precisar de verificação, um novo e-mail foi enviado.',
    };
  }
}

module.exports = new ResendVerificationService();
