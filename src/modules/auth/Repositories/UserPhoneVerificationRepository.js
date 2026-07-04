const UserPhoneVerification = require('../../../database/models/UserPhoneVerification');

class UserPhoneVerificationRepository {
  async findByUserIdAndCode(userId, code) {
    return UserPhoneVerification.findOne({
      where: {
        user_id: userId,
        code,
      },
    });
  }

  async invalidate(id) {
    return UserPhoneVerification.update(
      {
        verified_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );
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
