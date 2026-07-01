const User = require('../../../database/models/User');

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
}

module.exports = new UserRepository();
