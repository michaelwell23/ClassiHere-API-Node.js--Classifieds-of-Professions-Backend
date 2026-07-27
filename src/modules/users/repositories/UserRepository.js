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
}

module.exports = new UserRepository();
