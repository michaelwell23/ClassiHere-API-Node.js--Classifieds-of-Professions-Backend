const database = require('../../../database');
const UserRefreshToken = require('../../../database/models/UserRefreshToken');

class UserRefreshTokenRepository {
  async create(data) {
    return UserRefreshToken.create(data);
  }

  async findByJti(jti) {
    return UserRefreshToken.findOne({
      where: {
        jti,
      },
    });
  }

  async findByTokenHash(tokenHash) {
    return UserRefreshToken.findOne({
      where: {
        token_hash: tokenHash,
      },
    });
  }

  async deleteById(id) {
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

  async rotate(sessionId, data) {
    return database.transaction(async (transaction) => {
      const deletedSessions = await UserRefreshToken.destroy({
        where: {
          id: sessionId,
        },
        transaction,
      });

      if (deletedSessions === 0) {
        return null;
      }

      return UserRefreshToken.create(data, {
        transaction,
      });
    });
  }
}

module.exports = new UserRefreshTokenRepository();
