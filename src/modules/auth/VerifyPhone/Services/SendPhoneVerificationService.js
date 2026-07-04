const UserRepository = require('../../users/repositories/UserRepository');
const UserPhoneVerificationRepository = require('../repositories/UserPhoneVerificationRepository');
const LocalPhoneProvider = require('../../../shared/providers/phone/local.provider');

class SendPhoneVerificationService {
  async execute(userId) {
    const user = await UserRepository.findById(userId);

    if (user.is_phone_verified) {
      return {
        message: 'Phone number is already verified.',
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await UserPhoneVerificationRepository.deletePendingByUserId(user.id);

    await UserPhoneVerificationRepository.create({
      user_id: user.id,
      code,
      expires_at: expiresAt,
    });

    await LocalPhoneProvider.send({
      phone: user.phone,
      code,
      expiresAt,
    });

    return {
      message: 'Verification code sent successfully.',
    };
  }
}

module.exports = new SendPhoneVerificationService();
