const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

class UpdateUserService {
  async execute(id, data) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await UserRepository.update(user, data);

    return user;
  }
}

module.exports = new UpdateUserService();
