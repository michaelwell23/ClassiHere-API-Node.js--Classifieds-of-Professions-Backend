const User = require('../../../database/models/User');
const Op = require('sequelize');
class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async save(user) {
    return user.save();
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

  async update(user, data) {
    return user.update(data);
  }

  async delete(user) {
    return user.destroy();
  }
  async updateProfileImage(userId, profileImage) {
    await User.update(
      {
        profile_image: profileImage,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    return this.findById(userId);
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
}

module.exports = new UserRepository();
