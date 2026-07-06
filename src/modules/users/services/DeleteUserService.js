const UserRepository = require('../repositories/UserRepository');

const AppError = require('../../../shared/errors/AppError');
class DeleteUserService {
  async execute(id) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    await UserRepository.delete(user);

    return {
      message: 'User deleted successfully.',
    };
  }
}

module.exports = new DeleteUserService();
