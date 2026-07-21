const { randomUUID } = require('crypto');

const UserRefreshToken = require('../../../database/models/UserRefreshToken');

class UserRefreshTokenRepository {
  async create(data) {
    return UserRefreshToken.create({
      id: randomUUID(),
      ...data,
    });
  }

  async findByJti(jti) {
    return UserRefreshToken.findOne({
      where: {
        jti,
      },
    });
  }

  async delete(id) {
    return UserRefreshToken.destroy({
      where: {
        id,
      },
    });
  }

  async deleteAllByUserId(userId) {
    return UserRefreshToken.destroy({
      where: {
        user_id: userId,
      },
    });
  }
}

module.exports = new UserRefreshTokenRepository();
