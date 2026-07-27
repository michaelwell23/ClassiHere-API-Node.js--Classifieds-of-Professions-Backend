const { randomUUID } = require('crypto');

const { Op } = require('sequelize');

const PasswordResetToken = require('../../../database/models/PasswordResetToken');

class PasswordResetTokenRepository {
  async create(data, options = {}) {
    return PasswordResetToken.create(
      {
        id: randomUUID(),
        ...data,
      },
      options
    );
  }

  async findActiveById(id, options = {}) {
    return PasswordResetToken.findOne({
      where: {
        id,
        used_at: null,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      ...options,
    });
  }

  async invalidateAllByUserId(userId, options = {}) {
    return PasswordResetToken.update(
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

  async invalidateOthersByUserId(userId, excludedTokenId, options = {}) {
    return PasswordResetToken.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          used_at: null,
          id: {
            [Op.ne]: excludedTokenId,
          },
        },
        ...options,
      }
    );
  }

  async markAsUsed(id, options = {}) {
    const [updatedRows] = await PasswordResetToken.update(
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
}

module.exports = new PasswordResetTokenRepository();
