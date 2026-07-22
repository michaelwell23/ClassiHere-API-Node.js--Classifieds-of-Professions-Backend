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

  async deleteByToken(token) {
    return UserVerification.destroy({
      where: {
        token,
      },
    });
  }
}

module.exports = new UserVerificationRepository();
