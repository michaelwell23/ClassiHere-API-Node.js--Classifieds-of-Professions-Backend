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

  async findByUserId(userId) {
    return UserVerification.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async delete(id) {
    return UserVerification.destroy({
      where: {
        id,
      },
    });
  }

  async deleteByUser(userId) {
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
