const database = require('../../../database');

const UserRefreshToken = require('../../../database/models/UserRefreshToken');

class UserRefreshTokenRepository {
  async create(data, options = {}) {
    return UserRefreshToken.create(data, options);
  }

  async findByJti(jti, options = {}) {
    return UserRefreshToken.findOne({
      where: {
        jti,
      },

      ...options,
    });
  }

  async findByTokenHash(tokenHash, options = {}) {
    return UserRefreshToken.findOne({
      where: {
        token_hash: tokenHash,
      },

      ...options,
    });
  }

  async deleteById(id, options = {}) {
    return UserRefreshToken.destroy({
      where: {
        id,
      },

      ...options,
    });
  }

  async deleteAllByUserId(userId, options = {}) {
    return UserRefreshToken.destroy({
      where: {
        user_id: userId,
      },

      ...options,
    });
  }

  async rotate(sessionId, newSessionData) {
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

      return UserRefreshToken.create(newSessionData, {
        transaction,
      });
    });
  }
}

module.exports = new UserRefreshTokenRepository();
