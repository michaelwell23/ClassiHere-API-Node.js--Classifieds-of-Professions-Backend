const UserPhoneVerification = require('../../../database/models/UserPhoneVerification');

class UserPhoneVerificationRepository {
  async create(data) {
    return UserPhoneVerification.create(data);
  }

  async findPendingByUserIdAndCode(userId, code) {
    return UserPhoneVerification.findOne({
      where: {
        user_id: userId,
        code,
        verified_at: null,
      },
    });
  }

  async markAsVerified(id) {
    return UserPhoneVerification.update(
      {
        verified_at: new Date(),
      },
      {
        where: {
          id,
          verified_at: null,
        },
      }
    );
  }

  async deletePendingByUserId(userId) {
    return UserPhoneVerification.destroy({
      where: {
        user_id: userId,
        verified_at: null,
      },
    });
  }
}

module.exports = new UserPhoneVerificationRepository();
