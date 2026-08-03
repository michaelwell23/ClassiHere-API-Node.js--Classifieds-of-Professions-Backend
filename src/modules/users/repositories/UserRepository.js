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

  async findUsersPendingDeletion(limitDate, options = {}) {
    return User.findAll({
      where: {
        is_active: false,

        deactivated_at: {
          [Op.lte]: limitDate,
        },
      },

      ...options,
    });
  }
}

module.exports = new UserRepository();
