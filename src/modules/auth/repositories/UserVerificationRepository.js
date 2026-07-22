const UserVerification = require('../../../database/models/UserVerification');

class UserVerificationRepository {
  async create(data) {
    return UserVerification.create(data);
  }

  async findByToken(token) {
    return UserVerification.findOne({
      where: {
        token,
      },
    });
  }

  async deleteByUserId(userId) {
    return UserVerification.destroy({
      where: {
        user_id: userId,
      },
    });
  }
}

module.exports = new UserVerificationRepository();
