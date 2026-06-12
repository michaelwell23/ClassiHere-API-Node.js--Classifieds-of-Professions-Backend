const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

class GetUserService {
  async execute(id) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new GetUserService();
