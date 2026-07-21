const AppError = require('../../../shared/errors/AppError');

const UserRepository = require('../repositories/UserRepository');

class GetUserService {
  async execute({ id, authenticatedUserId }) {
    if (id !== authenticatedUserId) {
      throw new AppError('You are not allowed to access this user', 403);
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new GetUserService();
