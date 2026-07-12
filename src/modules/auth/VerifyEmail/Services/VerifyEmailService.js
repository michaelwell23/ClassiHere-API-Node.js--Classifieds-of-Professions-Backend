const AppError = require('../../../../shared/errors/AppError');

const UserRepository = require('../../../users/Repositories/UserRepository');

const UserVerificationRepository = require('../../../users/Repositories/UserVerificationRepository');

class VerifyEmailService {
  async execute(token) {
    const verification = await UserVerificationRepository.findByToken(token);

    if (!verification) {
      throw new AppError('Invalid verification token', 400);
    }

    const now = new Date();

    if (verification.expires_at < now) {
      throw new AppError('Verification token expired', 400);
    }

    const user = await UserRepository.findById(verification.user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await UserRepository.update(user, {
      is_email_verified: true,
    });

    await UserVerificationRepository.deleteByToken(token);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }
}

module.exports = new VerifyEmailService();
