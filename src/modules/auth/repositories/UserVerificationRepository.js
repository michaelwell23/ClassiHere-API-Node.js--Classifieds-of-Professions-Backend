const { Op } = require('sequelize');

const UserVerification = require('../../../database/models/UserVerification');

class UserVerificationRepository {
  async create(data, options = {}) {
    return UserVerification.create(data, options);
  }

  async findActiveByTokenHash(tokenHash, options = {}) {
    return UserVerification.findOne({
      where: {
        token_hash: tokenHash,
        used_at: null,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      ...options,
    });
  }

  async markAsUsed(id, options = {}) {
    const [updatedRows] = await UserVerification.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          id,
          used_at: null,
        },
        ...options,
      }
    );

    return updatedRows > 0;
  }

  async invalidateAllByUserId(userId, options = {}) {
    return UserVerification.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          used_at: null,
        },
        ...options,
      }
    );
  }

  async invalidateOthersByUserId(userId, excludedVerificationId, options = {}) {
    return UserVerification.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          used_at: null,
          id: {
            [Op.ne]: excludedVerificationId,
          },
        },
        ...options,
      }
    );
  }

  async deleteById(id, options = {}) {
    return UserVerification.destroy({
      where: {
        id,
      },
      ...options,
    });
  }
}

module.exports = new UserVerificationRepository();
