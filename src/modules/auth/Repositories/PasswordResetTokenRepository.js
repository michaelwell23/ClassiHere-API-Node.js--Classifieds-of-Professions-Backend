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

  async findAllByUser(userId) {
    return PasswordResetToken.findAll({
      where: {
        user_id: userId,
      },
    });
  }

  async findActiveByUser(userId) {
    return PasswordResetToken.findAll({
      where: {
        user_id: userId,
        used_at: null,
      },
    });
  }

  async invalidateAllByUser(userId) {
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
        },
      }
    );
  }

  async update(id, data) {
    await PasswordResetToken.update(data, {
      where: {
        id,
      },
    });

    return this.findById(id);
  }
}

module.exports = new PasswordResetTokenRepository();
