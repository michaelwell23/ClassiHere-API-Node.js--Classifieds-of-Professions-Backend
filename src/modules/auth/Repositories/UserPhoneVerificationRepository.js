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

  async deletePendingByUserId(userId) {
    return UserPhoneVerification.destroy({
      where: {
        user_id: userId,
        verified_at: null,
      },
    });
  }

  async create(data) {
    return UserPhoneVerification.create(data);
  }
}

module.exports = new UserPhoneVerificationRepository();
