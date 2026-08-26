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
        invalidated_at: null,
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
          invalidated_at: null,
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
          invalidated_at: null,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },

        ...options,
      }
    );

    return updatedRows > 0;
  }

  async invalidatePendingByUserIdExcept(userId, excludedVerificationId, options = {}) {
    return UserPhoneVerification.update(
      {
        invalidated_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          verified_at: null,
          invalidated_at: null,
          id: {
            [Op.ne]: excludedVerificationId,
          },
        },

        ...options,
      }
    );
  }
}

module.exports = new UserPhoneVerificationRepository();
