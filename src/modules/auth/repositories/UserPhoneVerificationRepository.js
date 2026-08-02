const { Op } = require('sequelize');

const UserPhoneVerification = require('../../../database/models/UserPhoneVerification');

class UserPhoneVerificationRepository {
  async create(data, options = {}) {
    return UserPhoneVerification.create(data, options);
  }

  async findLatestPendingByUserId(userId, options = {}) {
    return UserPhoneVerification.findOne({
      where: {
        user_id: userId,
        verified_at: null,
      },

      order: [['created_at', 'DESC']],

      ...options,
    });
  }

  async findRecentPendingByUserId(userId, createdAfter, options = {}) {
    return UserPhoneVerification.findOne({
      where: {
        user_id: userId,
        verified_at: null,

        created_at: {
          [Op.gte]: createdAfter,
        },
      },

      order: [['created_at', 'DESC']],

      ...options,
    });
  }

  async incrementAttempts(id, options = {}) {
    return UserPhoneVerification.increment(
      {
        attempts: 1,
      },
      {
        where: {
          id,
          verified_at: null,
        },

        ...options,
      }
    );
  }

  async markAsVerified(id, options = {}) {
    const [updatedRows] = await UserPhoneVerification.update(
      {
        verified_at: new Date(),
      },
      {
        where: {
          id,
          verified_at: null,
        },

        ...options,
      }
    );

    return updatedRows > 0;
  }

  async invalidatePendingByUserIdExcept(userId, excludedVerificationId, options = {}) {
    return UserPhoneVerification.update(
      {
        verified_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          verified_at: null,

          id: {
            [Op.ne]: excludedVerificationId,
          },
        },

        ...options,
      }
    );
  }

  async deleteById(id, options = {}) {
    return UserPhoneVerification.destroy({
      where: {
        id,
      },

      ...options,
    });
  }
}

module.exports = new UserPhoneVerificationRepository();
