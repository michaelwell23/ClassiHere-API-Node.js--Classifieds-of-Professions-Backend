const UserPhoneVerification = require('../../../database/models/UserPhoneVerification');

class UserPhoneVerificationRepository {
  async findValidCode(userId, code) {
    return UserPhoneVerification.findOne({
      where: {
        user_id: userId,
        code,
        verified_at: null,
      },
    });
  }

  async save(verification) {
    return verification.save();
  }
}

module.exports = new UserPhoneVerificationRepository();
