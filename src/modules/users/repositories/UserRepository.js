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
    return User.findOne({ where: { email } });
  }

  async findByCpf(cpf) {
    return User.findOne({ where: { cpf } });
  }

  async findByPhone(phone) {
    return User.findOne({ where: { phone } });
  }

  async update(user, data) {
    return user.update(data);
  }

  async updateLastLogin(userId) {
    return User.update(
      {
        last_login_at: new Date(),
      },
      {
        where: {
          id: userId,
        },
      }
    );
  }

  async updateSecurity(user, data, options = {}) {
    return user.update(
      {
        failed_login_attempts: data.failed_login_attempts,
        locked_until: data.locked_until,
      },
      options
    );
  }

  async delete(user) {
    return user.destroy();
  }

  async findUsersPendingDeletion(limitDate) {
    console.log(Op);
    return User.findAll({
      where: {
        is_active: false,
        deleted_at: null,
        deactivated_at: {
          [Op.lte]: limitDate,
        },
      },
    });
  }
}

module.exports = new UserRepository();
