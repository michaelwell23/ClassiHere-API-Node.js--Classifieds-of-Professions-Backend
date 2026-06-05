const UserVerfication = require('../../../database/models/UserVerification');

class UserVerificationRepository {
  async create(data) {
    return UserVerfication.create(data);
  }

  async findByToken(token) {
    return UserVerfication.findOne({ where: { token } });
  }

  async findByUserId(userId) {
    return UserVerfication.findOne({ where: { userId } });
  }

  async delete(verification) {
    return verification.destroy();
  }
}

module.exports = new UserVerificationRepository();
