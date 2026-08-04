const { Op } = require('sequelize');

const User = require('../../../database/models/User');

class UserRepository {
  async create(data, options = {}) {
    return User.create(data, options);
  }

  async findById(id, options = {}) {
    return User.findByPk(id, options);
  }

  async findByEmail(email, options = {}) {
    return User.findOne({
      where: {
        email,
      },

      ...options,
    });
  }

  async findByCpf(cpf, options = {}) {
    return User.findOne({
      where: {
        cpf,
      },

      ...options,
    });
  }

  async findByPhone(phone, options = {}) {
    return User.findOne({
      where: {
        phone,
      },

      ...options,
    });
  }

  async update(user, data, options = {}) {
    return user.update(data, options);
  }

  async softDelete(user, options = {}) {
    return user.destroy(options);
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
        },

        paranoid: false,

        ...options,
      }
    );

    return affectedRows;
  }
}

module.exports = new UserRepository();
