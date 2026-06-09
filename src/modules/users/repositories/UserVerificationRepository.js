const UserVerficiation = require('../../../database/models/UserVerification');

class UserVerificationRepository {
  async create(data) {
    return UserVerficiation.create(data);
  }

  async findByToken(token) {
    return UserVerficiation.findOne({ where: { token } });
  }

  async delete(id) {
    return UserVerficiation.destroy({ where: { id } });
  }

  async deleteByUser(userId) {
    return UserVerficiation.destroy({ where: { userId: userId } });
  }
}

module.exports = new UserVerificationRepository();
