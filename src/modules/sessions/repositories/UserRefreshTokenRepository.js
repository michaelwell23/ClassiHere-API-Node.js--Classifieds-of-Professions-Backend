const { randomUUID } = require('crypto');

const UserRefreshToken = require('../../../database/models/UserRefreshToken');

class UserRefreshTokenRepository {
  async create(data) {
    return UserRefreshToken.create({
      id: randomUUID(),

      ...data,
    });
  }

  async findByToken(token) {
    return UserRefreshToken.findOne({
      where: {
        token,
      },
    });
  }

  async findAll() {
    return UserRefreshToken.findAll();
  }

  async delete(id) {
    return UserRefreshToken.destroy({
      where: {
        id,
      },
    });
  }

  async deleteAllByUser(userId) {
    return UserRefreshToken.destroy({
      where: {
        user_id: userId,
      },
    });
  }

  async findAllByUser(userId) {
    return UserRefreshToken.findAll({
      where: {
        user_id: userId,
      },
    });
  }
}

module.exports = new UserRefreshTokenRepository();
