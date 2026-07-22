const { randomUUID } = require('crypto');

const PasswordResetToken = require('../../../database/models/PasswordResetToken');

class PasswordResetTokenRepository {
  async create(data) {
    return PasswordResetToken.create({
      id: randomUUID(),
      ...data,
    });
  }

  async findById(id) {
    return PasswordResetToken.findByPk(id);
  }

  async invalidateAllByUserId(userId) {
    return PasswordResetToken.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          used_at: null,
        },
      }
    );
  }

  async markAsUsed(id) {
    return PasswordResetToken.update(
      {
        used_at: new Date(),
      },
      {
        where: {
          id,
          used_at: null,
        },
      }
    );
  }
}

module.exports = new PasswordResetTokenRepository();
