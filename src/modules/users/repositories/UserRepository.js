const { Op } = require('sequelize');

const User = require('../../../database/models/User');

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async findByEmail(email) {
    return User.findOne({
      where: {
        email,
      },
    });
  }

  async findByCpf(cpf) {
    return User.findOne({
      where: {
        cpf,
      },
    });
  }

  async findByPhone(phone) {
    return User.findOne({
      where: {
        phone,
      },
    });
  }

  async update(user, data, options = {}) {
    return user.update(data, options);
  }

  async softDelete(user) {
    return user.destroy();
  }

  async findUsersPendingDeletion(limitDate) {
    return User.findAll({
      where: {
        is_active: false,
        deactivated_at: {
          [Op.lte]: limitDate,
        },
      },
    });
  }

  async softDeleteUsersPendingDeletion(limitDate, options = {}) {
    const [affectedRows] = await User.update(
      {
        deleted_at: new Date(),
      },
      {
        where: {
          deletion_requested_at: {
            [Op.lte]: limitDate,
          },

          deleted_at: null,

          // Ajustar conforme os campos reais:
          deletion_cancelled_at: null,
        },

        transaction: options.transaction,
      }
    );

    return affectedRows;
  }
}

module.exports = new UserRepository();
