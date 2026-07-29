const UserRepository = require('../../users/repositories/UserRepository');

const UserVerificationRepository = require('../repositories/UserVerificationRepository');

const SendVerificationEmailService = require('../../../shared/services/SendVerificationEmailService');

const authConfig = require('../../../config/auth');

const { generateOpaqueToken, hashOpaqueToken } = require('../providers/opaque-token.provider');

const genericResponse = {
  message: 'If the account still requires verification, a new email has been sent.',
};

class ResendVerificationService {
  async execute({ email }) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !user.is_active || user.is_email_verified) {
      return genericResponse;
    }

    const token = generateOpaqueToken();

    const verification = await UserVerificationRepository.create({
      user_id: user.id,
      token_hash: hashOpaqueToken(token),
      expires_at: new Date(
        Date.now() + authConfig.emailVerification.expiresInHours * 60 * 60 * 1000
      ),
    });

    try {
      await SendVerificationEmailService.execute({
        user,
        token,
      });
    } catch (error) {
      await UserVerificationRepository.deleteById(verification.id);

      throw error;
    }

    await UserVerificationRepository.invalidateOthersByUserId(user.id, verification.id);

    return genericResponse;
  }
}

module.exports = new ResendVerificationService();
